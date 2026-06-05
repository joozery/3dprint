import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Quote from "@/models/Quote";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();

        let userId = (session.user as any).id;
        if (!userId && session.user.email) {
            const User = require("@/models/User").default;
            const userDb = await User.findOne({ email: session.user.email });
            if (userDb) userId = userDb._id;
        }

        const idsParam = req.nextUrl.searchParams.get("ids");

        let query: any = { userId: userId, status: "draft" };
        if (idsParam) {
            const mongoose = require("mongoose");
            const ids = idsParam.split(',').map(id => id.trim()).filter(id => mongoose.Types.ObjectId.isValid(id));
            if (ids.length > 0) {
                query._id = { $in: ids };
            }
        }

        const quotes = await Quote.find(query);
        return NextResponse.json({ success: true, data: quotes });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ" }, { status: 401 });
        }
        await dbConnect();
        
        let userId = (session.user as any).id;
        if (!userId && session.user.email) {
            const User = require("@/models/User").default;
            const userDb = await User.findOne({ email: session.user.email });
            if (userDb) userId = userDb._id;
        }

        const body = await req.json();
        const { quoteIds, shippingAddress, paymentMethod, customerNotes, shippingFee: clientShippingFee, shippingCourierCode, shippingProvider, shippingServiceType } = body;

        if (!quoteIds || quoteIds.length === 0) {
            return NextResponse.json({ error: "ไม่พบรายการชิ้นงานในตะกร้า" }, { status: 400 });
        }
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
            return NextResponse.json({ error: "กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน" }, { status: 400 });
        }

        const quotes = await Quote.find({
            _id: { $in: quoteIds },
            userId: userId,
            status: "draft" 
        });

        if (quotes.length !== quoteIds.length) {
            return NextResponse.json({ error: "เกิดข้อผิดพลาด: ชิ้นงานบางรายการถูกสั่งซื้อไปแล้ว หรือคุณไม่มีสิทธิ์เข้าถึง" }, { status: 400 });
        }

        const subtotal = quotes.reduce((sum, q) => sum + (q.priceDetail?.totalPrice || 0), 0);
        const shippingFee = clientShippingFee ?? (subtotal > 1500 ? 0 : 50);
        const totalAmount = subtotal + shippingFee;

        const newOrder = await Order.create({
            userId: userId,
            quotes: quotes.map(q => q._id),
            shippingAddress,
            paymentDetails: {
                method: paymentMethod || "bank_transfer",
                status: "pending"
            },
            pricing: {
                subtotal,
                shippingFee,
                discount: 0,
                totalAmount
            },
            status: "pending_payment",
            customerNotes,
            ishipCourierCode: shippingProvider !== "fedex" ? (shippingCourierCode || null) : null,
            shippingProvider:   shippingProvider   || "iship",
            fedexServiceType:   shippingServiceType || null,
        });

        await Quote.updateMany(
            { _id: { $in: quoteIds } },
            { $set: { status: "ordered" } }
        );

        return NextResponse.json({
            success: true,
            message: "สร้างคำสั่งซื้อสำเร็จ กรุณาชำระเงิน",
            data: {
                orderId: newOrder._id,
                orderNumber: newOrder.orderNumber,
                totalAmount: newOrder.pricing.totalAmount
            }
        });

    } catch (error: any) {
        console.error("Checkout Request Error:", error);
        return NextResponse.json({ error: error.message || "ระบบขัดข้อง ไม่สามารถดำเนินการได้" }, { status: 500 });
    }
}
