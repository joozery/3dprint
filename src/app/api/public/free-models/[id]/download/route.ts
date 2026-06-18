import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import FreeModel from "@/models/FreeModel";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    await FreeModel.findByIdAndUpdate(id, { $inc: { downloads: 1 } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to increment downloads" }, { status: 500 });
  }
}
