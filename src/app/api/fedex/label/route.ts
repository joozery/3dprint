import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const orderId = req.nextUrl.searchParams.get("orderId");
    if (!orderId) return new NextResponse("Missing orderId", { status: 400 });

    await dbConnect();
    const order = await Order.findById(orderId).select("fedexLabelBase64 orderNumber").lean() as any;
    if (!order?.fedexLabelBase64) {
        return new NextResponse("Label not found", { status: 404 });
    }

    const buffer = Buffer.from(order.fedexLabelBase64, "base64");
    return new NextResponse(buffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="fedex-label-${order.orderNumber || orderId}.pdf"`,
        },
    });
}
