"use client";

import {
  ShoppingCart,
  FileText,
  Clock,
  DollarSign,
  Printer,
  CalendarDays,
} from "lucide-react";

interface AdminDashboardStatsProps {
  totalRevenueThisMonth: number;
  totalRevenueThisYear: number;
  pendingProcessOrdersCount: number;
  pendingQuotesCount: number;
  printingOrdersCount: number;
}

const statCards = (data: AdminDashboardStatsProps) => [
  {
    label: "รายได้เดือนนี้",
    sublabel: "This Month",
    value: `฿${(data.totalRevenueThisMonth || 0).toLocaleString("th-TH")}`,
    icon: DollarSign,
  },
  {
    label: "รายได้ปีนี้",
    sublabel: "This Year",
    value: `฿${(data.totalRevenueThisYear || 0).toLocaleString("th-TH")}`,
    icon: CalendarDays,
  },
  {
    label: "ออเดอร์ใหม่รอดำเนินการ",
    sublabel: "Pending Orders",
    value: (data.pendingProcessOrdersCount || 0).toLocaleString(),
    icon: Clock,
  },
  {
    label: "งานกำลังพิมพ์",
    sublabel: "Active Prints",
    value: (data.printingOrdersCount || 0).toLocaleString(),
    icon: Printer,
  },
  {
    label: "ใบเสนอราคารอทีมติดต่อ",
    sublabel: "New Quotes",
    value: (data.pendingQuotesCount || 0).toLocaleString(),
    icon: FileText,
  },
];

export default function AdminDashboardStats(props: AdminDashboardStatsProps) {
  const cards = statCards(props);

  return (
    <div className="bg-[#080c14] rounded-lg overflow-hidden border border-[#0f1a2e] shadow-2xl flex flex-col lg:flex-row min-h-[180px] relative">

      {/* Blue neon glow — bottom-left */}
      <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-[#2563eb] rounded-full blur-[100px] opacity-25 pointer-events-none" />
      {/* Subtle top-right shimmer */}
      <div className="absolute -top-16 -right-10 w-48 h-48 bg-[#60a5fa] rounded-full blur-[80px] opacity-10 pointer-events-none" />

      {/* ── Left panel ─────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center px-8 py-8 lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-[#0f1e38]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#60a5fa] animate-pulse" />
          <span className="text-[#60a5fa] text-[11px] font-semibold tracking-[0.15em] uppercase">Live</span>
        </div>
        <h2 className="text-white text-xl font-semibold tracking-tight leading-snug mb-2">
          ภาพรวม<br className="hidden lg:block" />& สถิติ
        </h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          ข้อมูลอัพเดทแบบ Real-time จากระบบ PDM 3D Print
        </p>
      </div>

      {/* ── Right stat cards ────────────────────────── */}
      <div className="relative z-10 flex flex-1 overflow-x-auto">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isLast = idx === cards.length - 1;

          return (
            <div
              key={idx}
              className={`flex flex-col justify-between flex-1 min-w-[160px] px-6 py-7 group transition-all duration-200 hover:bg-[#0d1626] ${!isLast ? "border-r border-[#0f1e38]" : ""}`}
            >
              {/* Top row: icon + sublabel */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-md bg-[#0d1626] border border-[#1a2e50] flex items-center justify-center text-[#60a5fa] group-hover:bg-[#1a3460] group-hover:border-[#2563eb] transition-all">
                  <Icon size={15} strokeWidth={2} />
                </div>
                <span className="text-slate-500 text-[10px] font-medium tracking-widest uppercase">{card.sublabel}</span>
              </div>

              {/* Big number */}
              <div>
                <p className="text-white text-2xl font-semibold tracking-tight leading-none mb-1.5">{card.value}</p>
                <p className="text-[#3b82f6]/60 text-[11px] font-medium">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
