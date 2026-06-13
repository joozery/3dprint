import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import FooterLink from "@/models/FooterLink";
import AdminLog from "@/models/AdminLog";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any).id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

export async function GET() {
  try {
    await dbConnect();
    const links = await FooterLink.find().sort({ category: 1, order: 1 }).lean();
    return NextResponse.json({ success: true, links });
  } catch {
    return NextResponse.json({ error: "Failed to fetch footer links" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const link = await FooterLink.create(body);

    await AdminLog.create({
      adminId: (admin as any)._id,
      action: "CREATE_FOOTER_LINK",
      details: `Admin created footer link: ${link.label} → ${link.url}`,
      targetId: link._id.toString(),
    });

    return NextResponse.json({ success: true, link });
  } catch {
    return NextResponse.json({ error: "Failed to create footer link" }, { status: 500 });
  }
}
