import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const caller = await User.findById(session.user.id).lean();
  if ((caller as any)?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) return NextResponse.json({ users: [] });

  const users = await User.find({
    role: "user",
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  })
    .select("name email image")
    .limit(8)
    .lean();

  return NextResponse.json({ users: JSON.parse(JSON.stringify(users)) });
}
