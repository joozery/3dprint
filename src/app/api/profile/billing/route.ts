import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

// GET — ดึง billing info ของ user คนนั้น
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findById((session.user as any).id).select("-password").lean();
  return NextResponse.json({ user, billing: (user as any)?.billing || null });
}

// PUT — บันทึก billing info
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { billing, shippingAddresses } = await req.json();

  const update: any = {};
  if (billing) update.billing = billing;
  if (shippingAddresses) update.shippingAddresses = shippingAddresses;

  await User.findByIdAndUpdate((session.user as any).id, { $set: update });
  return NextResponse.json({ success: true });
}
