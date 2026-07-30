import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { updateJob } from "@/lib/slicerQueue";

const execPromise = promisify(exec);

// PrusaSlicer can be verbose during slicing (progress, warnings) — default 1MB would overflow on complex models.
// 3 slice passes on a dense mesh (370K+ triangles) can take 3–8 min, so give each pass 10 min.
const EXEC_OPTS = { maxBuffer: 64 * 1024 * 1024, timeout: 600_000 } as const;

const PRUSA_SLICER_PATH =
    process.env.PRUSA_SLICER_PATH ||
    "/Applications/PrusaSlicer.app/Contents/MacOS/PrusaSlicer";

export interface SlicerResult {
    volumeCm3: number;
    weightGrams: number;
    printTime: string;
    dimensions: { x: number; y: number; z: number };
    supportVolumeCm3: number;
    filamentCm3: number;
    needsSupport: boolean;
    isManifold: boolean;
    shellVolumeCm3: number;
    infillSlopeCm3PerPercent: number;
    shellPrintTime: string;
}

async function runInfo(filePath: string): Promise<{
    volumeMm3: number;
    dimensions: { x: number; y: number; z: number };
    isManifold: boolean;
}> {
    const { stdout } = await execPromise(
        `"${PRUSA_SLICER_PATH}" --max-print-height 1000 --info "${filePath}" 2>&1`,
        EXEC_OPTS
    );

    const volumeMatch  = stdout.match(/volume\s*=\s*([\d.]+)/);
    const sizeX        = stdout.match(/size_x\s*=\s*([\d.]+)/);
    const sizeY        = stdout.match(/size_y\s*=\s*([\d.]+)/);
    const sizeZ        = stdout.match(/size_z\s*=\s*([\d.]+)/);
    const manifoldLine = stdout.match(/manifold\s*=\s*(\w+)/);

    return {
        volumeMm3: volumeMatch ? parseFloat(volumeMatch[1]) : 0,
        dimensions: {
            x: sizeX ? parseFloat(sizeX[1]) : 0,
            y: sizeY ? parseFloat(sizeY[1]) : 0,
            z: sizeZ ? parseFloat(sizeZ[1]) : 0,
        },
        isManifold: manifoldLine ? manifoldLine[1] === "yes" : false,
    };
}

async function runSlice(
    filePath: string,
    withSupport: boolean,
    fillDensity = 20,
    supportDensity = 15,
    supportAngle = 45
): Promise<{ printTime: string; filamentCm3: number }> {
    const tempGcode = path.join(process.cwd(), "tmp", `slice_${Date.now()}_${Math.random().toString(36).slice(2)}.gcode`);
    const tmpDir = path.dirname(tempGcode);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // --fill-density ต้องมี % ต่อท้าย (เลขเปล่าถูกตีความเป็นสัดส่วน 0-1 ใน PrusaSlicer 2.7.x → "Value out of range")
    // --support-material-buildplate-only เป็น boolean flag ห้ามมีค่าตามหลัง และ --support-material-density ไม่มีใน CLI
    const supportFlags = withSupport
        ? `--support-material --support-material-threshold ${supportAngle}`
        : "";
    await execPromise(
        `"${PRUSA_SLICER_PATH}" --max-print-height 1000 --export-gcode --fill-density ${fillDensity}% ${supportFlags} --output "${tempGcode}" "${filePath}" 2>&1`,
        EXEC_OPTS
    );

    // grep only the 2 comment lines we need — avoids loading a potentially 100–500 MB gcode file into RAM
    let timeMatch: RegExpMatchArray | null = null;
    let volumeMatch: RegExpMatchArray | null = null;
    try {
        const { stdout: grepOut } = await execPromise(
            `grep -E "; estimated printing time|; filament used \\[cm3\\]" "${tempGcode}"`,
            { maxBuffer: 64 * 1024 }
        );
        timeMatch   = grepOut.match(/; estimated printing time \(normal mode\) = (.+)/);
        volumeMatch = grepOut.match(/; filament used \[cm3\] = ([\d.]+)/);
    } catch { /* grep exits 1 if no match — treat as no data */ }
    try { await fs.promises.unlink(tempGcode); } catch { }

    return {
        printTime: timeMatch ? timeMatch[1].trim() : "N/A",
        filamentCm3: volumeMatch ? parseFloat(volumeMatch[1]) : 0,
    };
}

export async function analyzeFile(
    filePath: string,
    densityGPerCm3 = 1.15,
    jobId?: string,
    supportDensity = 15,
    supportAngle = 45
): Promise<SlicerResult> {
    console.log(`[SLICER] Analyzing: ${filePath}`);

    if (!fs.existsSync(PRUSA_SLICER_PATH)) {
        console.warn(`[SLICER] ❌ PrusaSlicer not found at: ${PRUSA_SLICER_PATH}`);
        console.warn(`[SLICER] Set PRUSA_SLICER_PATH in .env.local to enable real analysis`);
        if (jobId) updateJob(jobId, { status: "processing", step: "Mock (PrusaSlicer ไม่พบ)" });
        return mockAnalyze(densityGPerCm3);
    }

    try {
        // Step 1: ดึง volume และ dimensions
        if (jobId) updateJob(jobId, { status: "processing", step: "วิเคราะห์ mesh (--info)" });
        const info = await runInfo(filePath);
        const volumeCm3 = info.volumeMm3 / 1000;

        // โมเดลใหญ่เกิน 1 เมตร = หน่วยในไฟล์ผิดเกือบแน่นอน (เช่น export เป็น µm/inch)
        const maxDim = Math.max(info.dimensions.x, info.dimensions.y, info.dimensions.z);
        if (maxDim > 1000) {
            throw new Error(
                `โมเดลมีขนาด ${(maxDim / 1000).toFixed(1)} เมตร ซึ่งใหญ่ผิดปกติ — กรุณาตรวจสอบหน่วยของไฟล์ (ควรเป็นมิลลิเมตร) แล้ว export ใหม่`
            );
        }

        // Step 2: Slice ที่ infill 20% ไม่มี support → เวลาพิมพ์ + filament อ้างอิง
        if (jobId) updateJob(jobId, { status: "processing", step: "Slice ไม่มี support (infill 20%)" });
        const sliceNoSupport = await runSlice(filePath, false, 20, supportDensity, supportAngle);

        // Step 2b: Slice ที่ infill 0% ไม่มี support → shell volume จริง (ผนัง+top/bottom ล้วนๆ)
        // ใช้เป็น baseline แม่นยำสำหรับคำนวณราคาตาม infill ที่ user ปรับ โดยไม่ต้อง re-slice ทุกครั้ง
        if (jobId) updateJob(jobId, { status: "processing", step: "Slice หา shell volume (infill 0%)" });
        let sliceShell = { printTime: sliceNoSupport.printTime, filamentCm3: sliceNoSupport.filamentCm3 * 0.6 };
        try {
            sliceShell = await runSlice(filePath, false, 0, supportDensity, supportAngle);
        } catch {
            // ถ้า slice ที่ infill 0% ล้มเหลว ใช้ค่าประมาณ
        }

        // Step 3: Slice มี support (infill 20%) → filament รวม support
        if (jobId) updateJob(jobId, { status: "processing", step: `Slice พร้อม support (${supportDensity}% / ${supportAngle}°)` });
        let sliceWithSupport = sliceNoSupport;
        let needsSupport = false;
        let supportVolumeCm3 = 0;

        try {
            sliceWithSupport = await runSlice(filePath, true, 20, supportDensity, supportAngle);
            const diff = sliceWithSupport.filamentCm3 - sliceNoSupport.filamentCm3;
            supportVolumeCm3 = Math.max(0, diff);
            needsSupport = supportVolumeCm3 > 0.01;
        } catch {
            // ถ้า slice with support ล้มเหลว ใช้ค่า no-support
        }

        const weightGrams = volumeCm3 * densityGPerCm3;

        // infill เปลี่ยนจาก 0% → 20% เพิ่ม filament เท่าไหร่ ⇒ slope ต่อ 1% (เส้นตรง)
        const infillVolumeAt20 = Math.max(0, sliceNoSupport.filamentCm3 - sliceShell.filamentCm3);
        const infillSlopeCm3PerPercent = infillVolumeAt20 / 20;

        const result: SlicerResult = {
            volumeCm3:        parseFloat(volumeCm3.toFixed(4)),
            weightGrams:      parseFloat(weightGrams.toFixed(2)),
            printTime:        sliceNoSupport.printTime,
            dimensions: {
                x: parseFloat(info.dimensions.x.toFixed(2)),
                y: parseFloat(info.dimensions.y.toFixed(2)),
                z: parseFloat(info.dimensions.z.toFixed(2)),
            },
            supportVolumeCm3: parseFloat(supportVolumeCm3.toFixed(4)),
            filamentCm3:      parseFloat(sliceWithSupport.filamentCm3.toFixed(4)),
            needsSupport,
            isManifold:       info.isManifold,
            shellVolumeCm3:   parseFloat(sliceShell.filamentCm3.toFixed(4)),
            infillSlopeCm3PerPercent: parseFloat(infillSlopeCm3PerPercent.toFixed(6)),
            shellPrintTime:   sliceShell.printTime,
        };

        console.log(`[SLICER] ✅ Done — Vol: ${result.volumeCm3}cm³, Weight: ${result.weightGrams}g, Time: ${result.printTime}, Support: ${needsSupport}`);
        return result;

    } catch (error: any) {
        // ห้าม fallback เป็นค่าสุ่ม — ลูกค้าจะได้ใบเสนอราคามั่วโดยไม่รู้ตัว
        console.error("[SLICER] ❌ Analysis failed:", error.message);

        // ข้อความที่โยนเองเป็นภาษาคนแล้ว (เช่น เช็คขนาดเกิน 1 เมตร) → ส่งต่อตรง ๆ
        if (!/^Command failed/.test(error.message || "")) throw error;

        // command พัง → ดึงเฉพาะบรรทัด error ที่มีความหมาย ไม่โชว์ path/คำสั่งดิบให้ผู้ใช้
        const lines = (error.message || "").split("\n").slice(1).map((s: string) => s.trim()).filter(Boolean);
        const hint = (lines.find((l: string) => /error|failed|invalid/i.test(l)) || "")
            .replace(/^\[[^\]]*\]\s*\[[^\]]*\]\s*\[error\]\s*/i, "")   // ตัด timestamp prefix ของ PrusaSlicer
            .replace(/\/[^\s"]*\/(uploads|tmp)\/[^\s"]*/g, "ไฟล์")     // ตัด path ภายในเซิร์ฟเวอร์
            .slice(0, 180);
        throw new Error(`ไม่สามารถวิเคราะห์ไฟล์ได้ กรุณาตรวจสอบว่าไฟล์ 3D ถูกต้อง${hint ? ` (${hint})` : ""}`);
    }
}

function mockAnalyze(densityGPerCm3 = 1.15): SlicerResult {
    const volumeCm3 = parseFloat((Math.random() * 50 + 5).toFixed(4));
    const filamentCm3 = parseFloat((volumeCm3 * 0.2).toFixed(4));
    const shellVolumeCm3 = parseFloat((filamentCm3 * 0.6).toFixed(4));
    return {
        volumeCm3,
        weightGrams:      parseFloat((volumeCm3 * densityGPerCm3).toFixed(2)),
        printTime:        "2h 45m",
        dimensions: {
            x: Math.round(Math.random() * 100 + 20),
            y: Math.round(Math.random() * 100 + 20),
            z: Math.round(Math.random() * 50 + 10),
        },
        supportVolumeCm3: 0,
        filamentCm3,
        needsSupport:     false,
        isManifold:       true,
        shellVolumeCm3,
        infillSlopeCm3PerPercent: parseFloat(((filamentCm3 - shellVolumeCm3) / 20).toFixed(6)),
        shellPrintTime:   "2h 0m",
    };
}
