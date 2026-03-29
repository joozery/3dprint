import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { sendPasswordResetOTP } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "กรุณาระบุอีเมล" }, { status: 400 });
    }

    await dbConnect();

    // เช็คว่ามีผู้ใช้นี้อยู่หรือไม่
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      // แม้ว่าจะไม่เจออีเมล ก็ส่ง response กลับไปแบบเดิมเพื่อป้องกัน User Enumeration Attack (Security Best Practice)
      return NextResponse.json({ 
        message: "หากพบอีเมลนี้ในระบบ เราได้จัดส่งรหัส OTP ให้แล้ว",
        email 
      }, { status: 200 });
    }

    if (existingUser.provider !== "credentials") {
        return NextResponse.json({ message: `บัญชีนี้เชื่อมต่อผ่าน ${existingUser.provider} ไม่สามารถแก้ไขรหัสผ่านได้` }, { status: 400 });
    }

    // สร้างรหัส OTP 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // เก็บลงฐานข้อมูล (ลบของเก่าทิ้งถ้ามี)
    await VerificationCode.deleteMany({ email });
    await VerificationCode.create({ email, code: otp, expires });

    // ส่งอีเมล
    try {
      await sendPasswordResetOTP(email, otp);
    } catch (emailError) {
      console.error("Email Error:", emailError);
      return NextResponse.json({ message: "ไม่สามารถส่งอีเมลรหัส OTP ได้ โปรดติดต่อแอดมินหรือลองใหม่อีกครั้ง" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "ระบบได้จัดส่งรหัส OTP สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว",
      email 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Forgot Password OTP Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการส่งรหัส OTP โปรดลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
