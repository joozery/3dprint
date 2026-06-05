import { NextRequest, NextResponse } from "next/server";
import { getFedExRates } from "@/lib/fedex";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { dst_zipcode, dst_province, weightKg, width, length, height } = body;

        if (!dst_zipcode) {
            return NextResponse.json({ error: "dst_zipcode required" }, { status: 400 });
        }

        const rates = await getFedExRates({
            dst_zipcode,
            dst_province: dst_province || "",
            weightKg:     Math.max(weightKg || 0.1, 0.1),
            width:        width  || 10,
            length:       length || 10,
            height:       height || 10,
        });

        return NextResponse.json({ rates });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
