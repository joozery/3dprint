"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, Activity, Trash2, Clock, CheckCircle, Fingerprint, DatabaseBackup } from "lucide-react";

interface AdminLog {
  _id: string;
  adminId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  action: string;
  details: string;
  targetId?: string;
  createdAt: string;
}

interface Props {
  logs: AdminLog[];
  total: number;
  page: number;
  totalPages: number;
}

function getActionIcon(action: string) {
  if (action?.includes("VERIFY_USER")) return <CheckCircle size={14} className="text-emerald-500" />;
  if (action?.includes("DELETE_MODEL") || action?.includes("DELETE_QUOTE")) return <Trash2 size={14} className="text-red-500" />;
  if (action?.includes("LOGIN")) return <Fingerprint size={14} className="text-blue-500" />;
  return <DatabaseBackup size={14} className="text-slate-500" />;
}

export default function AdminLogsTable({ logs, total, page, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    startTransition(() => { router.push(`${pathname}?${params.toString()}`); });
  };

  const filtered = search.trim()
    ? logs.filter((l) =>
        l.adminId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.action?.toLowerCase().includes(search.toLowerCase()) ||
        l.details?.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  return (
    <div className="space-y-4">
      {/* Search + count bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-5 py-3.5 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, แอดมิน, รายละเอียด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 bg-slate-50 focus:bg-white transition-all"
          />
        </div>
        <span className="text-slate-400 text-xs ml-auto">
          แสดง <span className="font-semibold text-slate-600">{filtered.length}</span> / {total} รายการ
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {isPending ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <Activity size={20} className="animate-spin text-emerald-400" />
            <p className="text-xs">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest min-w-[200px]">ผู้ดำเนินการ (Admin)</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest min-w-[150px]">ประเภทคำสั่ง</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest w-full">รายละเอียด</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest text-right min-w-[180px]">เวลาที่บันทึก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((log) => {
                  return (
                    <tr key={log._id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Admin Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                            {log.adminId?.image ? (
                              <Image src={log.adminId.image} alt={log.adminId.name} width={32} height={32} className="object-cover w-full h-full" />
                            ) : (
                              <span className="text-slate-500 text-xs font-bold">{log.adminId?.name?.charAt(0).toUpperCase() || "A"}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-800 font-semibold text-xs leading-none">{log.adminId?.name || "Unknown Admin"}</p>
                            <p className="text-slate-400 text-[10px] mt-1 truncate max-w-[150px]">{log.adminId?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-md bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                              {getActionIcon(log.action)}
                           </div>
                           <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{log.action || 'ACTION'}</span>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 truncate max-w-[400px]" title={log.details}>{log.details}</p>
                        {log.targetId && (
                           <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">Ref ID: {log.targetId}</p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-slate-500">
                           <Clock size={12} className="text-slate-400" />
                           <span className="text-[11px]">
                             {new Date(log.createdAt).toLocaleString("th-TH")}
                           </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                   <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">ไม่พบประวัติการทำงานในระบบ</td>
                   </tr>
                )}
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
