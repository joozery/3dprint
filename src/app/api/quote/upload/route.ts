import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { analyzeFile } from "@/lib/slicer";
import { calculatePrice, parsePrintTimeToMinutes } from "@/lib/pricing";
import { createJob, finishJob } from "@/lib/slicerQueue";
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
        const jobId = fileName.replace(/\.[^.]+$/, ""); // use uuid part as jobId
        const userIdForJob = (session?.user as any)?.id || session?.user?.email || "unknown";
        createJob(jobId, fileName, file.name, userIdForJob);
        let analysis;
        try {
            analysis = await analyzeFile(filePath, 1.15, jobId);
            finishJob(jobId, true);
        } catch (slicerErr: any) {
            finishJob(jobId, false, slicerErr.message);
            throw slicerErr;
        }

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

        // If R2 upload fails, we must keep the file locally so admin can download it
        if (!r2FileUrl) {
            console.warn("R2 upload failed, falling back to local public storage...");
            const publicUploadDir = path.join(process.cwd(), "public", "uploads");
            try {
                await fs.access(publicUploadDir);
            } catch {
                await fs.mkdir(publicUploadDir, { recursive: true });
            }
            const publicFilePath = path.join(publicUploadDir, fileName);
            await fs.copyFile(filePath, publicFilePath);
            r2FileUrl = `/uploads/${fileName}`;
        }

        // Always Delete local temp file after it's either in R2 or in public/uploads
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.warn("Failed to delete local temp file:", err);
        }

        // Dynamic price calculation using MaterialConfig (สูตรที่ 3: วัสดุ + เวลา + setup)
        const MaterialConfig = require("@/models/MaterialConfig").default;
        const defaultMat = await MaterialConfig.findOne({ isActive: true }).sort({ createdAt: 1 });
        let selTech = "sla";
        let selMat = "";
        let selColor = "ขาวด้าน (Matte White)";

        const density       = defaultMat?.density || 1.15;
        const sellPerGram   = defaultMat?.pricing?.sellPerGram   || 1;
        const sellPerMinute = defaultMat?.pricing?.sellPerMinute || 0;
        const setupFee      = defaultMat?.pricing?.setupFee      || 0;

        if (defaultMat) {
            selTech  = defaultMat.technology;
            selMat   = defaultMat._id.toString();
            selColor = defaultMat.colors?.[0] || "ขาวด้าน (Matte White)";
        }

        const printTimeMinutes = parsePrintTimeToMinutes(analysis.printTime);

        const priceBreakdown = calculatePrice({
            filamentCm3:       (analysis as any).filamentCm3      || analysis.volumeCm3,
            supportVolumeCm3:  (analysis as any).supportVolumeCm3 || 0,
            density,
            sellPerGram,
            printTimeMinutes,
            sellPerMinute,
            setupFee,
            quantity:    1,
            finishPrice: 0,
        });

        const weightGrams = priceBreakdown.weightGrams;

        // ดึง userId อย่างรัดกุม
        let userId = (session?.user as any)?.id;
        if (!userId && session?.user?.email) {
            const User = require("@/models/User").default;
            const userDb = await User.findOne({ email: session.user.email });
            if (userDb) userId = userDb._id;
        }

        const randomQuoteNumber = `QT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

        const quote = await Quote.create({
            userId: userId || null,
            quoteNumber: randomQuoteNumber,
            fileName,
            originalName: file.name,
            fileUrl: r2FileUrl || null,
            cloudinaryId: r2Key || null,
            isStoredInCloud: !!r2FileUrl,
            technology: selTech,
            material: selMat,
            color: selColor,
            quantity: 1,
            volumeCm3: analysis.volumeCm3,
            weightGrams,
            printTime: analysis.printTime,
            dimensions: analysis.dimensions,
            needsSupport: (analysis as any).needsSupport ?? false,
            supportVolumeCm3: (analysis as any).supportVolumeCm3 ?? 0,
            isManifold: (analysis as any).isManifold ?? true,
            priceDetail: {
                pricePerUnit:  priceBreakdown.pricePerUnit,
                totalPrice:    priceBreakdown.totalPrice,
                setupFee:      priceBreakdown.setupFee,
                materialCost:  priceBreakdown.materialCost,
                timeCost:      priceBreakdown.timeCost,
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
