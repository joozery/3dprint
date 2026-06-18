import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import FreeModel from "@/models/FreeModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: Record<string, any> = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const models = await FreeModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, models });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
