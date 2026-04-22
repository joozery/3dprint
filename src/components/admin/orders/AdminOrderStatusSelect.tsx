"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending_payment", label: "รอชำระ/รอยืนยันสลิป" },
  { value: "processing", label: "ดำเนินการ (เตรียมพิมพ์)" },
  { value: "printing", label: "กำลังพิมพ์ 3D" },
  { value: "shipped", label: "จัดส่งแล้ว" },
  { value: "delivered", label: "ได้รับสินค้าแล้ว" },
  { value: "cancelled", label: "ยกเลิกออเดอร์" },
];

export default function AdminOrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success("อัปเดตสถานะออเดอร์สำเร็จ");
        router.refresh();
      } else {
        toast.error("อัปเดตสถานะไม่สำเร็จ");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative inline-block w-48 shrink-0">
      <select 
        value={currentStatus} 
        disabled={isUpdating}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="w-full bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-blue-300 disabled:opacity-50 appearance-none shadow-sm"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
        {isUpdating ? <Loader2 size={16} className="animate-spin text-blue-500" /> : <ChevronRight size={16} className="rotate-90" />}
      </div>
    </div>
  );
}
