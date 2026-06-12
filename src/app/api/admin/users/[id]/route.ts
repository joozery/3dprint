import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import AdminLog from "@/models/AdminLog";
import { sendAdminPromotionEmail } from "@/lib/email";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any)?.id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (body.action === "verify") {
    const user = await User.findByIdAndUpdate(id, { isVerified: true, emailVerified: new Date() }, { new: true });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    
    // Log the verification
    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "VERIFY_USER",
      details: `Admin confirmed manual verification for user: ${user.email}`,
      targetId: user._id.toString()
    });

    return NextResponse.json({ success: true, user: { id: user._id, isVerified: user.isVerified } });
  }

  if (id === (admin as any)._id.toString()) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const allowedRoles = ["admin", "user"];
  if (!allowedRoles.includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(id, { role: body.role }, { new: true });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await AdminLog.create({
    adminId: (admin as any)._id,
    action: "UPDATE_USER_ROLE",
    details: `Admin changed role of user: ${user.email} to ${body.role}`,
    targetId: user._id.toString()
  });

  // ส่งอีเมลแจ้งเตือนเมื่อ promote เป็น admin
  if (body.role === "admin" && user.email) {
    try {
      await sendAdminPromotionEmail(user.email, user.name || "ท่านผู้ใช้");
    } catch (e) {
      console.error("Failed to send promotion email:", e);
    }
  }

  return NextResponse.json({ success: true, user: { id: user._id, role: user.role } });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (id === (admin as any)._id.toString()) {
    return NextResponse.json({ error: "ไม่สามารถลบบัญชีของตัวเองได้" }, { status: 400 });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await AdminLog.create({
    adminId: (admin as any)._id,
    action: "DELETE_USER",
    details: `Admin deleted user: ${user.email} (role: ${user.role})`,
    targetId: id,
  });

  return NextResponse.json({ success: true });
}
