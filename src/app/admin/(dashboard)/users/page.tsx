import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import { Users, UserCheck, UserX } from "lucide-react";

async function getUsers(page: number) {
  await dbConnect();
  const limit = 20;
  const skip = (page - 1) * limit;
  const [users, total, verifiedCount] = await Promise.all([
    User.find({ role: "user" }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "user", isVerified: true }),
  ]);
  return {
    users: JSON.parse(JSON.stringify(users)),
    total,
    verifiedCount,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const data = await getUsers(page);

  const statCards = [
    { label: "สมาชิกทั้งหมด",   sublabel: "Total Users",    value: data.total,                        icon: Users     },
    { label: "ยืนยันแล้ว",      sublabel: "Verified",       value: data.verifiedCount,                icon: UserCheck },
    { label: "รอยืนยัน",        sublabel: "Unverified",     value: data.total - data.verifiedCount,   icon: UserX     },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Users</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">จัดการสมาชิก</h1>
        </div>
        <span className="text-slate-400 text-sm">{data.total.toLocaleString()} สมาชิกทั้งหมด</span>
      </div>

      {/* Dark stats bar */}
      <div className="bg-[#080c14] rounded-lg overflow-hidden border border-[#0f1a2e] shadow-2xl flex flex-col lg:flex-row min-h-[150px] relative">
        <div className="absolute -bottom-16 -left-8 w-56 h-56 bg-[#2563eb] rounded-full blur-[90px] opacity-20 pointer-events-none" />
        <div className="absolute -top-12 -right-8 w-40 h-40 bg-[#60a5fa] rounded-full blur-[70px] opacity-10 pointer-events-none" />

        {/* Left panel */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-6 lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-[#0f1e38]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
            <span className="text-[#60a5fa] text-[10px] font-semibold uppercase tracking-[0.15em]">Live</span>
          </div>
          <h2 className="text-white text-base font-semibold tracking-tight leading-snug">
            สมาชิก<br className="hidden lg:block" />& สถิติ
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

      <AdminUsersTable
        users={data.users}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
      />
    </div>
  );
}
