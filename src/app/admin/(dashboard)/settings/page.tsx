"use client";

import { Settings, Info, Shield, Layers, LayoutGrid, Database, Cloud } from "lucide-react";

export default function AdminSettingsPage() {
  const systemInfo = [
    { label: "Platform", value: "PDM 3D Print Thailand", icon: LayoutGrid },
    { label: "Framework", value: "Next.js 16 (Turbopack)", icon: Layers },
    { label: "Database", value: "MongoDB Atlas", icon: Database },
    { label: "Storage", value: "Cloudflare R2 + Cloudinary", icon: Cloud },
    { label: "Auth", value: "NextAuth.js (JWT)", icon: Shield },
  ];

  const roles = [
    { role: "Administrator", color: "text-blue-600 bg-blue-50 border-blue-100", desc: "Full access to the management system, orders, users, and settings." },
    { role: "Standard User", color: "text-slate-500 bg-slate-50 border-slate-100", desc: "Ability to upload files, place orders, and manage personal profile." },
  ];

  const statuses = [
    { status: "pending_payment", label: "รอชำระเงิน", desc: "ลูกค้ายังไม่ชำระเงิน", color: "text-amber-600 border-amber-100 bg-amber-50" },
    { status: "processing", label: "ตรวจสอบ", desc: "ทีมงานกำลังตรวจสอบ", color: "text-blue-600 border-blue-100 bg-blue-50" },
    { status: "printing", label: "กำลังพิมพ์", desc: "เครื่องพิมพ์กำลังทำงาน", color: "text-violet-600 border-violet-100 bg-violet-50" },
    { status: "shipped", label: "จัดส่งแล้ว", desc: "อยู่ระหว่างจัดส่งให้ลูกค้า", color: "text-cyan-600 border-cyan-100 bg-cyan-50" },
    { status: "delivered", label: "ส่งถึงแล้ว", desc: "ลูกค้าได้รับสินค้าเรียบร้อย", color: "text-emerald-600 border-emerald-100 bg-emerald-50" },
    { status: "cancelled", label: "ยกเลิก", desc: "ออเดอร์ถูกยกเลิกแล้ว", color: "text-red-600 border-red-100 bg-red-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ตั้งค่าระบบ</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">System Configuration & Platform Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Info Block */}
        <div className="lg:col-span-2 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-blue-50 bg-blue-50/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Info size={16} />
            </div>
            <h2 className="text-slate-900 font-black text-sm uppercase tracking-widest">ข้อมูลทางเทคนิค</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {systemInfo.map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:bg-white transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 border border-slate-100 shadow-sm transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-slate-900 text-sm font-bold mt-1">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Access Control Block */}
        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-blue-50 bg-blue-50/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Shield size={16} />
            </div>
            <h2 className="text-slate-900 font-black text-sm uppercase tracking-widest">การบริหารสิทธิ์</h2>
          </div>
          <div className="p-8 space-y-6">
            {roles.map((item) => (
              <div key={item.role} className="space-y-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.color} shadow-sm mb-2`}>
                  {item.role}
                </span>
                <p className="text-slate-500 text-xs font-medium leading-relaxed pl-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Guide Block */}
        <div className="lg:col-span-3 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-blue-50 bg-blue-50/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Layers size={16} />
            </div>
            <h2 className="text-slate-900 font-black text-sm uppercase tracking-widest">คู่มือสถานะออเดอร์</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {statuses.map((s) => (
                <div key={s.status} className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm ${s.color}`}>
                  <p className="font-black text-[12px] uppercase tracking-wider mb-2">{s.label}</p>
                  <p className="text-slate-500 text-[10px] font-medium leading-relaxed leading-tight">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
