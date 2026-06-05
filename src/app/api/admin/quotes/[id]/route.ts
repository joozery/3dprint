import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

// DELETE /api/admin/quotes/[id]
// ลบทุก quote ใน batch เดียวกัน (same quoteNumber)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    // หา quote ตัวแทนเพื่อดึง quoteNumber
    const quote = await Quote.findById(id).lean();
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const quoteNumber = quote.quoteNumber;
    let deletedCount = 0;

    if (quoteNumber) {
      // ลบทั้ง batch (ทุก quote ที่มี quoteNumber เดียวกัน)
      const result = await Quote.deleteMany({ quoteNumber });
      deletedCount = result.deletedCount;
    } else {
      // ถ้าไม่มี quoteNumber ลบแค่ตัวเดียว
      await Quote.findByIdAndDelete(id);
      deletedCount = 1;
    }

    return NextResponse.json({ success: true, deletedCount });
  } catch (error: any) {
    console.error("Delete quote error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
