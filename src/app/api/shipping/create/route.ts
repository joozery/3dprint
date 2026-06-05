import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createIShipOrder } from "@/lib/iship";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Quote from "@/models/Quote";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { orderId, courier_code } = body;

        if (!orderId || !courier_code) {
            return NextResponse.json({ error: "orderId and courier_code are required" }, { status: 400 });
        }

        await dbConnect();

        const order = await Order.findById(orderId).populate("quotes").lean() as any;
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const addr = order.shippingAddress;
        if (!addr?.zipCode) {
            return NextResponse.json({ error: "Order missing shipping address" }, { status: 400 });
        }

        // คำนวณ package dimensions จากทุก quote
        const quotes = order.quotes as any[];
        const totalWeightGrams = quotes.reduce((sum: number, q: any) => sum + (q.weightGrams || 0), 0);
        const maxWidth  = Math.max(...quotes.map((q: any) => q.dimensions?.x || 10));
        const maxLength = Math.max(...quotes.map((q: any) => q.dimensions?.y || 10));
        const maxHeight = quotes.reduce((sum: number, q: any) => sum + (q.dimensions?.z || 5), 0);
        const weightKg  = Math.max(totalWeightGrams / 1000, 0.1);

        const result = await createIShipOrder({
            courier_code,
            receiver_name:     addr.fullName || "Customer",
            receiver_phone:    addr.phone    || "0000000000",
            receiver_address:  addr.address  || "",
            receiver_district: addr.subDistrict || addr.district || "",
            receiver_amphure:  addr.district || "",
            receiver_province: addr.province || "",
            receiver_zipcode:  addr.zipCode  || "",
            weightKg,
            width:  Math.ceil(maxWidth),
            length: Math.ceil(maxLength),
            height: Math.ceil(maxHeight),
            item_name: `3D Print - ${order.orderNumber}`,
            cod_amount: 0,
            remark: order.customerNotes || "",
        });

        if (!result.status && result.code !== undefined) {
            return NextResponse.json({ error: result.message || "iShip error", raw: result }, { status: 400 });
        }

        // บันทึก tracking number และ iShip order id
        const trackingNumber = result.tracking_no || result.tracking_number || result.order_id || "";
        const ishipOrderId   = result.order_id || result.id || "";

        await Order.findByIdAndUpdate(orderId, {
            $set: {
                trackingNumber,
                ishipOrderId,
                ishipCourierCode: courier_code,
                status: "shipped",
            },
        });

        return NextResponse.json({ success: true, trackingNumber, ishipOrderId, raw: result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
