import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, orderValue } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "กรุณาระบุรหัสคูปอง" }, { status: 400 });
    }

    await dbConnect();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ success: false, error: "ไม่พบรหัสคูปองนี้" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: "คูปองนี้ถูกระงับการใช้งาน" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: "คูปองนี้หมดอายุแล้ว" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: "คูปองนี้ถูกใช้ครบจำนวนที่จำกัดแล้ว" }, { status: 400 });
    }

    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
      return NextResponse.json({ success: false, error: `ยอดสั่งซื้อขั้นต่ำต้องถึง ฿${coupon.minOrderValue}` }, { status: 400 });
    }

    // Calculate discount value based on the orderValue
    let discountValue = 0;
    if (coupon.discountType === "percentage") {
      discountValue = (orderValue * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountValue = Math.min(discountValue, coupon.maxDiscount);
      }
    } else {
      discountValue = coupon.discountValue;
    }

    // Never exceed order value
    discountValue = Math.min(discountValue, orderValue);

    return NextResponse.json({ 
      success: true, 
      discountValue,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscount: coupon.maxDiscount,
      }
    });

  } catch (error: any) {
    console.error("Validate coupon error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
