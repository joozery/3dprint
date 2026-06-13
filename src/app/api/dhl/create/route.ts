import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createDHLShipment } from "@/lib/dhl";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { orderId, productCode, dst_country, dst_city, dst_zipcode } = await req.json();
        if (!orderId || !productCode || !dst_country) {
            return NextResponse.json({ error: "orderId, productCode, and dst_country are required" }, { status: 400 });
        }

        await dbConnect();
        const order = await Order.findById(orderId).populate("quotes").lean() as any;
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const addr = order.shippingAddress;
        if (!addr?.zipCode && !dst_zipcode) {
            return NextResponse.json({ error: "Order missing shipping address" }, { status: 400 });
        }

        const quotes   = order.quotes as any[];
        const weightKg = Math.max(quotes.reduce((s: number, q: any) => s + (q.weightGrams || 0), 0) / 1000, 0.1);
        // dimensions stored in mm → convert to cm
        const maxWidth  = Math.max(...quotes.map((q: any) => (q.dimensions?.x || 10) / 10));
        const maxLength = Math.max(...quotes.map((q: any) => (q.dimensions?.y || 10) / 10));
        const maxHeight = quotes.reduce((s: number, q: any) => s + (q.dimensions?.z || 5) / 10, 0);

        const result = await createDHLShipment({
            productCode,
            dst_name:    addr.fullName  || "Customer",
            dst_phone:   addr.phone     || "0000000000",
            dst_address: addr.address   || "",
            dst_city:    dst_city       || addr.province || "",
            dst_country,
            dst_zipcode: addr.zipCode   || "",
            weightKg,
            width:  Math.ceil(maxWidth),
            length: Math.ceil(maxLength),
            height: Math.ceil(maxHeight),
            item_name: `3D Print - ${order.orderNumber}`,
            remark: order.customerNotes || "",
        });

        console.log("[DHL create_shipment response]", JSON.stringify(result, null, 2));

        if (result.status === 400 || result.title || result.detail) {
            return NextResponse.json({ error: result.detail || result.title || "DHL error", raw: result }, { status: 400 });
        }

        const trackingNumber = result.shipmentTrackingNumber
            || result.packages?.[0]?.trackingNumber
            || "";

        const labelDoc = result.documents?.find((d: any) => d.typeCode === "label");
        const labelBase64 = labelDoc?.content || "";

        if (!trackingNumber) {
            return NextResponse.json({ error: "No tracking number returned", raw: result }, { status: 400 });
        }

        await Order.findByIdAndUpdate(orderId, {
            $set: {
                trackingNumber,
                shippingProvider:  "dhl",
                dhlProductCode:    productCode,
                dhlLabelBase64:    labelBase64,
                status: "shipped",
            },
        });

        return NextResponse.json({ success: true, trackingNumber, labelBase64, productCode });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
