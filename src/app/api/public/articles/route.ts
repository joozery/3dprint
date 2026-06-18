import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Article from "@/models/Article";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const query: Record<string, any> = { isActive: true };
    if (type) query.type = type;

    const articles = await Article.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
