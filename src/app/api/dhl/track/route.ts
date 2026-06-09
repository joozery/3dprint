import { NextRequest, NextResponse } from "next/server";
import { trackDHL } from "@/lib/dhl";

export async function GET(req: NextRequest) {
    const trackingNumber = req.nextUrl.searchParams.get("tracking_number");
    if (!trackingNumber) {
        return NextResponse.json({ error: "tracking_number required" }, { status: 400 });
    }
    try {
        const data = await trackDHL(trackingNumber);
        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
