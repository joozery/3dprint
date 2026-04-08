import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";
import AdminLog from "@/models/AdminLog";
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
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const banner = await Banner.create(body);

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "CREATE_BANNER",
      details: `Admin created new banner: ${banner.title}`,
      targetId: banner._id.toString()
    });

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
