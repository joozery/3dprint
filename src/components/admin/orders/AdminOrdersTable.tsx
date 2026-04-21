"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw, Filter, ShoppingBag, FileText } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  pricing: { subtotal: number; shippingFee: number; totalAmount: number };
  paymentDetails: { method: string; status: string };
  userId?: { name?: string; email?: string } | null;
  createdAt: string;
  trackingNumber?: string;
  quotes?: { _id: string; originalName?: string; fileName?: string }[];
}

interface Props {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus: string;
}

const statusOptions = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending_payment", label: "รอชำระ" },
  { value: "processing", label: "ดำเนินการ" },
  { value: "printing", label: "กำลังพิมพ์" },
  { value: "shipped", label: "จัดส่งแล้ว" },
  { value: "delivered", label: "ได้รับแล้ว" },
  { value: "cancelled", label: "ยกเลิก" },
];

const statusDisplay: Record<string, { label: string; color: string; dot: string }> = {
  pending_payment: { label: "รอชำระ", color: "text-amber-600 bg-amber-50 border-amber-100", dot: "bg-amber-500" },
  processing: { label: "ดำเนินการ", color: "text-blue-600 bg-blue-50 border-blue-100", dot: "bg-blue-500" },
  printing: { label: "พิมพ์อยู่", color: "text-violet-600 bg-violet-50 border-violet-100", dot: "bg-violet-500" },
  shipped: { label: "จัดส่ง", color: "text-cyan-600 bg-cyan-50 border-cyan-100", dot: "bg-cyan-500" },
  delivered: { label: "ได้รับแล้ว", color: "text-emerald-600 bg-emerald-50 border-emerald-100", dot: "bg-emerald-500" },
  cancelled: { label: "ยกเลิก", color: "text-red-600 bg-red-50 border-red-100", dot: "bg-red-500" },
};

const paymentMethodLabel: Record<string, string> = {
  bank_transfer: "โอนเงิน",
  promptpay: "พร้อมเพย์",
  credit_card: "บัตรเครดิต",
};

export default function AdminOrdersTable({ orders, total, page, totalPages, currentStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Filter Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 text-slate-400 text-xs font-black uppercase tracking-widest">
          <Filter size={14} className="text-blue-500" />
          <span>Filters:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {statusOptions.map((opt) => (
            <button 
              key={opt.value} 
              onClick={() => setFilter("status", opt.value)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border shadow-sm ${
                currentStatus === opt.value
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/20 shadow-lg scale-105"
                  : "bg-white text-slate-500 border-blue-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
        {isPending ? (
          <div className="py-24 text-center">
            <RefreshCw size={24} className="text-blue-500 animate-spin mx-auto" />
            <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Updating View...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <ShoppingBag size={32} />
            </div>
            <p className="text-slate-500 font-black text-sm uppercase tracking-tight">ไม่พบคำสั่งซื้อ</p>
            <p className="text-slate-400 text-[11px] mt-1">ลองเปลี่ยนการกรองหรือคำค้นหาใหม่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-blue-50">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">เลขออเดอร์ / โปรเจค</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">ข้อมูลลูกค้า</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">ชำระเงิน</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">สถานะปัจจุบัน</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">ยอดสุทธิ</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">จัดการสิทธิ์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {orders.map((order) => {
                  const status = statusDisplay[order.status] || { label: order.status, color: "text-slate-500 bg-slate-100 border-slate-200", dot: "bg-slate-400" };
                  return (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-between mb-1">
                          <Link href={`/admin/orders/${order._id}`} className="text-blue-600 font-black text-[13px] tracking-tight hover:underline">#{order.orderNumber}</Link>
                          <span className="text-slate-400 text-[10px] font-bold">{new Date(order.createdAt).toLocaleDateString("th-TH")}</span>
                        </div>
                        {order.quotes && order.quotes.length > 0 && (
                          <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2">
                            {order.quotes.map(q => (
                              <Link key={q._id} href={`/profile/quotes/${q._id}`} target="_blank" className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 transition-colors w-max max-w-[200px]" title="ดูใบเสนอราคา">
                                <FileText size={13} className="shrink-0 text-slate-400" />
                                <span className="truncate font-medium">{q.originalName || q.fileName || 'ใบเสนอราคา'}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-slate-900 font-black text-[13px]">{order.userId?.name || "—"}</p>
                        <p className="text-slate-400 text-[11px] font-medium mt-0.5">{order.userId?.email || "—"}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-blue-50/50 rounded-lg inline-block border border-blue-100/50">
                          {paymentMethodLabel[order.paymentDetails.method] || order.paymentDetails.method}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-900 font-black text-[14px]">฿{order.pricing.totalAmount.toLocaleString("th-TH")}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <div className="relative inline-block w-full max-w-[140px]">
                            <select 
                              value={order.status} 
                              disabled={updatingId === order._id}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="w-full bg-white border border-blue-100 text-slate-700 text-[11px] font-bold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all hover:border-blue-300 disabled:opacity-50 appearance-none shadow-sm"
                            >
                              {statusOptions.slice(1).map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                              <ChevronRight size={14} className="rotate-90" />
                            </div>
                          </div>
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
          <div className="flex items-center justify-between px-8 py-6 bg-slate-50/30 border-t border-blue-50">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              หน้าที่ <span className="text-slate-900">{page}</span> จาก <span className="text-slate-900">{totalPages}</span>
              <span className="ml-3 opacity-50">({total} รายการ)</span>
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setPage(page - 1)} 
                disabled={page <= 1}
                className="w-10 h-10 rounded-xl bg-white border border-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(page + 1)} 
                disabled={page >= totalPages}
                className="w-10 h-10 rounded-xl bg-white border border-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
