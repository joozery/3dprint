import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await dbConnect();

    const quote = await Quote.findById(id);
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    quote.status = body.status;
    const updated = await quote.save();

    // Auto-create an Order if status changed to "ordered"
    if (body.status === "ordered") {
      const mongoose = (await import("mongoose")).default;
      const Order = (await import("@/models/Order")).default;

      // Check if an order already exists for this quote to prevent duplicates
      const existingOrder = await Order.findOne({ quotes: quote._id });

      if (!existingOrder) {
        // Fallback addresses if not fully filled in the quote
        const shippingFallback = (quote as any).shipping || {
          fullName: "รออัปเดต",
          phone: "รออัปเดต",
          address: "รออัปเดต",
          province: "รออัปเดต",
          zipCode: "รออัปเดต"
        };

        const newOrder = new Order({
          userId: quote.userId || new mongoose.Types.ObjectId(), // Handle guests safely or link to actual user
          quotes: [quote._id],
          shippingAddress: shippingFallback,
          paymentDetails: {
            method: "bank_transfer",
            status: "pending",
          },
          pricing: {
            subtotal: (quote as any).priceDetail?.totalPrice || 0,
            shippingFee: (quote as any).shippingFee || 0,
            discount: 0,
            totalAmount: (quote as any).priceDetail?.totalPrice || 0,
          },
          status: "pending_payment",
        });

        await newOrder.save();
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error("Update quote status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
