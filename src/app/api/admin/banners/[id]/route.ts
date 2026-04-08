import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";
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

    const banner = await Banner.findByIdAndUpdate(id, body, { new: true });
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "UPDATE_BANNER",
      details: `Admin updated banner: ${banner.title}`,
      targetId: banner._id.toString()
    });

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
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
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "DELETE_BANNER",
      details: `Admin deleted banner: ${banner.title}`,
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
