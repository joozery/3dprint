import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getIShipOrderStatus } from "@/lib/iship";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ishipOrderId = req.nextUrl.searchParams.get("order_id");
    if (!ishipOrderId) return NextResponse.json({ error: "order_id required" }, { status: 400 });

    try {
        const result = await getIShipOrderStatus(ishipOrderId);
        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
