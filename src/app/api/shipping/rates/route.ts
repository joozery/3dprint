import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkAllRates } from "@/lib/iship";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { dst_zipcode, dst_province, dst_amphure, dst_district, weightKg, width, length, height } = body;

        if (!dst_zipcode) {
            return NextResponse.json({ error: "dst_zipcode is required" }, { status: 400 });
        }

        const rates = await checkAllRates({
            dst_zipcode,
            dst_province: dst_province || "",
            dst_amphure:  dst_amphure  || "",
            dst_district: dst_district || "",
            weightKg: weightKg || 0.5,
            width:    width    || 20,
            length:   length   || 20,
            height:   height   || 10,
        });

        return NextResponse.json({ success: true, rates });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
