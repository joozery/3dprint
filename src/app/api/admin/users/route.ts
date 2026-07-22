import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateUniqueSlug } from "@/lib/slugify";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please provide all fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const slug = await generateUniqueSlug(name, User);

    // Create new admin
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      verificationStatus: "verified",
      provider: "credentials",
      slug,
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
