import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Subscriber from "@/models/Subscriber";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").toString().trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "รูปแบบอีเมลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: false, error: "อีเมลนี้สมัครรับข่าวสารแล้ว" },
          { status: 409 }
        );
      }
      // Re-activate soft-deleted subscriber
      existing.isActive = true;
      await existing.save();
      return NextResponse.json({ success: true, message: "สมัครรับข่าวสารสำเร็จ" });
    }

    await Subscriber.create({ email, source: "footer" });
    return NextResponse.json({ success: true, message: "สมัครรับข่าวสารสำเร็จ" });
  } catch (error: unknown) {
    console.error("[newsletter/subscribe] error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
