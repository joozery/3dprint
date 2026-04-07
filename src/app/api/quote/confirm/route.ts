import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

// POST /api/quote/confirm — อัปเดต quotes ด้วยข้อมูล billing และเปลี่ยน status เป็น pending (ยืนยัน)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const { ids, billing } = body;

  if (!ids || ids.length === 0) {
    return NextResponse.json({ error: "ไม่มีรายการ" }, { status: 400 });
  }

  try {
    // อัปเดตทุก quote ด้วย billing info
    await Quote.updateMany(
      { _id: { $in: ids }, userId: (session.user as any).id },
      {
        $set: {
          billing,
          status: "pending",
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Quote confirm error:", err);
    return NextResponse.json({ error: "ไม่สามารถยืนยันใบเสนอราคาได้" }, { status: 500 });
  }
}
