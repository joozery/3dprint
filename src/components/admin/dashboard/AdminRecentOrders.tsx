"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight, User } from "lucide-react";
import Image from "next/image";

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  pricing: { totalAmount: number };
  paymentDetails: { status: string };
  userId?: { name?: string; email?: string; image?: string } | null;
  createdAt: string;
}

const statusMap: Record<string, { label: string; color: string; dot: string }> = {
  pending_payment: { label: "รอชำระ",        color: "text-amber-600 bg-amber-50 border-amber-200",   dot: "bg-amber-400" },
  processing:      { label: "ดำเนินการ",     color: "text-blue-600 bg-blue-50 border-blue-200",      dot: "bg-blue-400" },
  printing:        { label: "กำลังพิมพ์",    color: "text-violet-600 bg-violet-50 border-violet-200", dot: "bg-violet-400" },
  shipped:         { label: "จัดส่งแล้ว",    color: "text-cyan-600 bg-cyan-50 border-cyan-200",      dot: "bg-cyan-400" },
  delivered:       { label: "สำเร็จ",        color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-400" },
  cancelled:       { label: "ยกเลิก",        color: "text-red-500 bg-red-50 border-red-200",         dot: "bg-red-400" },
};

export default function AdminRecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
            <ShoppingCart size={16} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-slate-800 text-sm font-bold leading-none">รายการคำสั่งซื้อล่าสุด</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Real-time feed</p>
            </div>
          </div>
        </div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11px] font-semibold transition-colors group"
        >
          ดูทั้งหมด
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/40">
              <th className="px-6 py-3.5 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">เลขที่ออเดอร์</th>
              <th className="px-6 py-3.5 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">ลูกค้า</th>
              <th className="px-6 py-3.5 text-slate-400 text-[10px] font-semibold uppercase tracking-widest text-center">สถานะ</th>
              <th className="px-6 py-3.5 text-slate-400 text-[10px] font-semibold uppercase tracking-widest text-right">ยอดรวม</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ShoppingCart size={24} />
                    <span className="text-sm text-slate-400">ไม่มีรายการ</span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = statusMap[order.status] || { label: order.status, color: "text-slate-500 bg-slate-50 border-slate-200", dot: "bg-slate-400" };
                return (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Order number */}
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order._id}`} className="text-slate-800 font-semibold text-sm group-hover:text-blue-600 transition-colors block mb-0.5">
                        #{order.orderNumber}
                      </Link>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                          {order.userId?.image
                            ? <Image src={order.userId.image} alt="user" width={28} height={28} className="object-cover" />
                            : <User size={13} />}
                        </div>
                        <div>
                          <p className="text-slate-700 font-medium text-sm leading-none truncate max-w-[160px]">{order.userId?.name || "ไม่ระบุ"}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5 truncate max-w-[160px]">{order.userId?.email || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-800 font-bold text-sm">
                        ฿{order.pricing.totalAmount.toLocaleString("th-TH", { minimumFractionDigits: 0 })}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
