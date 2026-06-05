import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Subscriber from "@/models/Subscriber";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  await dbConnect();
  const user = await User.findById(userId).lean();
  return (user as { role?: string } | null)?.role === "admin" ? user : null;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const subscriber = await Subscriber.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[admin/subscribers DELETE] error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
