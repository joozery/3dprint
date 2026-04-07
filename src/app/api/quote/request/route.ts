import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

// POST /api/quote/request — บันทึก quote items เป็น "pending" ในฐานข้อมูล
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  await dbConnect();
  const body = await req.json();
  const { quotes } = body;

  if (!quotes || quotes.length === 0) {
    return NextResponse.json({ error: "ไม่มีรายการชิ้นงาน" }, { status: 400 });
  }

  try {
    // สร้าง Quote documents ทีละรายการ
    const created = await Promise.all(
      quotes.map((q: any) =>
        Quote.create({
          userId: (session?.user as any)?.id || null,
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
