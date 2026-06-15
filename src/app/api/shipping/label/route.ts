import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ISHIP_BASE  = process.env.ISHIP_API_URL   || "https://app.iship.cloud/api";
const ISHIP_TOKEN = process.env.ISHIP_BEARER_TOKEN || "";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trackingNumber = req.nextUrl.searchParams.get("tracks");
    if (!trackingNumber) return NextResponse.json({ error: "tracks required" }, { status: 400 });

    try {
        const res = await fetch(`${ISHIP_BASE}/download/pdf?tracks=${encodeURIComponent(trackingNumber)}`, {
            headers: {
                Authorization: `Bearer ${ISHIP_TOKEN}`,
                Accept: "application/pdf",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: `iShip error ${res.status}`, detail: text.slice(0, 200) }, { status: 502 });
        }

        const pdf = await res.arrayBuffer();
        return new NextResponse(pdf, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="label-${trackingNumber}.pdf"`,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
