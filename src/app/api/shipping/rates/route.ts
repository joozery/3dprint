import { NextRequest, NextResponse } from "next/server";
import { checkAllRates } from "@/lib/iship";
import { getDHLRates } from "@/lib/dhl";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            countryCode = "TH",
            dst_zipcode, dst_province, dst_amphure, dst_district,
            dst_city,
            weightKg, width, length, height,
        } = body;

        const wKg = weightKg || 0.5;
        const w   = width    || 20;
        const l   = length   || 20;
        const h   = height   || 10;

        // ── International → DHL ──────────────────────────────────────
        if (countryCode !== "TH") {
            if (!dst_city) {
                return NextResponse.json({ error: "dst_city is required for international shipping" }, { status: 400 });
            }
            const dhlRates = await getDHLRates({
                dst_zipcode:  dst_zipcode || "",
                dst_city,
                dst_country:  countryCode,
                weightKg: wKg,
                width: w, length: l, height: h,
            });
            const rates = dhlRates.map(r => ({
                courier_code:       `dhl_${r.productCode}`,
                courier_name:       `DHL Express — ${r.productName}`,
                logo:               "/shipping/dhl.svg",
                price:              r.totalPrice,
                fuel_surcharge_fee: 0,
                remote_area:        0,
                total_price:        r.totalPrice,
                estimate_days:      r.estimatedDays?.split("T")[0] || "-",
            }));
            return NextResponse.json({ success: true, rates });
        }

        // ── Domestic TH → iShip ──────────────────────────────────────
        if (!dst_zipcode) {
            return NextResponse.json({ error: "dst_zipcode is required" }, { status: 400 });
        }
        const rates = await checkAllRates({
            dst_zipcode,
            dst_province: dst_province || "",
            dst_amphure:  dst_amphure  || "",
            dst_district: dst_district || "",
            weightKg: wKg, width: w, length: l, height: h,
        });
        return NextResponse.json({ success: true, rates });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
