import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Article from "@/models/Article";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any).id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const query: Record<string, any> = {};
    if (type) query.type = type;

    const articles = await Article.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const article = await Article.create(body);
    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
