import { NextRequest, NextResponse } from "next/server";
import { getDHLRates } from "@/lib/dhl";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { dst_zipcode, dst_city, dst_country, weightKg, width, length, height } = body;

        if (!dst_country) {
            return NextResponse.json({ error: "dst_country required (e.g. US, JP, SG)" }, { status: 400 });
        }

        const rates = await getDHLRates({
            dst_zipcode:  dst_zipcode  || "",
            dst_city:     dst_city     || "",
            dst_country,
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
