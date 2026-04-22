import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import AdminLog from "@/models/AdminLog";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any)?.id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Get original extension
    const ext = file.name ? `.${file.name.split('.').pop()}` : '.jpg';
    const fileName = `${uuidv4()}${ext}`;
    const r2Key = `slips/${fileName}`;

    // Upload to Cloudflare R2
    await r2Client.send(
        new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: r2Key,
            Body: buffer,
            ContentType: file.type || "image/jpeg",
        })
    );

    const slipUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${r2Key}` : `https://pub-xxxxxx.r2.dev/${r2Key}`;

    // Update order
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.paymentDetails.slipUrl = slipUrl;
    order.paymentDetails.status = "paid"; // Automatically mark as paid when admin uploads slip
    await order.save();

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "UPLOAD_SLIP",
      details: "Admin uploaded payment slip manually and marked as paid",
      targetId: order._id.toString()
    });

    return NextResponse.json({ success: true, slipUrl });

  } catch (error: any) {
    console.error("Slip upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
