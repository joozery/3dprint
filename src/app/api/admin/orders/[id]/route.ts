import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  await dbConnect();
  const user = await User.findById(session.user.id).lean();
  return user?.role === "admin" ? user : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowedFields = ["status", "trackingNumber"];
  const update: Record<string, any> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) update[field] = body[field];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}
