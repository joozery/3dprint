import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
