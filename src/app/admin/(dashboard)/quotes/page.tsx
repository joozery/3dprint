import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import AdminQuotesTable from "@/components/admin/quotes/AdminQuotesTable";
import { FileText, Clock, CheckCircle, XCircle, FileClock } from "lucide-react";

async function getQuotes(page: number, status: string, search?: string, userId?: string) {
  await dbConnect();
  const limit = 20;
  const skip = (page - 1) * limit;

  const matchStage: Record<string, any> = {};
  if (status && status !== "all") {
    matchStage.status = status;
  } else {
    // "all" excludes draft — admin only sees quotes users have actually submitted
    matchStage.status = { $ne: "draft" };
  }
  if (userId) matchStage.userId = userId;

  if (search) {
    const User = (await import("@/models/User")).default;
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }, "_id").lean();
    const matchingUserIds = (matchingUsers as any[]).map((u) => u._id);
    matchStage.$or = [
      { quoteNumber: { $regex: search, $options: "i" } },
      ...(matchingUserIds.length > 0 ? [{ userId: { $in: matchingUserIds } }] : []),
    ];
  }

  // Group by quoteNumber — each "row" = 1 quote batch (may contain multiple files)
  const pipeline: any[] = [
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$quoteNumber",
        quoteNumber: { $first: "$quoteNumber" },
        representativeId: { $first: "$_id" },
        fileCount: { $sum: 1 },
        totalPrice: { $sum: "$priceDetail.totalPrice" },
        status: { $first: "$status" },
        technology: { $first: "$technology" },
        userId: { $first: "$userId" },
        createdAt: { $max: "$createdAt" },
        files: { $push: { _id: "$_id", originalName: "$originalName", fileUrl: "$fileUrl", fileName: "$fileName", volumeCm3: "$volumeCm3", priceDetail: "$priceDetail" } },
      },
    },
    { $sort: { createdAt: -1 } },
  ];

  const [groups, countResult, pendingCount, orderedCount, cancelledCount, draftCount] = await Promise.all([
    Quote.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
    Quote.aggregate([...pipeline, { $count: "total" }]),
    Quote.countDocuments({ status: "pending" }),
    Quote.countDocuments({ status: "ordered" }),
    Quote.countDocuments({ status: "cancelled" }),
    Quote.countDocuments({ status: "draft" }),
  ]);

  // Populate userId for each group
  const User = (await import("@/models/User")).default;
  const userIds = groups.map(g => g.userId).filter(Boolean);
  const users = await User.find({ _id: { $in: userIds } }, "name email").lean();
  const userMap: Record<string, any> = {};
  users.forEach((u: any) => { userMap[u._id.toString()] = u; });

  const quotes = groups.map(g => ({
    ...g,
    _id: g.representativeId,
    userId: g.userId ? userMap[g.userId.toString()] || null : null,
  }));

  const total = countResult[0]?.total || 0;

  return {
    quotes: JSON.parse(JSON.stringify(quotes)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    pendingCount,
    orderedCount,
    cancelledCount,
    draftCount,
  };
}

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string; userId?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const data = await getQuotes(page, params.status || "all", params.search, params.userId);

  const statCards = [
    { label: "ใบเสนอราคาทั้งหมด", sublabel: "Total Quotes", value: data.total,          icon: FileText    },
    { label: "รอดำเนินการ",        sublabel: "Pending",      value: data.pendingCount,   icon: Clock       },
    { label: "สั่งซื้อแล้ว",       sublabel: "Ordered",      value: data.orderedCount,   icon: CheckCircle },
    { label: "ยกเลิก",             sublabel: "Cancelled",    value: data.cancelledCount, icon: XCircle     },
    { label: "ยังไม่ส่งคำขอ",      sublabel: "Draft",        value: data.draftCount,     icon: FileClock   },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Quotes</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">จัดการใบเสนอราคา</h1>
        </div>
        <span className="text-slate-400 text-sm">{data.total.toLocaleString()} รายการทั้งหมด</span>
      </div>

      {/* Dark stats bar — same style as dashboard */}
      <div className="bg-[#080c14] rounded-lg overflow-hidden border border-[#0f1a2e] shadow-2xl flex flex-col lg:flex-row min-h-[150px] relative">

        {/* Blue neon glow */}
        <div className="absolute -bottom-16 -left-8 w-56 h-56 bg-[#2563eb] rounded-full blur-[90px] opacity-20 pointer-events-none" />
        <div className="absolute -top-12 -right-8 w-40 h-40 bg-[#60a5fa] rounded-full blur-[70px] opacity-10 pointer-events-none" />

        {/* Left label panel */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-6 lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-[#0f1e38]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
            <span className="text-[#60a5fa] text-[10px] font-semibold uppercase tracking-[0.15em]">Live</span>
          </div>
          <h2 className="text-white text-base font-semibold tracking-tight leading-snug">
            ใบเสนอราคา<br className="hidden lg:block" />& สถิติ
          </h2>
          <p className="text-slate-500 text-[11px] mt-1.5 leading-relaxed">อัพเดทแบบ Real-time</p>
        </div>

        {/* Stat cards */}
        <div className="relative z-10 flex flex-1 overflow-x-auto">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            const isLast = idx === statCards.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-col justify-between flex-1 min-w-[140px] px-6 py-6 group transition-all duration-200 hover:bg-[#0d1626] ${!isLast ? "border-r border-[#0f1e38]" : ""}`}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-md bg-[#0d1626] border border-[#1a2e50] flex items-center justify-center text-[#60a5fa] group-hover:bg-[#1a3460] group-hover:border-[#2563eb] transition-all">
                    <Icon size={13} strokeWidth={2} />
                  </div>
                  <span className="text-slate-500 text-[9px] font-medium tracking-widest uppercase">{card.sublabel}</span>
                </div>
                <div>
                  <p className="text-white text-xl font-semibold tracking-tight leading-none mb-1">{card.value.toLocaleString()}</p>
                  <p className="text-[#3b82f6]/60 text-[10px] font-medium">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AdminQuotesTable
        quotes={data.quotes}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        currentStatus={params.status || "all"}
        currentSearch={params.search || ""}
      />
    </div>
  );
}
