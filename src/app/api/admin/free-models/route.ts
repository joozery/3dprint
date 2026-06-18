import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import FreeModel from "@/models/FreeModel";
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
    const models = await FreeModel.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, models });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const model = await FreeModel.create(body);
    return NextResponse.json({ success: true, model });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create model" }, { status: 500 });
  }
}
