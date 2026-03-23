import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { analyzeFile } from "@/lib/slicer";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized: กรุณาเข้าสู่ระบบก่อนทำการอัปโหลดไฟล์" }, { status: 401 });
        }

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

        console.log("4. Uploading to Cloudflare R2...");
        let r2FileUrl = null;
        let r2Key = null;
        
        try {
            r2Key = `3d-prints/${fileName}`;

            // Read file buffer again for upload
            const fileData = await fs.readFile(filePath);
            
            await r2Client.send(
                new PutObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: r2Key,
                    Body: fileData,
                    ContentType: "application/octet-stream",
                })
            );
            
            // If custom domain exists, use it. Otherwise use generic public bucket URL template
            r2FileUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${r2Key}` : `https://pub-xxxxxx.r2.dev/${r2Key}`;
            
        } catch (r2Error: any) {
            console.error("R2 Upload Failed:", r2Error.message || r2Error);
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

        // ดึง userId อย่างรัดกุม (กรณีคุกกี้เก่าไม่มี id ฝังอยู่)
        let userId = (session?.user as any)?.id;
        if (!userId && session?.user?.email) {
            const User = require("@/models/User").default;
            const userDb = await User.findOne({ email: session.user.email });
            if (userDb) userId = userDb._id;
        }

        const quote = await Quote.create({
            userId: userId || null,
            fileName,
            originalName: file.name,
            fileUrl: r2FileUrl || null,
            cloudinaryId: r2Key || null,
            isStoredInCloud: !!r2FileUrl,
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
