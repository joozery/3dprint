import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

let _cache: any = null;
function getAddressData() {
    if (_cache) return _cache;
    const filePath = path.join(process.cwd(), "public", "data", "thai_address.json");
    _cache = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return _cache;
}

export async function GET(req: NextRequest) {
    const zipcode  = req.nextUrl.searchParams.get("zipcode")?.trim();
    const province = req.nextUrl.searchParams.get("province")?.trim();
    const amphure  = req.nextUrl.searchParams.get("amphure")?.trim();

    const data = getAddressData();

    // Lookup by zipcode → list of {province, amphure, district}
    if (zipcode && zipcode.length === 5) {
        const matches = data.byZipcode[zipcode] || [];
        return NextResponse.json({
            success: true,
            results: matches.map((m: any) => ({
                province: m.p,
                amphure:  m.a,
                district: m.d,
                zipcode,
            })),
        });
    }

    // List of provinces
    if (!province) {
        return NextResponse.json({ success: true, provinces: data.provinces });
    }

    // List of amphures in a province
    const amphures = Object.keys(data.byProvince[province] || {});
    if (!amphure) {
        return NextResponse.json({ success: true, amphures });
    }

    // List of districts in province+amphure
    const districts = data.byProvince[province]?.[amphure] || [];
    return NextResponse.json({ success: true, districts });
}
