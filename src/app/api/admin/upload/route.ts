import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Use R2
        const ext = path.extname(file.name) || ".jpg";
        const filename = `content/${uuidv4()}${ext}`; // Save in "content" folder

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: filename,
                Body: buffer,
                ContentType: file.type,
            })
        );

        const fileUrl = `${R2_PUBLIC_URL}/${filename}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
