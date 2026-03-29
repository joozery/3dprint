import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน กรุณากรอกรหัส OTP และรหัสผ่านใหม่" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" }, { status: 400 });
    }

    await dbConnect();

    // เช็ครหัส OTP
    const verifyRecord = await VerificationCode.findOne({ email, code });

    if (!verifyRecord) {
      return NextResponse.json({ message: "รหัส OTP ไม่ถูกต้อง" }, { status: 400 });
    }

    // เช็คอายุ OTP
    if (new Date() > verifyRecord.expires) {
      return NextResponse.json({ message: "รหัส OTP หมดอายุแล้ว โปรดขอรหัสใหม่" }, { status: 400 });
    }

    // อัปเดตรหัสผ่าน
    const user = await User.findOne({ email });

    if (!user) {
      // ไม่ควรเกิดกรณีนี้ แต่กันไว้ก่อน
      return NextResponse.json({ message: "ไม่พบผู้ใช้นี้ในระบบ" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // ลบรหัสที่ใช้แล้ว
    await VerificationCode.deleteOne({ _id: verifyRecord._id });

    return NextResponse.json({ message: "รีเซ็ตรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที" }, { status: 200 });

  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน โปรดลองอีกครั้ง" }, { status: 500 });
  }
}
