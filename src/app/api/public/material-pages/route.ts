import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import MaterialPageContent from "@/models/MaterialPageContent";

export async function GET() {
    await dbConnect();
    const items = await MaterialPageContent.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(items)) });
}
