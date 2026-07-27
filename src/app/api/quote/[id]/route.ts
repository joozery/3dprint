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

        const density       = matConfig?.density                 ?? 1.15;
        const sellPerGram   = matConfig?.pricing?.sellPerGram   ?? 0;
        const sellPerMinute = matConfig?.pricing?.sellPerMinute ?? 0;
        const setupFee      = matConfig?.pricing?.setupFee      ?? 0;

        // หา finish price จาก postProcessing ของ material
        const finalFinish = finish || quote.finish || "standard";
        let finishPrice = 0;
        if (finalFinish !== "standard" && matConfig?.postProcessing?.length) {
            const proc = matConfig.postProcessing.find((p: any) => p.name === finalFinish);
            if (proc) finishPrice = proc.sellPrice || 0;
        }

        const finalQuantity    = quantity ?? quote.quantity ?? 1;
        const finalTechnology  = (technology || quote.technology || "sla").toLowerCase();
        const BASE_INFILL       = 20;
        const MAX_INFILL        = 100;
        const supportVolumeCm3 = (quote as any).supportVolumeCm3 || 0;

        // infill เป็น concept เฉพาะ FDM — เก็บค่าที่ user ปรับไว้เสมอ (เผื่อสลับกลับมา FDM)
        // แต่ใช้คำนวณราคาจริงเฉพาะตอน technology = fdm เท่านั้น เทคโนโลยีอื่น (MJF/SLA/SLS ฯลฯ) ถือว่าทึบเต็มเนื้อ (100%)
        const finalInfill   = infill ?? quote.infill ?? 20;
        const pricingInfill = finalTechnology === "fdm" ? finalInfill : MAX_INFILL;

        // filament: ใช้ shellVolumeCm3 + infillSlopeCm3PerPercent ที่ได้จาก double-slice ตอน upload
        // (slice จริงที่ infill 0% และ 20% ⇒ ความสัมพันธ์เป็นเส้นตรงและแม่นยำ ไม่ต้องประมาณจาก geometry volume)
        const shellVolumeCm3       = (quote as any).shellVolumeCm3 ?? 0;
        const infillSlopeCm3PerPct = (quote as any).infillSlopeCm3PerPercent ?? 0;

        let newFilamentCm3: number;
        if (shellVolumeCm3 > 0 || infillSlopeCm3PerPct > 0) {
            // ไม่บวก supportVolumeCm3 ที่นี่ — calculatePrice() จะบวกให้เองเป็น chargeableVolumeCm3
            newFilamentCm3 = shellVolumeCm3 + infillSlopeCm3PerPct * pricingInfill;
        } else {
            // fallback สำหรับ quote เก่าก่อนมี double-slice (ประมาณจาก geometry volume)
            // ห้ามใช้ quote.filamentCm3 เป็น base เด็ดขาด — มันคือผลลัพธ์ที่คำนวณไปแล้วจาก patch ครั้งก่อน
            // ถ้าใช้เป็น base จะเกิดการพอกพูนค่าซ้อนกันไปเรื่อยๆทุกครั้งที่ลาก slider (บั๊กที่ทำให้ราคาพุ่งจาก 700 เป็น 70,000)
            const baseFilamentCm3 = (quote as any).baseFilamentCm3 || quote.volumeCm3 || 0;
            const volumeCm3       = quote.volumeCm3 || 0;
            const approxShell     = Math.max(0, baseFilamentCm3 - volumeCm3 * (BASE_INFILL / 100));
            newFilamentCm3 = approxShell + volumeCm3 * (pricingInfill / 100);

            // self-heal: เซฟ baseFilamentCm3 ไว้ถ้ายังไม่มี กัน fallback คำนวณผิดซ้ำในรอบถัดไป
            if (!(quote as any).baseFilamentCm3) {
                await Quote.findByIdAndUpdate(id, { baseFilamentCm3 });
            }
        }

        // print time: ใช้ shellPrintTimeMinutes + timeSlopePerPercent จาก double-slice (เช่นกัน)
        const shellPrintTimeMinutes = (quote as any).shellPrintTimeMinutes ?? 0;
        const timeSlopePerPct       = (quote as any).timeSlopePerPercent ?? 0;
        const basePrintMinutes = (quote as any).basePrintTimeMinutes || parsePrintTimeToMinutes(quote.printTime || "0m");

        let newPrintMinutes: number;
        if (shellPrintTimeMinutes > 0 && timeSlopePerPct > 0) {
            newPrintMinutes = shellPrintTimeMinutes + timeSlopePerPct * pricingInfill;
        } else {
            // fallback — ประมาณ 30% ของเวลาคือ infill
            const INFILL_TIME_FRACTION = 0.30;
            newPrintMinutes = basePrintMinutes * (1 - INFILL_TIME_FRACTION + INFILL_TIME_FRACTION * (pricingInfill / BASE_INFILL));
        }

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
                materialName:  material ? (matConfig?.name || "") : (quote.materialName || ""),
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
