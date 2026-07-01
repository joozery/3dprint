import { NextRequest, NextResponse } from "next/server";
import { getFedExRates } from "@/lib/fedex";

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

        console.log("[FedEx rates]", dst_country, "→ found", rates.length, "rates", rates.map(r => r.serviceType));
        return NextResponse.json({ rates });
    } catch (err: any) {
        console.error("[FedEx rates ERROR]", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
