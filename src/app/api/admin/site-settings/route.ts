import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";
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
    const settings = await SiteSettings.findOne().lean();
    return NextResponse.json({
      success: true,
      settings: settings ?? { maintenanceMode: false },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: { maintenanceMode: !!body.maintenanceMode } },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}
