import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { calculatePrice, parsePrintTimeToMinutes } from "@/lib/pricing";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const quote = await Quote.findById(id);
        if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
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
        const { technology, material, color, quantity, deliverySpeed, finish, billing, shipping, infill } = body;

        const quote = await Quote.findById(id);
        if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

        // ดึง MaterialConfig ด้วย _id ของ material ที่เลือก
        const MaterialConfig = require("@/models/MaterialConfig").default;
        const matConfig = await MaterialConfig.findById(material || quote.material).catch(() => null);

        const density       = matConfig?.density                 || 1.15;
        const sellPerGram   = matConfig?.pricing?.sellPerGram    || 1;
        const sellPerMinute = matConfig?.pricing?.sellPerMinute  || 0;
        const setupFee      = matConfig?.pricing?.setupFee       || 0;

        // หา finish price จาก postProcessing ของ material
        const finalFinish = finish || quote.finish || "standard";
        let finishPrice = 0;
        if (finalFinish !== "standard" && matConfig?.postProcessing?.length) {
            const proc = matConfig.postProcessing.find((p: any) => p.name === finalFinish);
            if (proc) finishPrice = proc.sellPrice || 0;
        }

        const finalQuantity    = quantity ?? quote.quantity ?? 1;
        const finalInfill      = infill   ?? quote.infill  ?? 20;

        // filament approximation เมื่อ infill เปลี่ยน
        // baseFilamentCm3 = filament ที่ slice ได้ตอน upload (infill default = 20%)
        // shellVolumeCm3 = ส่วนที่ไม่ใช่ infill (ผนัง + top/bottom) — คงที่ตลอด
        // filamentCm3(x%) = shellVolumeCm3 + volumeCm3 * (x/100)
        const BASE_INFILL      = 20;
        const baseFilamentCm3  = (quote as any).baseFilamentCm3 || (quote as any).filamentCm3 || quote.volumeCm3 || 0;
        const volumeCm3        = quote.volumeCm3 || 0;
        const shellVolumeCm3   = Math.max(0, baseFilamentCm3 - volumeCm3 * (BASE_INFILL / 100));
        const newFilamentCm3   = shellVolumeCm3 + volumeCm3 * (finalInfill / 100);

        // print time approximation — ประมาณ 30% ของเวลาคือ infill
        const INFILL_TIME_FRACTION = 0.30;
        const basePrintMinutes = (quote as any).basePrintTimeMinutes || parsePrintTimeToMinutes(quote.printTime || "0m");
        const newPrintMinutes  = basePrintMinutes * (1 - INFILL_TIME_FRACTION + INFILL_TIME_FRACTION * (finalInfill / BASE_INFILL));

        const supportVolumeCm3 = (quote as any).supportVolumeCm3 || 0;

        const priceBreakdown = calculatePrice({
            filamentCm3:     newFilamentCm3,
            supportVolumeCm3,
            density,
            sellPerGram,
            printTimeMinutes: newPrintMinutes,
            sellPerMinute,
            setupFee,
            quantity: finalQuantity,
            finishPrice,
        });

        const updatedQuote = await Quote.findByIdAndUpdate(
            id,
            {
                technology:    technology    || quote.technology,
                material:      material      || quote.material,
                color:         color         || quote.color,
                quantity:      finalQuantity,
                deliverySpeed: deliverySpeed || quote.deliverySpeed,
                finish:        finalFinish,
                billing:       billing       || quote.billing,
                shipping:      shipping      || quote.shipping,
                infill:        finalInfill,
                filamentCm3:   newFilamentCm3,
                weightGrams:   priceBreakdown.weightGrams,
                "priceDetail.pricePerUnit":  priceBreakdown.pricePerUnit,
                "priceDetail.totalPrice":    priceBreakdown.totalPrice,
                "priceDetail.setupFee":      priceBreakdown.setupFee,
                "priceDetail.materialCost":  priceBreakdown.materialCost,
                "priceDetail.timeCost":      priceBreakdown.timeCost,
                "priceDetail.finishCost":    priceBreakdown.finishCost,
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
