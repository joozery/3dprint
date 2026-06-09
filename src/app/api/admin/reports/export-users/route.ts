import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean();

    // Prepare CSV header
    let csv = "\uFEFF" + // BOM for excel utf-8
      "User ID,Name,Email,Provider,Platform Role," +
      "Created At\n";

    // Loop and map
    for (const user of users) {
        const orderDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH') : '-';
        csv += `"${user._id}","${(user.name || '').replace(/"/g, '""')}","${user.email || ''}","${user.provider || 'credentials'}","${user.role || 'user'}", "${orderDate}"\n`;
    }

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="users_report.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
