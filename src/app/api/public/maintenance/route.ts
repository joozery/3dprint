import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne().lean();
    return NextResponse.json({ maintenance: (settings as any)?.maintenanceMode ?? false });
  } catch {
    return NextResponse.json({ maintenance: false });
  }
}
