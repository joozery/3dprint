import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import MaterialConfig from "@/models/MaterialConfig";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const year = parseInt(searchParams.get("year") || "0");
    const month = parseInt(searchParams.get("month") || "0");

    let matchQuery: any = {};
    if (type === "yearly" && year) {
        matchQuery.createdAt = { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) };
    } else if (type === "monthly" && year && month) {
        matchQuery.createdAt = { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0, 23, 59, 59) };
    }

    await dbConnect();
    const quotes = await Quote.find(matchQuery).populate("userId").sort({ createdAt: -1 }).lean();

    // วัสดุที่เก็บใน quote เป็น MaterialConfig._id (string) — ต้อง resolve เป็นชื่อที่อ่านได้
    const materialIds = [...new Set(quotes.map((q: any) => q.material).filter(Boolean))]
      .filter((mid: any) => /^[0-9a-fA-F]{24}$/.test(mid));
    const materialDocs = materialIds.length ? await MaterialConfig.find({ _id: { $in: materialIds } }).lean() : [];
    const materialNameMap: Record<string, string> = {};
    materialDocs.forEach((m: any) => { materialNameMap[m._id.toString()] = m.name; });

    // Prepare CSV header
    let csv = "\uFEFF" + // BOM for excel utf-8
      "Quote ID,Customer Name,Customer Email,Status,Internal Status,File Name," +
      "Technology,Material,Color,Quantity,Weight(g),Options," +
      "Unit Cost(฿),Unit Price(฿),Total Setup Fee(฿),Total Amount(฿)," +
      "Internal Comments,Created At\n";

    // Loop and map
    for (const quote of quotes as any[]) {
        const orderDate = new Date(quote.createdAt).toLocaleDateString('th-TH');
        
        const customerName = quote.userId?.name || quote.billing?.firstName || "Guest";
        const customerEmail = quote.userId?.email || quote.billing?.email || "";
        const postProcess = quote.postProcessing ? quote.postProcessing.map((p: any) => p.name).join(", ") : "None";
        const unitCost = quote.priceDetail?.costPerUnit || 0;
        const unitPrice = quote.priceDetail?.pricePerUnit || 0;

        csv += `"${quote.quoteNumber || quote._id}","${customerName}","${customerEmail}",` +
               `"${quote.status}","${quote.internalStatus || ''}","${(quote.originalName || '').replace(/"/g, '""')}",` +
               `"${quote.technology || ''}","${materialNameMap[quote.material] || quote.material || ''}","${quote.color || ''}",` +
               `"${quote.quantity || 0}","${quote.weightGrams || 0}","${postProcess}",` +
               `"${unitCost}","${unitPrice}","${quote.priceDetail?.setupFee || 0}","${quote.priceDetail?.totalPrice || 0}",` +
               `"${(quote.internalComments || '').replace(/"/g, '""')}","${orderDate}"\n`;
    }

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="quotes_report.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
