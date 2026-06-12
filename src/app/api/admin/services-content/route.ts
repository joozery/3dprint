import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import ServicePage from "@/models/ServicePage";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById((session.user as any).id);
    if (!user || user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const pages = await ServicePage.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error("Fetch ServicePages error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
