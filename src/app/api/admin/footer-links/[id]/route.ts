import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import FooterLink from "@/models/FooterLink";
import AdminLog from "@/models/AdminLog";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any).id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const link = await FooterLink.findByIdAndUpdate(id, body, { new: true });
    if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "UPDATE_FOOTER_LINK",
      details: `Admin updated footer link: ${link.label}`,
      targetId: link._id.toString(),
    });

    return NextResponse.json({ success: true, link });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const link = await FooterLink.findByIdAndDelete(id);
    if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "DELETE_FOOTER_LINK",
      details: `Admin deleted footer link: ${link.label}`,
      targetId: id,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
