import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { updateJob } from "@/lib/slicerQueue";

const execPromise = promisify(exec);

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
}

async function runInfo(filePath: string): Promise<{
    volumeMm3: number;
    dimensions: { x: number; y: number; z: number };
    isManifold: boolean;
}> {
    const { stdout } = await execPromise(
        `"${PRUSA_SLICER_PATH}" --info "${filePath}" 2>&1`
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
    supportDensity = 15,
    supportAngle = 45
): Promise<{ printTime: string; filamentCm3: number }> {
    const tempGcode = path.join(process.cwd(), "tmp", `slice_${Date.now()}.gcode`);
    const tmpDir = path.dirname(tempGcode);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const supportFlags = withSupport
        ? `--support-material --support-material-buildplate-only 0 --support-material-threshold ${supportAngle} --support-material-density ${supportDensity}`
        : "";
    await execPromise(
        `"${PRUSA_SLICER_PATH}" --export-gcode ${supportFlags} --output "${tempGcode}" "${filePath}" 2>&1`
    );

    const gcode = await fs.promises.readFile(tempGcode, "utf-8");
    try { await fs.promises.unlink(tempGcode); } catch { }

    const timeMatch   = gcode.match(/; estimated printing time \(normal mode\) = (.+)/);
    const volumeMatch = gcode.match(/; filament used \[cm3\] = ([\d.]+)/);

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

        // Step 2: Slice ไม่มี support → เวลาพิมพ์
        if (jobId) updateJob(jobId, { status: "processing", step: "Slice ไม่มี support" });
        const sliceNoSupport = await runSlice(filePath, false, supportDensity, supportAngle);

        // Step 3: Slice มี support → filament รวม support
        if (jobId) updateJob(jobId, { status: "processing", step: `Slice พร้อม support (${supportDensity}% / ${supportAngle}°)` });
        let sliceWithSupport = sliceNoSupport;
        let needsSupport = false;
        let supportVolumeCm3 = 0;

        try {
            sliceWithSupport = await runSlice(filePath, true, supportDensity, supportAngle);
            const diff = sliceWithSupport.filamentCm3 - sliceNoSupport.filamentCm3;
            supportVolumeCm3 = Math.max(0, diff);
            needsSupport = supportVolumeCm3 > 0.01;
        } catch {
            // ถ้า slice with support ล้มเหลว ใช้ค่า no-support
        }

        const weightGrams = volumeCm3 * densityGPerCm3;

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
        };

        console.log(`[SLICER] ✅ Done — Vol: ${result.volumeCm3}cm³, Weight: ${result.weightGrams}g, Time: ${result.printTime}, Support: ${needsSupport}`);
        return result;

    } catch (error: any) {
        console.error("[SLICER] ❌ Analysis failed:", error.message);
        return mockAnalyze(densityGPerCm3);
    }
}

function mockAnalyze(densityGPerCm3 = 1.15): SlicerResult {
    const volumeCm3 = parseFloat((Math.random() * 50 + 5).toFixed(4));
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
        filamentCm3:      parseFloat((volumeCm3 * 0.2).toFixed(4)),
        needsSupport:     false,
        isManifold:       true,
    };
}
