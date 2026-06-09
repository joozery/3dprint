import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import ServicePage from "@/models/ServicePage";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const page = await ServicePage.findById(id);
    if (!page) return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Fetch ServicePage error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { id } = await params;
    const page = await ServicePage.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!page) return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Update ServicePage error:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
