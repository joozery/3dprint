import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Faq from "@/models/Faq";

export async function GET() {
  try {
    await dbConnect();
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, faqs });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
