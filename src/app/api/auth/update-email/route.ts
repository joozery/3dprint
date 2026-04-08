import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    await dbConnect();

    // เช็คว่าเมลล์ใหม่นี้มีคนใช้อยู่หรือยัง
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "อีเมลนี้มีผู้ใช้งานแล้วในระบบ" }, { status: 422 });
    }

    // อัปเดตอีเมลของผู้ใช้ปัจจุบัน (ค้นหาจาก ID ใน Session)
    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้ในระบบ" }, { status: 404 });
    }

    user.email = email;
    // ปลดล็อกจากการเป็นอีเมลจำลอง (ถ้าเดิมใช้อีเมล sso.com)
    await user.save();

    return NextResponse.json({ 
      message: "อัปเดตอีเมลเรียบร้อยแล้ว ระบบจะอัปเดตข้อมูล Session ของคุณใหม่",
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update Email Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการอัปเดตอีเมล" }, { status: 500 });
  }
}
