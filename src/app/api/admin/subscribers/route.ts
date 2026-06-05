import { NextResponse } from "next/server";
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

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, subscribers, total: subscribers.length });
  } catch (error: unknown) {
    console.error("[admin/subscribers GET] error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
