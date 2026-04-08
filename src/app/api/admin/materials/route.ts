import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Material from "@/models/Material";
import AdminLog from "@/models/AdminLog";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any).id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

export async function GET() {
  try {
    await dbConnect();
    const materials = await Material.find().sort({ technology: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, materials });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    
    // Check if systemId exists
    const existing = await Material.findOne({ systemId: body.systemId });
    if (existing) {
      return NextResponse.json({ error: "รหัสวัสดุ (System ID) นี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    const material = await Material.create(body);

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "CREATE_MATERIAL",
      details: `Admin created new material: ${material.name} (${material.systemId})`,
      targetId: material._id.toString()
    });

    return NextResponse.json({ success: true, material });
  } catch (error: any) {
    console.error("Create material error:", error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
