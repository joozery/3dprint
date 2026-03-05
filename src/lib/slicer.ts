import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execPromise = promisify(exec);

// Path to PrusaSlicer executable - Update this based on your installation
const PRUSA_SLICER_PATH = process.env.PRUSA_SLICER_PATH || "/Applications/PrusaSlicer.app/Contents/MacOS/PrusaSlicer";

interface SlicerResult {
    volumeCm3: number;
    weightGrams: number;
    printTime: string; // "1h 23m"
    dimensions: {
        x: number;
        y: number;
        z: number;
    };
}

export async function analyzeFile(filePath: string): Promise<SlicerResult> {
    console.log(`[SLICER] Analyzing file: ${filePath}`);
    console.log(`[SLICER] Looking for PrusaSlicer at: ${PRUSA_SLICER_PATH}`);

    // Check if PrusaSlicer exists
    if (!fs.existsSync(PRUSA_SLICER_PATH)) {
        console.warn(`[SLICER] ❌ PrusaSlicer NOT FOUND. Using mock data.`);
        console.warn(`[SLICER] TIP: Please set PRUSA_SLICER_PATH in your .env.local if installed elsewhere.`);
        return mockAnalyze();
    }

    console.log(`[SLICER] ✅ PrusaSlicer found!`);

    try {
        const tempGcode = path.join(process.cwd(), "tmp", `analysis_${Date.now()}.gcode`);

        // Ensure tmp dir exists
        const tmpDir = path.dirname(tempGcode);
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        // Slice the model
        await execPromise(`"${PRUSA_SLICER_PATH}" --export-gcode --slice "${filePath}" --output "${tempGcode}"`);

        // PrusaSlicer outputs info to stdout and inside the gcode file header
        const gcodeContent = await fs.promises.readFile(tempGcode, 'utf-8');

        // Advanced Parsing
        const volumeMatch = gcodeContent.match(/filament used \[cm3\] = ([\d.]+)/);
        const weightMatch = gcodeContent.match(/filament used \[g\] = ([\d.]+)/);
        const timeMatch = gcodeContent.match(/; estimated printing time \(normal mode\) = (.*)/);

        // Dimensions search (Prusa usually puts this in comments at the top)
        // Format: ; size_x = 100, size_y = 50, size_z = 20
        const sizeX = gcodeContent.match(/; size_x = ([\d.]+)/);
        const sizeY = gcodeContent.match(/; size_y = ([\d.]+)/);
        const sizeZ = gcodeContent.match(/; size_z = ([\d.]+)/);

        // Cleanup
        try { await fs.promises.unlink(tempGcode); } catch { }

        console.log(`[SLICER] Analysis complete! Volume: ${volumeMatch ? volumeMatch[1] : 'unknown'} cm3, Time: ${timeMatch ? timeMatch[1] : 'unknown'}`);

        return {
            volumeCm3: volumeMatch ? parseFloat(volumeMatch[1]) : 10,
            weightGrams: weightMatch ? parseFloat(weightMatch[1]) : 12,
            printTime: timeMatch ? timeMatch[1] : "N/A",
            dimensions: {
                x: sizeX ? parseFloat(sizeX[1]) : 50,
                y: sizeY ? parseFloat(sizeY[1]) : 50,
                z: sizeZ ? parseFloat(sizeZ[1]) : 50
            }
        };
    } catch (error: any) {
        console.error("[SLICER] ❌ Real slicing failed:", error.message);
        return mockAnalyze();
    }
}

function mockAnalyze(): SlicerResult {
    return {
        volumeCm3: Math.random() * 50 + 5,
        weightGrams: Math.random() * 60 + 5,
        printTime: "2h 45m",
        dimensions: {
            x: Math.round(Math.random() * 100 + 20),
            y: Math.round(Math.random() * 100 + 20),
            z: Math.round(Math.random() * 50 + 10)
        }
    };
}
