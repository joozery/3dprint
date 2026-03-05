import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { analyzeFile } from "@/lib/slicer";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("1. Connecting to DB...");
        try {
            await dbConnect();
        } catch (dbErr: any) {
            console.error("Database Connection Error:", dbErr);
            throw new Error(`Database Error: ${dbErr.message || "Failed to connect to database"}`);
        }

        console.log("2. Saving file locally...");
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}${path.extname(file.name)}`;
        const uploadDir = path.join(process.cwd(), "tmp", "uploads");

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        console.log("3. Analyzing file...");
        // Analyze the file
        const analysis = await analyzeFile(filePath);

        console.log("4. Uploading to Cloudinary...");
        // Upload to Cloudinary
        let cloudinaryResponse = null;
        try {
            cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
                resource_type: "raw", // Use raw for 3D files
                folder: "3d-prints",
            });
        } catch (cldError: any) {
            console.warn("Cloudinary Upload Skipped/Failed:", cldError.message);
            // If it's just a size limit error, we don't want to crash the whole quote process
            if (cldError.message?.includes("File size too large")) {
                console.log("File is > 10MB, proceeding without Cloudinary storage.");
            } else {
                // For other errors (like config), we might still want to know, 
                // but let's make it more resilient for now
            }
        }

        // Delete local file after analysis and upload
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.warn("Failed to delete local temp file:", err);
        }

        // Initial price calculation (placeholder logic)
        const basePrice = 50; // ราคาตั้งต้น
        const pricePerCm3 = 5; // บาทต่อ cm3
        const totalPrice = basePrice + (analysis.volumeCm3 * pricePerCm3);

        const quote = await Quote.create({
            fileName,
            originalName: file.name,
            fileUrl: cloudinaryResponse?.secure_url || null,
            cloudinaryId: cloudinaryResponse?.public_id || null,
            isStoredInCloud: !!cloudinaryResponse,
            technology: "sla",
            material: "9600",
            color: "ขาวด้าน (Matte White)",
            quantity: 1,
            volumeCm3: analysis.volumeCm3,
            weightGrams: analysis.weightGrams,
            printTime: analysis.printTime,
            dimensions: analysis.dimensions,
            priceDetail: {
                pricePerUnit: totalPrice,
                totalPrice: totalPrice,
                setupFee: basePrice,
            }
        });

        return NextResponse.json({
            success: true,
            quoteId: quote._id,
            data: quote
        });

    } catch (error: any) {
        console.error("DEBUG - Upload error details:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json({
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
