import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SupportSettings from "@/models/SupportSettings";

export async function GET() {
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
