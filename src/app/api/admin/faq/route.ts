import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Faq from "@/models/Faq";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any).id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const faqs = await Faq.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, faqs });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const faq = await Faq.create(body);
    return NextResponse.json({ success: true, faq });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
