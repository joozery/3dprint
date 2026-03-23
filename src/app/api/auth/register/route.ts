import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    await dbConnect();

    // เช็คว่ามีผู้ใช้นี้อยู่แล้วหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "อีเมลนี้มีการใช้งานแล้วในระบบ" }, { status: 422 });
    }

    // เข้ารหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 12);

    // สร้างผู้ใช้ใหม่
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials"
    });

    return NextResponse.json({ 
      message: "สมัครสมาชิกสำเร็จ", 
      user: { id: user._id, name: user.name, email: user.email } 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก โปรดลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
