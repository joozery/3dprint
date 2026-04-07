"use client";

import { LayoutGrid } from "lucide-react";

interface StatusData {
  _id: string;
  count: number;
}

const statusMap: Record<string, { label: string; color: string; bg: string; bar: string }> = {
  pending_payment: {
    label: "รอชำระเงิน",
    color: "text-amber-600",
    bg: "bg-amber-50",
    bar: "bg-amber-400",
  },
  processing: {
    label: "กำลังดำเนินการ",
    color: "text-blue-600",
    bg: "bg-blue-50",
    bar: "bg-blue-500",
  },
  printing: {
    label: "กำลังพิมพ์",
    color: "text-violet-600",
    bg: "bg-violet-50",
    bar: "bg-violet-500",
  },
  shipped: {
    label: "จัดส่งแล้ว",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    bar: "bg-cyan-500",
  },
  delivered: {
    label: "ได้รับแล้ว",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    bar: "bg-emerald-500",
  },
  cancelled: {
    label: "ยกเลิก",
    color: "text-red-500",
    bg: "bg-red-50",
    bar: "bg-red-400",
  },
};

export default function AdminQuoteStats({
  ordersByStatus,
}: {
  ordersByStatus: StatusData[];
}) {
  const data = ordersByStatus.map((item) => ({
    id: item._id,
    label: statusMap[item._id]?.label || item._id,
    value: item.count,
    color: statusMap[item._id]?.color || "text-slate-500",
    bg: statusMap[item._id]?.bg || "bg-slate-50",
    bar: statusMap[item._id]?.bar || "bg-slate-400",
  }));

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
          <LayoutGrid size={18} strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-slate-800 text-sm font-bold leading-none">สัดส่วนออเดอร์</h3>
          <p className="text-slate-400 text-[11px] mt-1">แยกตามสถานะปัจจุบัน</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-2xl font-black text-slate-800">{total}</span>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">รวม</p>
        </div>
      </div>

      {/* Stacked bar */}
      {total > 0 && (
        <div className="flex rounded-full overflow-hidden h-2 mb-6 gap-0.5">
          {data.map((item) => (
            <div
              key={item.id}
              className={`${item.bar} transition-all duration-500`}
              style={{ width: `${(item.value / total) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            />
          ))}
        </div>
      )}

      {/* Status list */}
      <div className="flex flex-col gap-2 flex-1">
        {data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-300">
            <LayoutGrid size={28} />
            <span className="text-xs">ไม่มีข้อมูล</span>
          </div>
        ) : (
          data.map((item) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.id} className="flex items-center gap-3 group hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors">
                {/* Dot */}
                <div className={`w-2 h-2 rounded-full ${item.bar} shrink-0`} />

                {/* Label */}
                <span className="text-slate-600 text-xs font-medium flex-1 truncate">{item.label}</span>

                {/* Progress bar */}
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Count */}
                <span className={`text-xs font-bold w-5 text-right ${item.color}`}>{item.value}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
