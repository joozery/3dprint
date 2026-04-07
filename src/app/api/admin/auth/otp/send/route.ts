import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "โปรดระบุอีเมลและรหัสผ่าน" }, { status: 400 });
    }

    await dbConnect();

    // 1. ค้นหา User และเช็ค Role
    const user = await User.findOne({ email }).select("+password");
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ" }, { status: 403 });
    }

    // 2. เช็ครหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 3. สร้าง OTP (6 หลัก)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // หมดอายุใน 5 นาที

    // 4. บันทึก OTP ลง DB
    user.adminOTP = otp;
    user.adminOTPExpires = expires;
    await user.save();

    // 5. ส่งอีเมล (Mock ให้สำเร็จ)
    try {
      await sendOTPEmail(user.email, otp);
      return NextResponse.json({ success: true, message: "OTP ถูกส่งไปยังอีเมลของคุณเรียบร้อยแล้ว" });
    } catch (mailErr: any) {
      console.error("Mail Send Error:", mailErr);
      return NextResponse.json({ 
        error: "ไม่สามารถส่งอีเมล OTP ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง", 
        debug: mailErr.message 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("OTP API Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
