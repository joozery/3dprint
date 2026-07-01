import { NextRequest, NextResponse } from "next/server";
import { getFedExRates } from "@/lib/fedex";

// Fixed USD→THB rate; override via env FEDEX_USD_TO_THB
const USD_TO_THB = parseFloat(process.env.FEDEX_USD_TO_THB || "36");

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { dst_zipcode, dst_province, dst_city, dst_country, weightKg, width, length, height } = body;

        const rates = await getFedExRates({
            dst_zipcode:  dst_zipcode  || "",
            dst_province: dst_province || "",
            dst_city:     dst_city     || undefined,
            dst_country:  dst_country  || "TH",
            weightKg:     Math.max(weightKg || 0.1, 0.1),
            width:        width  || 10,
            length:       length || 10,
            height:       height || 10,
        });

        // Convert to THB if FedEx returns USD (US-based sandbox account)
        const normalized = rates.map(r => ({
            ...r,
            totalPrice: r.currency === "USD" ? Math.round(r.totalPrice * USD_TO_THB) : r.totalPrice,
            currency: "THB",
        }));

        console.log("[FedEx rates]", dst_country, "→ found", normalized.length, "rates", normalized.map(r => `${r.serviceType} ฿${r.totalPrice}`));
        return NextResponse.json({ rates: normalized });
    } catch (err: any) {
        console.error("[FedEx rates ERROR]", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
