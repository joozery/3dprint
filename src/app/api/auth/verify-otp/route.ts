import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: "กรุณาระบุอีเมลและรหัส OTP" }, { status: 400 });
    }

    await dbConnect();

    // เช็คโค้ด
    const verifyRecord = await VerificationCode.findOne({ email, code });

    if (!verifyRecord) {
      return NextResponse.json({ message: "รหัส OTP ไม่ถูกต้อง" }, { status: 400 });
    }

    // เช็คอายุ
    if (new Date() > verifyRecord.expires) {
      return NextResponse.json({ message: "รหัส OTP หมดอายุแล้ว โปรดขอใหม่" }, { status: 400 });
    }

    // ถ้าโค้ดถูกต้อง ให้ทำการอัปเดตผู้ใช้
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้นี้ในระบบ" }, { status: 404 });
    }

    user.isVerified = true;
    user.verificationStatus = "verified";
    await user.save();

    // ลบรหัสที่ใช้แล้ว
    await VerificationCode.deleteOne({ _id: verifyRecord._id });

    // ส่งอีเมลยินดีต้อนรับ
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.error("Welcome Email Error:", e);
    }

    return NextResponse.json({ message: "ยืนยันรหัสสำเร็จแล้ว คุณสามารถเข้าสู่ระบบได้ทันที", user }, { status: 200 });

  } catch (error: any) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการยืนยันรหัส โปรดลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
