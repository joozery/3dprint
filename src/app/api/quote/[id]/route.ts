import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const quote = await Quote.findById(params.id);

        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: quote });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await req.json();
        const { technology, material, color, quantity } = body;

        const quote = await Quote.findById(params.id);
        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        // ราคาพื้นฐาน
        let basePricePerUnit = 50;
        const volume = quote.volumeCm3 || 0;

        // Logic คำนวณราคาคร่าวๆ (Mock)
        if (technology === "fdm") basePricePerUnit = 2 + (volume * 1.5);
        else if (technology === "sla") basePricePerUnit = 10 + (volume * 5.0);
        else basePricePerUnit = 100 + (volume * 15.0);

        const pricePerUnit = basePricePerUnit;
        const finalQuantity = quantity || quote.quantity || 1;
        const totalPrice = pricePerUnit * finalQuantity;

        const updatedQuote = await Quote.findByIdAndUpdate(
            params.id,
            {
                technology: technology || quote.technology,
                material: material || quote.material,
                color: color || quote.color,
                quantity: finalQuantity,
                "priceDetail.pricePerUnit": pricePerUnit,
                "priceDetail.totalPrice": totalPrice,
            },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updatedQuote });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        await Quote.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
