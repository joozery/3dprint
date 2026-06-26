import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        
        const { searchParams } = new URL(req.url);
        const idsParam = searchParams.get("ids");
        
        let query: any = { status: "draft" };
        
        const orConditions = [];

        // If user is logged in, find all their pending quotes
        if (session?.user?.email) {
            const User = require("@/models/User").default;
            const userDb = await User.findOne({ email: session.user.email });
            if (userDb) {
                orConditions.push({ userId: userDb._id });
            }
        }
        
        // Include anonymous quotes stored in the user's local browser memory
        if (idsParam) {
            const idsArray = idsParam.split(",").filter(Boolean);
            if (idsArray.length > 0) {
                orConditions.push({ _id: { $in: idsArray } });
            }
        }
        
        // If neither logged in nor have local ids, return empty
        if (orConditions.length === 0) {
            return NextResponse.json({ success: true, quotes: [] });
        }
        
        query.$or = orConditions;

        const quotes = await Quote.find(query).sort({ createdAt: -1 }).lean();

        // Enrich materialName สำหรับ quotes ที่ยังไม่มีชื่อวัสดุ (quotes เก่า)
        const missingNameQuotes = quotes.filter((q: any) => !q.materialName && q.material);
        if (missingNameQuotes.length > 0) {
            const MaterialConfig = require("@/models/MaterialConfig").default;
            const matIds = [...new Set(missingNameQuotes.map((q: any) => q.material))];
            const matDocs = await MaterialConfig.find({ _id: { $in: matIds } }).lean();
            const matNameMap: Record<string, string> = {};
            matDocs.forEach((m: any) => { matNameMap[m._id.toString()] = m.name || ""; });
            quotes.forEach((q: any) => {
                if (!q.materialName && q.material && matNameMap[q.material]) {
                    q.materialName = matNameMap[q.material];
                }
            });
        }

        return NextResponse.json({ success: true, quotes });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
