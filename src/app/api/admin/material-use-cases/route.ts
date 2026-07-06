import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import MaterialUseCase from "@/models/MaterialUseCase";

const SEED_DATA = [
    { title: "Home Decor", desc: "ของตกแต่งบ้าน", image: "/asset/home.png", order: 1 },
    { title: "Toys & Figures", desc: "ของเล่น & ฟิกเกอร์", image: "/asset/robot.png", order: 2 },
    { title: "Functional Parts", desc: "ชิ้นส่วนการใช้งาน", image: "/asset/automotive-parts.png", order: 3 },
    { title: "Cosplay & Props", desc: "คอสเพลย์ & พร็อพ", image: "/asset/Cosplay.png", order: 4 },
];

async function adminGuard() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") return false;
    return true;
}

export async function GET() {
    if (!(await adminGuard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();

    let items = await MaterialUseCase.find().sort({ order: 1, title: 1 }).lean();

    // Auto-seed if empty
    if (items.length === 0) {
        await MaterialUseCase.insertMany(SEED_DATA);
        items = await MaterialUseCase.find().sort({ order: 1 }).lean();
    }

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(items)) });
}

export async function POST(req: NextRequest) {
    if (!(await adminGuard())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();

    const body = await req.json();
    const item = await MaterialUseCase.create(body);
    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(item)) });
}
