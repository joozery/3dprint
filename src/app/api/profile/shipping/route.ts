import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findById((session.user as any).id).select("shippingAddress").lean();
  return NextResponse.json({ shippingAddress: (user as any)?.shippingAddress || null });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { shippingAddress } = await req.json();

  await User.findByIdAndUpdate((session.user as any).id, { $set: { shippingAddress } });
  return NextResponse.json({ success: true });
}
