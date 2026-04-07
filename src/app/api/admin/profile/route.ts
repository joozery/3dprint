import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update Basic Info
    if (name) user.name = name;
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: user._id } });
      if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      user.email = email;
    }

    // Update Password if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required to change password" }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password || "");
      if (!isMatch) {
         return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
