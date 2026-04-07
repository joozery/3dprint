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
  const user = await User.findById((session.user as any).id).select("billing").lean();
  return NextResponse.json({ billing: (user as any)?.billing || null });
}

// PUT — บันทึก billing info
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { billing } = await req.json();

  await User.findByIdAndUpdate((session.user as any).id, { $set: { billing } });
  return NextResponse.json({ success: true });
}
