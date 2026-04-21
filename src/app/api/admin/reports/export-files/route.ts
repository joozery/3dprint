import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Use quotes as source of truth for files
    const files = await Quote.find({ fileUrl: { $exists: true, $ne: "" } }).populate("userId").sort({ createdAt: -1 }).lean();

    // Prepare CSV header
    let csv = "\uFEFF" + // BOM for excel utf-8
      "File ID (Quote Ref),Original Name,Tech,Dimensions(X Y Z),Volume(cm3),Associated Customer,Email,Created At\n";

    for (const f of files as any[]) {
        const orderDate = new Date(f.createdAt).toLocaleDateString('th-TH');
        const customerName = f.userId?.name || f.billing?.firstName || "Guest";
        const email = f.userId?.email || f.billing?.email || "";

        csv += `"${f._id}","${(f.originalName || '').replace(/"/g, '""')}","${f.technology || ''}",` +
               `"${f.dimensions?.x || 0} x ${f.dimensions?.y || 0} x ${f.dimensions?.z || 0}","${f.volumeCm3 || 0}",` +
               `"${customerName}","${email}","${orderDate}"\n`;
    }

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="files_report.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
