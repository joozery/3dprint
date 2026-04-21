"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Phone, PhoneCall, Save, MessageSquare } from "lucide-react";

interface Props {
  id: string;
  initialStatus: string;
  initialComment: string;
}

export default function QuoteInternalTracker({ id, initialStatus, initialComment }: Props) {
  const [status, setStatus] = useState(initialStatus || "pending");
  const [comment, setComment] = useState(initialComment || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}/internal`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalStatus: status, internalComments: comment })
      });
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      toast.success("อัปเดตสถานะการติดต่อแล้ว");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm mb-6 print:hidden">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <PhoneCall size={16} className="text-blue-500" /> การติดตามลูกค้า (Internal tracking)
      </h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Toggle */}
        <div className="flex-shrink-0 w-full md:w-48">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">สถานะการโทรตาม</label>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setStatus("pending")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${status === "pending" ? "bg-amber-100 text-amber-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
            >
              รอติดต่อ
            </button>
            <button 
              onClick={() => setStatus("contacted")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${status === "contacted" ? "bg-emerald-100 text-emerald-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
            >
              ติดต่อแล้ว
            </button>
          </div>
        </div>

        {/* Comment field */}
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">บันทึกข้อความภายใน / สรุปผล</label>
          <div className="flex gap-3 items-start">
             <div className="relative flex-1">
                <MessageSquare className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 min-h-[42px] focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  placeholder="เช่น ลูกค้าแจ้งว่าจะโอนเงินเย็นนี้, รอลูกค้าคอนเฟิร์มแบบ..."
                />
             </div>
             <button 
               onClick={handleSave}
               disabled={isLoading}
               className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition-colors"
             >
               <Save size={14} /> {isLoading ? "กำลังบันทึก..." : "บันทึกผล"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
