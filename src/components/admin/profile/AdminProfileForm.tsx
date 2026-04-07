"use client";

import { useState, useRef } from "react";
import { User, Mail, Lock, Loader2, CheckCircle, AlertCircle, Camera, ShieldCheck, KeyRound } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminProfileForm() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    currentPassword: "",
    newPassword: "",
    image: session?.user?.image || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "ขนาดไฟล์ต้องไม่เกิน 5MB", type: "error" });
      return;
    }
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    try {
      const res = await fetch("/api/admin/profile/avatar", { method: "POST", body: uploadFormData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setFormData(prev => ({ ...prev, image: data.imageUrl }));
      await update({ ...session, user: { ...session?.user, image: data.imageUrl } });
      setMessage({ text: "อัปโหลดรูปภาพสำเร็จ", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await update({ ...session, user: { ...session?.user, name: formData.name, email: formData.email } });
      setMessage({ text: "อัปเดตข้อมูลสำเร็จ", type: "success" });
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* ── Left: Avatar card ── */}
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Top accent */}
          <div className="h-16 bg-gradient-to-r from-[#080c14] to-[#0d1f3c] relative">
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #2563eb 0%, transparent 60%)" }} />
          </div>

          <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
            {/* Avatar */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden group shrink-0"
            >
              {formData.image ? (
                <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{formData.name?.charAt(0)?.toUpperCase() || "A"}</span>
                </div>
              )}
              <div className={`absolute inset-0 bg-slate-900/60 flex items-center justify-center transition-opacity ${uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {uploading ? <Loader2 size={18} className="text-white animate-spin" /> : <Camera size={18} className="text-white" />}
              </div>
            </button>

            <h3 className="text-slate-800 font-bold text-base mt-4 leading-tight truncate max-w-full">{formData.name || "Admin"}</h3>
            <p className="text-slate-400 text-xs mt-1 truncate max-w-full">{formData.email}</p>

            <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-semibold">
              <ShieldCheck size={11} />
              ผู้ดูแลระบบ
            </span>

            {/* Info rows */}
            <div className="w-full mt-5 pt-5 border-t border-slate-100 space-y-3">
              {[
                { label: "ระดับสิทธิ์", value: "Root Admin", color: "text-emerald-600" },
                { label: "การเข้าถึง", value: "Full Access", color: "text-blue-600" },
                { label: "2FA Login", value: "OTP Email", color: "text-amber-600" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">{row.label}</span>
                  <span className={`text-[11px] font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-300 text-[10px] mt-4">คลิกที่รูปเพื่อเปลี่ยน Avatar</p>
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* General info card */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                <User size={14} />
              </div>
              <div>
                <h2 className="text-slate-800 text-sm font-bold leading-none">ข้อมูลส่วนตัว</h2>
                <p className="text-slate-400 text-[11px] mt-1">ชื่อที่แสดงในระบบ และอีเมลสำหรับเข้าสู่ระบบ</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-semibold">ชื่อ-นามสกุล</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-semibold">
                  อีเมล
                  <span className="ml-2 text-slate-400 font-normal">(ใช้สำหรับ Login + OTP)</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email"
                    readOnly
                    value={formData.email}
                    className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-400 bg-slate-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security card */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                <KeyRound size={14} />
              </div>
              <div>
                <h2 className="text-slate-800 text-sm font-bold leading-none">ความปลอดภัย</h2>
                <p className="text-slate-400 text-[11px] mt-1">เปลี่ยนรหัสผ่าน — แนะนำให้เปลี่ยนเป็นประจำ</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Current password */}
              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-semibold">รหัสผ่านปัจจุบัน</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password"
                    placeholder="กรอกรหัสผ่านเดิม"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-semibold">รหัสผ่านใหม่ <span className="text-slate-400 font-normal">(ขั้นต่ำ 6 ตัว)</span></label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password"
                    placeholder="รหัสผ่านใหม่ที่ต้องการ"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`flex items-center gap-2.5 p-3.5 rounded-lg border text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
              {message.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              <span className="text-[12px] font-medium">{message.text}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold transition-all shadow-lg shadow-slate-900/10 disabled:opacity-40 active:scale-95"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
