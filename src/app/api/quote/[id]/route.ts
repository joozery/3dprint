import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import Material from "@/models/Material";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const quote = await Quote.findById(id);

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const body = await req.json();
        const { technology, material, color, quantity } = body;

        const quote = await Quote.findById(id);
        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        // Calc dynamic price
        const volume = quote.volumeCm3 || 0;
        let basePricePerUnit = 50;
        let setupFee = 0;
        let weight = quote.weightGrams || 0;

        const matConfig = await Material.findOne({ systemId: material || quote.material });
        if (matConfig) {
            weight = volume * (matConfig.density || 1.15);
            basePricePerUnit = weight * matConfig.pricePerGram;
            setupFee = matConfig.setupFee || 0;
        } else {
            // fallback
            if (technology === "fdm") basePricePerUnit = 2 + (volume * 1.5);
            else if (technology === "sla") basePricePerUnit = 10 + (volume * 5.0);
            else basePricePerUnit = 100 + (volume * 15.0);
        }

        const pricePerUnit = basePricePerUnit + setupFee;
        const finalQuantity = quantity || quote.quantity || 1;
        const totalPrice = pricePerUnit * finalQuantity;

        const updatedQuote = await Quote.findByIdAndUpdate(
            id,
            {
                technology: technology || quote.technology,
                material: material || quote.material,
                color: color || quote.color,
                quantity: finalQuantity,
                weightGrams: weight,
                "priceDetail.pricePerUnit": pricePerUnit,
                "priceDetail.totalPrice": totalPrice,
                "priceDetail.setupFee": setupFee,
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        await Quote.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
