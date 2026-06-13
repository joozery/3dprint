import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cancelIShipOrder } from "@/lib/iship";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { orderId } = await req.json();
        if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

        await dbConnect();
        const order = await Order.findById(orderId).lean() as any;
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        // try to cancel the existing iShip order (best-effort, don't fail if it errors)
        if (order.ishipOrderId) {
            try {
                await cancelIShipOrder(String(order.ishipOrderId));
            } catch {
                // ignore — order may already be cancelled or not exist
            }
        }

        await Order.findByIdAndUpdate(orderId, {
            $unset: { ishipOrderId: 1, trackingNumber: 1, ishipRef: 1 },
            $set:   { status: "processing" },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
