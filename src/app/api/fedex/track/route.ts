import { NextRequest, NextResponse } from "next/server";
import { trackFedEx } from "@/lib/fedex";

export async function GET(req: NextRequest) {
    const trackingNumber = req.nextUrl.searchParams.get("tracking_number");
    if (!trackingNumber) {
        return NextResponse.json({ error: "tracking_number required" }, { status: 400 });
    }
    try {
        const data = await trackFedEx(trackingNumber);
        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
