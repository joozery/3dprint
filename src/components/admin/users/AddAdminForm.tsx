"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, UserPlus, Search, Loader2,
  CheckCircle2, AlertCircle, X, ShieldCheck,
  Mail, Lock, User,
} from "lucide-react";
import Image from "next/image";

interface Member {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

type Tab = "search" | "create";

export default function AddAdminForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("search");

  // --- Search & Promote ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Member | null>(null);
  const [searching, setSearching] = useState(false);

  // --- Create new ---
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // --- Shared ---
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  /* ── Search members ─────────────────────────────── */
  const searchMembers = async (q: string) => {
    setQuery(q);
    setSelected(null);
    if (q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.users || []);
    } catch { setResults([]); }
    finally { setSearching(false); }
  };

  /* ── Promote existing member ─────────────────────── */
  const handlePromote = async () => {
    if (!selected) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch(`/api/admin/users/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      setMessage({ text: `มอบสิทธิ์ Admin ให้ ${selected.name} เรียบร้อย ระบบส่งอีเมลแจ้งเตือนแล้ว`, type: "success" });
      router.refresh();
      setTimeout(close, 3000);
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally { setLoading(false); }
  };

  /* ── Create new admin account ────────────────────── */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      setMessage({ text: "สร้างบัญชี Admin ใหม่เรียบร้อยแล้ว", type: "success" });
      setFormData({ name: "", email: "", password: "" });
      router.refresh();
      setTimeout(close, 2500);
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally { setLoading(false); }
  };

  /* ── Close / reset ───────────────────────────────── */
  const close = () => {
    setIsOpen(false);
    setTab("search");
    setQuery(""); setResults([]); setSelected(null);
    setFormData({ name: "", email: "", password: "" });
    setMessage({ text: "", type: "" });
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 active:scale-95"
      >
        <Plus size={15} strokeWidth={2.5} />
        เพิ่มผู้ดูแล
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[440px] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <UserPlus size={16} />
                </div>
                <div>
                  <h2 className="text-slate-800 text-sm font-bold leading-none">เพิ่มผู้ดูแลระบบ</h2>
                  <p className="text-slate-400 text-[11px] mt-1">เลือกสมาชิก หรือสร้างบัญชีใหม่</p>
                </div>
              </div>
              <button onClick={close} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {([ ["search", "เลือกจากสมาชิก"], ["create", "สร้างบัญชีใหม่"] ] as [Tab, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setTab(key); setMessage({ text: "", type: "" }); }}
                  className={`flex-1 py-3 text-xs font-semibold transition-all border-b-2 ${
                    tab === key
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
              {/* Message */}
              {message.text && (
                <div className={`flex items-start gap-2.5 p-3.5 rounded-lg border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {message.type === "success" ? <CheckCircle2 size={15} className="shrink-0 mt-0.5" /> : <AlertCircle size={15} className="shrink-0 mt-0.5" />}
                  <span className="text-[12px] font-medium leading-relaxed">{message.text}</span>
                </div>
              )}

              {/* ── Tab: Search & Promote ── */}
              {tab === "search" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-slate-600 text-xs font-semibold">ค้นหาสมาชิก</label>
                    <div className="relative">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="text"
                        placeholder="พิมพ์ชื่อ หรืออีเมล..."
                        value={query}
                        onChange={(e) => searchMembers(e.target.value)}
                        autoFocus
                        className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                      {searching && <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
                    </div>
                  </div>

                  {/* Dropdown results */}
                  {results.length > 0 && !selected && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 shadow-md">
                      {results.map((member) => (
                        <button
                          key={member._id}
                          onClick={() => { setSelected(member); setResults([]); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                            {member.image
                              ? <Image src={member.image} alt={member.name} width={32} height={32} className="object-cover" />
                              : <span className="text-white text-xs font-bold">{member.name.charAt(0).toUpperCase()}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-800 font-semibold text-sm leading-none truncate">{member.name}</p>
                            <p className="text-slate-400 text-[11px] mt-0.5 truncate">{member.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.length === 0 && query.length >= 2 && !searching && !selected && (
                    <p className="text-slate-400 text-xs text-center py-3">ไม่พบสมาชิกที่ตรงกัน</p>
                  )}

                  {/* Selected card */}
                  {selected && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                        {selected.image
                          ? <Image src={selected.image} alt={selected.name} width={40} height={40} className="object-cover" />
                          : <span className="text-white font-bold">{selected.name.charAt(0).toUpperCase()}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 font-semibold text-sm">{selected.name}</p>
                        <p className="text-slate-500 text-[11px] truncate">{selected.email}</p>
                      </div>
                      <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-700 transition-all">
                        <X size={13} />
                      </button>
                    </div>
                  )}

                  {/* Notice */}
                  {selected && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <ShieldCheck size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-amber-700 text-[11px] leading-relaxed">
                        ระบบจะส่งอีเมลแจ้งเตือนไปยัง <strong>{selected.email}</strong> และบังคับใช้ OTP ทุกครั้งที่ Login
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button onClick={close} className="flex-1 h-11 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-all">
                      ยกเลิก
                    </button>
                    <button
                      onClick={handlePromote}
                      disabled={!selected || loading}
                      className="flex-1 h-11 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-slate-900/10"
                    >
                      {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                      {loading ? "กำลังมอบสิทธิ์..." : "มอบสิทธิ์ Admin"}
                    </button>
                  </div>
                </>
              )}

              {/* ── Tab: Create New Admin ── */}
              {tab === "create" && (
                <form onSubmit={handleCreate} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-slate-600 text-xs font-semibold">ชื่อ-นามสกุล</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="text"
                        placeholder="เช่น สมชาย ใจดี"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-slate-600 text-xs font-semibold">อีเมล</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="email"
                        placeholder="admin@pdm3d.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-slate-600 text-xs font-semibold">รหัสผ่าน</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        type="password"
                        placeholder="ขั้นต่ำ 6 ตัวอักษร"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* OTP notice */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <ShieldCheck size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-amber-700 text-[11px] leading-relaxed">บัญชีใหม่จะต้องยืนยันตัวตนผ่าน OTP ทางอีเมลทุกครั้งที่ Login เข้าระบบ Admin</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={close} className="flex-1 h-11 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-all">
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-11 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-slate-900/10"
                    >
                      {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                      {loading ? "กำลังสร้าง..." : "สร้างบัญชี Admin"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
