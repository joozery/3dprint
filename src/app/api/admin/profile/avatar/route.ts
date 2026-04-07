import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `avatars/${uuidv4()}${path.extname(file.name)}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const imageUrl = `${R2_PUBLIC_URL}/${fileName}`;

    // Update User in DB
    await dbConnect();
    await User.findByIdAndUpdate(session.user.id, { image: imageUrl });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error("Avatar Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
