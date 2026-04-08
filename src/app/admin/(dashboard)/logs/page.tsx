import dbConnect from "@/lib/mongoose";
import AdminLog from "@/models/AdminLog";
import User from "@/models/User";
import { Activity, ShieldAlert, Cpu } from "lucide-react";
import AdminLogsTable from "@/components/admin/logs/AdminLogsTable";

async function getLogs(page: number) {
  await dbConnect();
  const limit = 20;
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AdminLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("adminId", "name email image")
      .lean(),
    AdminLog.countDocuments(),
  ]);
  return {
    logs: JSON.parse(JSON.stringify(logs)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const data = await getLogs(page);

  const statCards = [
    { label: "บันทึกทั้งหมด", sublabel: "Total Logs", value: data.total, icon: Activity },
    { label: "การแก้ไของค์กร", sublabel: "Admin Actions", value: data.total, icon: ShieldAlert },
    { label: "เซิร์ฟเวอร์", sublabel: "System", value: "Active", icon: Cpu },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Logs</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">บันทึกการทำงาน (System Logs)</h1>
        </div>
        <span className="text-slate-400 text-sm">{data.total.toLocaleString()} รายการทั้งหมด</span>
      </div>

      {/* Dark stats bar */}
      <div className="bg-[#080c14] rounded-lg overflow-hidden border border-[#0f1a2e] shadow-2xl flex flex-col lg:flex-row min-h-[150px] relative">
        <div className="absolute -bottom-16 -left-8 w-56 h-56 bg-emerald-600 rounded-full blur-[90px] opacity-20 pointer-events-none" />
        <div className="absolute -top-12 -right-8 w-40 h-40 bg-emerald-400 rounded-full blur-[70px] opacity-10 pointer-events-none" />

        {/* Left panel */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-6 lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-[#0f1e38]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-[0.15em]">Live</span>
          </div>
          <h2 className="text-white text-base font-semibold tracking-tight leading-snug">
            ประวัติ<br className="hidden lg:block" />การทำงาน
          </h2>
          <p className="text-slate-500 text-[11px] mt-1.5 leading-relaxed">บันทึกของระบบทั้งหมด</p>
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
                  <div className="w-7 h-7 rounded-md bg-[#0d1626] border border-[#1a2e50] flex items-center justify-center text-emerald-400 group-hover:bg-[#1a3460] group-hover:border-emerald-500 transition-all">
                    <Icon size={13} strokeWidth={2} />
                  </div>
                  <span className="text-slate-500 text-[9px] font-medium tracking-widest uppercase">{card.sublabel}</span>
                </div>
                <div>
                  <p className="text-white text-xl font-semibold tracking-tight leading-none mb-1">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</p>
                  <p className="text-emerald-500/60 text-[10px] font-medium">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AdminLogsTable
        logs={data.logs}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
      />
    </div>
  );
}
