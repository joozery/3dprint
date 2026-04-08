import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import AdminLog from "@/models/AdminLog";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // Ensure the user is an admin
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    await Quote.deleteMany({ _id: { $in: ids } });

    await AdminLog.create({
      adminId: (session.user as any).id || (session.user as any)._id,
      action: "DELETE_MODEL",
      details: `Admin deleted ${ids.length} 3D models from asset storage`,
    });

    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (error: any) {
    console.error("Error deleting models:", error);
    return NextResponse.json({ error: "Failed to delete models" }, { status: 500 });
  }
}
