import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createFedExShipment } from "@/lib/fedex";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { orderId, serviceType } = await req.json();
        if (!orderId || !serviceType) {
            return NextResponse.json({ error: "orderId and serviceType are required" }, { status: 400 });
        }

        await dbConnect();
        const order = await Order.findById(orderId).populate("quotes").lean() as any;
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const addr = order.shippingAddress;
        if (!addr?.zipCode) {
            return NextResponse.json({ error: "Order missing shipping address" }, { status: 400 });
        }

        const quotes        = order.quotes as any[];
        const weightKg      = Math.max(quotes.reduce((s: number, q: any) => s + (q.weightGrams || 0), 0) / 1000, 0.1);
        // dimensions stored in mm → convert to cm
        const maxWidth      = Math.max(...quotes.map((q: any) => (q.dimensions?.x || 10) / 10));
        const maxLength     = Math.max(...quotes.map((q: any) => (q.dimensions?.y || 10) / 10));
        const maxHeight     = quotes.reduce((s: number, q: any) => s + (q.dimensions?.z || 5) / 10, 0);
        const customsValue  = order.pricing?.subtotal || 0;

        const result = await createFedExShipment({
            serviceType,
            dst_name:         addr.fullName    || "Customer",
            dst_phone:        addr.phone       || "0000000000",
            dst_address:      addr.address     || "",
            dst_city:         addr.district    || addr.province || "",
            dst_province:     addr.province    || "",
            dst_zipcode:      addr.zipCode     || "",
            dst_country:      addr.countryCode || "TH",
            weightKg,
            width:            Math.ceil(maxWidth),
            length:           Math.ceil(maxLength),
            height:           Math.ceil(maxHeight),
            item_name:        `3D Print - ${order.orderNumber}`,
            remark:           order.customerNotes || "",
            customsValue,
            customsCurrency:  "THB",
            numPieces:        quotes.length,
        });

        console.log("[FedEx create_shipment response]", JSON.stringify(result, null, 2));

        if (result.errors?.length) {
            return NextResponse.json({ error: result.errors[0]?.message || "FedEx error", raw: result }, { status: 400 });
        }

        const shipment = result?.output?.transactionShipments?.[0];
        if (!shipment) {
            return NextResponse.json({ error: "No shipment data returned", raw: result }, { status: 400 });
        }

        const trackingNumber = shipment.masterTrackingNumber
            || shipment.completedShipmentDetail?.completedPackageDetails?.[0]?.trackingIds?.[0]?.trackingNumber
            || "";
        const labelUrl = shipment.completedShipmentDetail?.completedPackageDetails?.[0]?.label?.url || "";
        const fedexServiceType = shipment.serviceType || serviceType;

        await Order.findByIdAndUpdate(orderId, {
            $set: {
                trackingNumber,
                shippingProvider:   "fedex",
                fedexServiceType,
                fedexLabelUrl:      labelUrl,
                status: "shipped",
            },
        });

        return NextResponse.json({ success: true, trackingNumber, labelUrl, fedexServiceType });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
