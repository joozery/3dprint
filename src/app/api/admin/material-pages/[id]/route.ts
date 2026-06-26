import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import MaterialPageContent from "@/models/MaterialPageContent";

async function adminGuard() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") return false;
    return true;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await adminGuard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();

    const { id } = await params;
    const body = await req.json();
    const item = await MaterialPageContent.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(item)) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await adminGuard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();

    const { id } = await params;
    await MaterialPageContent.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
