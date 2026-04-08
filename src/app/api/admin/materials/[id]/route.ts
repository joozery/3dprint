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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();

    const material = await Material.findByIdAndUpdate(id, body, { new: true });
    if (!material) return NextResponse.json({ error: "Material not found" }, { status: 404 });

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "UPDATE_MATERIAL",
      details: `Admin updated material: ${material.name} (${material.systemId})`,
      targetId: material._id.toString()
    });

    return NextResponse.json({ success: true, material });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    
    const material = await Material.findByIdAndDelete(id);
    if (!material) return NextResponse.json({ error: "Material not found" }, { status: 404 });

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "DELETE_MATERIAL",
      details: `Admin deleted material: ${material.name} (${material.systemId})`,
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
