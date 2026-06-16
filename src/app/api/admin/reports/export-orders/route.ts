import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
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
    // Fetch all orders and populate quotes to extract items
    const orders = await Order.find(matchQuery).populate("quotes").sort({ createdAt: -1 }).lean();

    // วัสดุที่เก็บใน quote เป็น MaterialConfig._id (string) — ต้อง resolve เป็นชื่อที่อ่านได้
    const materialIds = [...new Set(
      orders.flatMap((o: any) => (o.quotes || []).map((q: any) => q.material)).filter(Boolean)
    )].filter((mid: any) => /^[0-9a-fA-F]{24}$/.test(mid));
    const materialDocs = materialIds.length ? await MaterialConfig.find({ _id: { $in: materialIds } }).lean() : [];
    const materialNameMap: Record<string, string> = {};
    materialDocs.forEach((m: any) => { materialNameMap[m._id.toString()] = m.name; });

    // Prepare CSV header
    let csv = "\uFEFF" + // BOM for excel utf-8
      "Order ID,Order Status,Payment Status,Customer Notes," +
      "Quote File,Technology,Material,Color,Post Processing," +
      "Quantity,Weight(g),Print Time(min)," +
      "Unit Cost(฿),Total Unit Price(฿),Total Order Amount(฿),Created At\n";

    // Loop and map
    for (const order of orders) {
      const orderDate = new Date(order.createdAt).toLocaleDateString('th-TH');
      
      if (!order.quotes || order.quotes.length === 0) {
        // Empty order row just in case
        csv += `"${order.orderNumber}","${order.status}","${order.paymentDetails?.status || ''}","${(order.customerNotes || '').replace(/"/g, '""')}","", "", "", "", "", "0", "0", "0", "0", "0", "${order.pricing?.totalAmount || 0}", "${orderDate}"\n`;
        continue;
      }

      for (const quote of order.quotes as any[]) {
        const postProcess = quote.postProcessing ? quote.postProcessing.map((p: any) => p.name).join(", ") : "None";
        const unitCost = quote.priceDetail?.costPerUnit || 0; // Assuming minimal tracking, fallback to 0 if not tightly tracked at order time, but user requested costs. 
        // We will just fetch standard data points available.
        const unitPrice = quote.priceDetail?.pricePerUnit || 0;

        csv += `"${order.orderNumber}","${order.status}","${order.paymentDetails?.status || ''}","${(order.customerNotes || '').replace(/"/g, '""')}",` +
               `"${(quote.originalName || '').replace(/"/g, '""')}","${quote.technology || ''}","${materialNameMap[quote.material] || quote.material || ''}","${quote.color || ''}","${postProcess}",` +
               `"${quote.quantity || 0}","${quote.weightGrams || 0}","${quote.printTime || '0'}","${unitCost}","${unitPrice}","${order.pricing?.totalAmount || 0}","${orderDate}"\n`;
      }
    }

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="orders_report.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
