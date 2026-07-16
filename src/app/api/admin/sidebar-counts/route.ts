import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import Order from "@/models/Order";

// ตัวเลขงานที่รอแอดมินจัดการ สำหรับ badge บน sidebar
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const [pendingQuotes, pendingOrders] = await Promise.all([
        Quote.countDocuments({ status: "pending" }),        // ใบเสนอราคาที่ลูกค้าส่งคำขอ รอตอบ
        Order.countDocuments({ status: "pending_payment" }), // ออเดอร์รอยืนยันสลิป
    ]);
    return NextResponse.json({ pendingQuotes, pendingOrders });
}
