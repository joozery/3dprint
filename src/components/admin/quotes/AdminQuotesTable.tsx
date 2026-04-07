"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, ExternalLink, FileText, SlidersHorizontal } from "lucide-react";

interface Quote {
  _id: string;
  originalName: string;
  technology: string;
  material: string;
  color: string;
  quantity: number;
  volumeCm3: number;
  weightGrams: number;
  priceDetail: { pricePerUnit: number; totalPrice: number };
  status: string;
  userId?: { name?: string; email?: string } | null;
  fileUrl?: string;
  createdAt: string;
}

interface Props {
  quotes: Quote[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus: string;
}

const statusOptions = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอดำเนินการ" },
  { value: "ordered", label: "สั่งซื้อแล้ว" },
  { value: "cancelled", label: "ยกเลิก" },
];

const statusDisplay: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: "รอดำเนินการ", color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  ordered: { label: "สั่งซื้อแล้ว", color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-400" },
  cancelled: { label: "ยกเลิก", color: "text-red-500 bg-red-50 border-red-200", dot: "bg-red-400" },
};

export default function AdminQuotesTable({ quotes, total, page, totalPages, currentStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set("page", "1");
    startTransition(() => { router.push(`${pathname}?${params.toString()}`); });
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    startTransition(() => { router.push(`${pathname}?${params.toString()}`); });
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-5 py-3.5 flex items-center gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-slate-400 mr-2">
          <SlidersHorizontal size={14} />
          <span className="text-[11px] font-semibold uppercase tracking-wider">ฟิลเตอร์</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter("status", opt.value)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border ${
                currentStatus === opt.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {isPending ? (
          <div className="py-24 text-center flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw size={22} className="animate-spin text-blue-400" />
            <p className="text-xs font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        ) : quotes.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center gap-3 text-slate-300">
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <FileText size={26} />
            </div>
            <p className="text-slate-400 text-sm font-medium">ไม่พบใบเสนอราคาตามเงื่อนไขนี้</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">ชื่อไฟล์ / วันที่</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">ลูกค้า</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">เทคโนโลยี</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">ปริมาณ / น้ำหนัก</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-right">ราคารวม</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">สถานะ</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {quotes.map((q) => {
                  const status = statusDisplay[q.status] || {
                    label: q.status,
                    color: "text-slate-500 bg-slate-50 border-slate-200",
                    dot: "bg-slate-400",
                  };
                  return (
                    <tr key={q._id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* File / date */}
                      <td className="px-6 py-4">
                        <p className="text-slate-800 font-semibold text-sm truncate max-w-[200px] group-hover:text-blue-600 transition-colors">
                          {q.originalName || "ไม่มีชื่อไฟล์"}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {new Date(q.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="text-slate-700 font-semibold text-sm">{q.userId?.name || "Guest"}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5 truncate max-w-[160px]">{q.userId?.email || "—"}</p>
                      </td>

                      {/* Technology */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100 uppercase tracking-wide">
                          {q.technology}
                        </span>
                        <p className="text-slate-400 text-[10px] mt-1">{q.material} / {q.color}</p>
                      </td>

                      {/* Qty / weight */}
                      <td className="px-6 py-4 text-center">
                        <p className="text-slate-700 font-bold text-sm">{q.quantity} ชิ้น</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{q.weightGrams} g</p>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-right">
                        <p className="text-slate-800 font-bold text-sm">฿{q.priceDetail.totalPrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">฿{q.priceDetail.pricePerUnit.toLocaleString("th-TH")} / ชิ้น</p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold border ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            {q.fileUrl && (
                              <a
                                href={q.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="โหลดไฟล์ 3D"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white transition-all shadow-sm"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                            <a
                              href={`/admin/quotes/${q._id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-all shadow-sm"
                            >
                              <FileText size={12} strokeWidth={2.5} />
                              จัดการราคา
                            </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            <p className="text-slate-400 text-xs">
              หน้า <span className="font-semibold text-slate-600">{page}</span> / {totalPages}
              <span className="ml-2 text-slate-300">({total} รายการ)</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-200 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-200 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
