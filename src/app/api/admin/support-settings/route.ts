import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import SupportSettings from "@/models/SupportSettings";
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
    const settings = await SupportSettings.findOne().lean();
    return NextResponse.json({
      success: true,
      settings: settings ?? {
        phone: "",
        email: "",
        lineId: "",
        lineUrl: "",
        address: "",
        businessHours: "จันทร์ - เสาร์ 9:00 - 18:00 น.",
        chatEnabled: true,
        facebookUrl: "",
        instagramUrl: "",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch support settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const settings = await SupportSettings.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update support settings" }, { status: 500 });
  }
}
