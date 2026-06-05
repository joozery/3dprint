import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

// POST /api/quote/request — อัปเดต quote items ที่มีอยู่แล้วให้มี sharedQuoteNumber เดียวกัน
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  await dbConnect();
  const body = await req.json();

  // Support two modes:
  // 1. Legacy: { quotes: [...fullQuoteObjects] } — creates new Quote docs
  // 2. New: { ids: [...mongoIds] } — updates existing Quote docs with shared quoteNumber
  const { quotes, ids } = body;

  // --- New mode: update existing quotes ---
  if (ids && Array.isArray(ids) && ids.length > 0) {
    try {
      const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const randomStr = Math.floor(1000 + Math.random() * 9000);
      const sharedQuoteNumber = `QT-${dateStr}-${randomStr}`;

      await Quote.updateMany(
        { _id: { $in: ids } },
        { $set: { quoteNumber: sharedQuoteNumber, status: "pending" } }
      );

      return NextResponse.json({
        success: true,
        count: ids.length,
        ids,
        quoteNumber: sharedQuoteNumber,
      });
    } catch (err: any) {
      console.error("Quote request (update) error:", err);
      return NextResponse.json({ error: "ไม่สามารถอัปเดตใบเสนอราคาได้" }, { status: 500 });
    }
  }

  // --- Legacy mode: body has full quote objects ---
  if (!quotes || quotes.length === 0) {
    return NextResponse.json({ error: "ไม่มีรายการชิ้นงาน" }, { status: 400 });
  }

  try {
    // Generate one Quote Number for this batch
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomStr = Math.floor(1000 + Math.random() * 9000);
    const sharedQuoteNumber = `QT-${dateStr}-${randomStr}`;

    // สร้าง Quote documents ทีละรายการ
    const created = await Promise.all(
      quotes.map((q: any) =>
        Quote.create({
          userId: (session?.user as any)?.id || null,
          quoteNumber: sharedQuoteNumber,
          fileName: q.fileName || "unknown",
          originalName: q.originalName || q.fileName || "unknown",
          fileUrl: q.fileUrl || "",
          cloudinaryId: q.cloudinaryId || "",
          technology: q.technology || "sla",
          material: q.material || "9600",
          color: q.color || "Matte White",
          quantity: q.quantity || 1,
          volumeCm3: q.volumeCm3 || 0,
          weightGrams: q.weightGrams || 0,
          printTime: q.printTime || "N/A",
          dimensions: q.dimensions || { x: 0, y: 0, z: 0 },
          priceDetail: q.priceDetail || { pricePerUnit: 0, totalPrice: 0, setupFee: 0 },
          status: "pending",
        })
      )
    );

    return NextResponse.json({
      success: true,
      count: created.length,
      ids: created.map((c) => c._id.toString()),
    });
  } catch (err: any) {
    console.error("Quote request error:", err);
    return NextResponse.json({ error: "ไม่สามารถบันทึกใบเสนอราคาได้" }, { status: 500 });
  }
}
