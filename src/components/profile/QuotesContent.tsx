"use client";

import React from "react";
import Link from "next/link";
import { FileText, Clock, CheckCircle2, XCircle, Building2, User, Package, ChevronLeft, ChevronRight, Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface QuotesContentProps {
  quotes: any[];
  totalItems: number;
  totalPages: number;
  pageNum: number;
}

export default function QuotesContent({ quotes, totalItems, totalPages, pageNum }: QuotesContentProps) {
  const { t } = useLanguage();
  const p = t.profile;

  const statusMap: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
    pending:   { label: p.statusPending,   color: "text-amber-700 bg-amber-50 border-amber-200/50",   icon: Clock },
    ordered:   { label: p.statusOrdered,   color: "text-emerald-700 bg-emerald-50 border-emerald-200/50", icon: CheckCircle2 },
    cancelled: { label: p.statusCancelled, color: "text-red-700 bg-red-50 border-red-200/50",          icon: XCircle },
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl w-full mx-auto pb-24">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight flex items-center justify-between">
          {p.quotesPageTitle}
          <Link href="/quote" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold transition-all">
            {p.createNewQuote} <ArrowUpRight size={16} />
          </Link>
        </h1>
        <p className="text-slate-500 text-[15px] mt-1">{p.quotesPageDesc}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder={p.searchQuotes} className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
        </div>
        <div className="flex gap-3 h-11">
          <button className="flex items-center gap-2 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[13px] font-semibold transition-colors shadow-sm">
            <SlidersHorizontal size={14} /> {p.filter}
          </button>
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-24 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-4 shadow-sm">
            <FileText size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-800 font-bold text-base mb-1">{p.noQuoteHistory}</p>
          <p className="text-slate-500 text-[13px] mb-6">{p.noQuoteHistoryDesc}</p>
          <Link href="/quote" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-[13px] font-bold shadow-lg">
            <FileText size={16} /> {p.firstQuote}
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-6 px-7 py-3.5 bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <div className="col-span-4">{p.itemSpec}</div>
            <div className="col-span-2">{p.createdDate}</div>
            <div className="col-span-2">{p.deliveredTo}</div>
            <div className="col-span-2">{p.netTotal}</div>
            <div className="col-span-2 text-right">{p.statusManage}</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {quotes.map((q: any) => {
              const status = statusMap[q.status] || statusMap.pending;
              const StatusIcon = status.icon;
              const billingLabel = q.billing?.type === "company"
                ? q.billing?.companyName || "องค์กร"
                : q.billing ? `${q.billing.firstName || ""} ${q.billing.lastName || ""}`.trim() || "บุคคล"
                : "-";
              const qtNumber = q._id.toString().slice(-6).toUpperCase();

              return (
                <Link href={`/profile/quotes/${q._id}`} key={q._id} className="block hover:bg-slate-50/70 transition-colors group">
                  <div className="p-5 sm:px-7 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-6 sm:items-center">

                    {/* Column 1: Details */}
                    <div className="sm:col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <Package size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 font-bold text-[14px] truncate">{q.originalName || q.fileName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{q.technology}</span>
                            <span className="text-slate-500 text-[12px] truncate">{q.material} · {q.quantity} ชิ้น</span>
                            {q.groupedItemsCount > 1 && (
                              <span className="text-[10px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">{p.moreItems} {q.groupedItemsCount - 1} รายการ</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Date */}
                    <div className="sm:col-span-2 hidden sm:block">
                      <p className="text-[13px] font-semibold text-slate-700">{new Date(q.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <p className="text-[11px] text-slate-400">{new Date(q.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.</p>
                    </div>

                    {/* Column 3: Billing Type */}
                    <div className="sm:col-span-2 hidden sm:block">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        {q.billing?.type === "company" ? <Building2 size={14} className="text-slate-400" /> : <User size={14} className="text-slate-400" />}
                        <span className="text-[13px] font-medium truncate">{billingLabel}</span>
                      </div>
                    </div>

                    {/* Column 4: Amount */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:block">
                      <span className="sm:hidden text-[12px] font-medium text-slate-500">{p.netTotal}:</span>
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">{q.priceDetail?.totalPrice ? `฿${q.priceDetail.totalPrice.toLocaleString()}` : p.awaitingQuoteLabel}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:block">QT-{qtNumber}</p>
                      </div>
                    </div>

                    {/* Column 5: Status & Action */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 pt-3 border-t border-slate-100 sm:border-0 sm:pt-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border ${status.color}`}>
                        <StatusIcon size={12} strokeWidth={2.5} />
                        {status.label}
                      </span>
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 shadow-sm transition-all shrink-0">
                        <ChevronRight size={16} />
                      </span>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50">
              <p className="text-[12px] font-semibold text-slate-500">
                {p.pageOf} {pageNum} {p.ofTotal} {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/quotes?page=${pageNum - 1}`}
                  className={`p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors ${pageNum <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <ChevronLeft size={16} />
                </Link>
                <Link
                  href={`/profile/quotes?page=${pageNum + 1}`}
                  className={`p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors ${pageNum >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
