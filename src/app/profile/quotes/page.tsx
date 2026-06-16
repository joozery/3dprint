import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";
import Quote from "@/models/Quote";
import MaterialConfig from "@/models/MaterialConfig";
import { redirect } from "next/navigation";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import DashboardHeader from "@/components/profile/DashboardHeader";
import { MobileBottomNav } from "@/components/profile/MobileBottomNav";
import QuotesContent from "@/components/profile/QuotesContent";

export const dynamic = "force-dynamic";

export default async function ProfileQuotesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();

  const userId = (session.user as any)?.id;
  const pageNum = Math.max(parseInt(page || "1", 10), 1);
  const limit = 8;
  const skip = (pageNum - 1) * limit;

  const totalGroupsAgg = await Quote.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$quoteNumber" } },
    { $count: "total" }
  ]);
  const totalItems = totalGroupsAgg[0]?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const raw = await Quote.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    { $group: {
        _id: "$quoteNumber",
        doc: { $first: "$$ROOT" },
        totalItems: { $sum: 1 },
        totalAmount: { $sum: "$priceDetail.totalPrice" }
    }},
    { $sort: { "doc.createdAt": -1 } },
    { $skip: skip },
    { $limit: limit }
  ]);
  const quotesRaw = JSON.parse(JSON.stringify(raw)).map((g: any) => ({
      ...g.doc,
      priceDetail: { ...g.doc.priceDetail, totalPrice: g.totalAmount },
      groupedItemsCount: g.totalItems
  }));

  // วัสดุที่เก็บใน quote เป็น MaterialConfig._id (string) — ต้อง resolve เป็นชื่อที่อ่านได้ ก่อนส่งให้ client component
  const materialIds = [...new Set(quotesRaw.map((q: any) => q.material).filter(Boolean))]
    .filter((mid: any) => /^[0-9a-fA-F]{24}$/.test(mid));
  const materialDocs = materialIds.length ? await MaterialConfig.find({ _id: { $in: materialIds } }).lean() : [];
  const materialNameMap: Record<string, string> = {};
  materialDocs.forEach((m: any) => { materialNameMap[m._id.toString()] = m.name; });
  const quotes = quotesRaw.map((q: any) => ({ ...q, material: materialNameMap[q.material] || q.material }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans relative overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex h-screen z-40 shrink-0 flex-col relative">
        <ProfileSidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full relative z-10 no-scrollbar">
        <DashboardHeader />
        <QuotesContent
          quotes={quotes}
          totalItems={totalItems}
          totalPages={totalPages}
          pageNum={pageNum}
        />
      </main>

      <MobileBottomNav />
    </div>
  );
}
