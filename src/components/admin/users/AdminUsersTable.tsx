"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck, ShieldOff, Search, RefreshCw, Mail, AlertCircle, CheckCircle2, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  provider: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Props {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

function ProviderIcon({ provider }: { provider: string }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border";
  if (provider === "google") return (
    <div className={`${base} bg-white border-slate-200`} title="Google">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    </div>
  );
  if (provider === "facebook") return (
    <div className={`${base} bg-[#1877F2] border-[#1877F2]`} title="Facebook">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </div>
  );
  if (provider === "line") return (
    <div className={`${base} bg-[#06C755] border-[#06C755]`} title="LINE">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
    </div>
  );
  // credentials / email
  return (
    <div className={`${base} bg-slate-100 border-slate-200`} title="อีเมล">
      <Mail size={14} className="text-slate-500" />
    </div>
  );
}

export default function AdminUsersTable({ users, total, page, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [verifyModal, setVerifyModal] = useState<{isOpen: boolean, userId: string | null}>({isOpen: false, userId: null});

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    startTransition(() => { router.push(`${pathname}?${params.toString()}`); });
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    setTogglingId(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: currentRole === "admin" ? "user" : "admin" }),
      });
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  };

  const toggleVerify = (userId: string) => {
    setVerifyModal({ isOpen: true, userId });
  };

  const confirmVerifyUser = async () => {
    const userId = verifyModal.userId;
    if (!userId) return;

    setTogglingId(userId + "_verify");
    setVerifyModal({ isOpen: false, userId: null });
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify" }),
      });
      if (!res.ok) throw new Error("ไม่สามารถยืนยันผู้ใช้ได้");
      toast.success("ยืนยันตัวตนสำเร็จ");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = search.trim()
    ? users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-4">
      {/* Search + count bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-5 py-3.5 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรืออีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 bg-slate-50 focus:bg-white transition-all"
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
            <RefreshCw size={20} className="animate-spin text-blue-400" />
            <p className="text-xs">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">สมาชิก</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest text-center">ช่องทาง</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest text-center">สถานะ</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest text-center">ตำแหน่ง</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">วันที่สมัคร</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => {
                  return (
                    <tr key={user._id} className="hover:bg-slate-50/60 transition-colors group">

                      {/* User info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                            {user.image ? (
                              <Image src={user.image} alt={user.name} width={36} height={36} className="object-cover w-full h-full" />
                            ) : (
                              <span className="text-white text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-800 font-semibold text-sm leading-none group-hover:text-blue-600 transition-colors">{user.name}</p>
                            <p className="text-slate-400 text-[11px] mt-1 truncate max-w-[200px]">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Provider */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <ProviderIcon provider={user.provider} />
                        </div>
                      </td>

                      {/* Verified */}
                      <td className="px-6 py-4 text-center">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border text-emerald-600 bg-emerald-50 border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ยืนยันแล้ว
                          </span>
                        ) : (
                          <button 
                            onClick={() => toggleVerify(user._id)}
                            disabled={togglingId === user._id + "_verify"}
                            className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-slate-400 bg-slate-50 border-slate-200"
                            title="คลิกเพื่อยืนยันตัวตน (Manual Verify)"
                          >
                            {togglingId === user._id + "_verify" ? (
                              <RefreshCw size={10} className="animate-spin text-emerald-500" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-400" />
                            )}
                            รอยืนยัน
                          </button>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          user.role === "admin"
                            ? "text-blue-600 bg-blue-50 border-blue-200"
                            : "text-slate-400 bg-slate-50 border-slate-200"
                        }`}>
                          {user.role === "admin" ? "Admin" : "Member"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <span className="text-slate-500 text-[11px]">
                          {new Date(user.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/users/${user._id}`}
                            title="ดูข้อมูลส่วนบุคคลและสถิติ"
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-white text-slate-400 border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300"
                          >
                            <ExternalLink size={13} />
                          </Link>
                          
                          <button
                            onClick={() => toggleRole(user._id, user.role)}
                            disabled={togglingId === user._id}
                            title={user.role === "admin" ? "ลด Role เป็น Member" : "เลื่อนขึ้นเป็น Admin"}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 border ${
                              user.role === "admin"
                                ? "bg-slate-900 text-white border-slate-900 hover:bg-red-600 hover:border-red-600"
                                : "bg-white text-slate-400 border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                            }`}
                          >
                            {togglingId === user._id
                              ? <RefreshCw size={13} className="animate-spin" />
                              : user.role === "admin" ? <ShieldCheck size={13} /> : <ShieldOff size={13} />
                            }
                          </button>
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

      {/* Modern Verify Confirm Modal */}
      {verifyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setVerifyModal({isOpen: false, userId: null})} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-4 right-4">
              <button onClick={() => setVerifyModal({isOpen: false, userId: null})} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
                 <X size={16} />
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
               <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-emerald-100">
                 <CheckCircle2 size={32} className="text-emerald-500" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-lg font-bold text-slate-800">ยืนยันการตั้งค่าผู้ใช้</h3>
                 <p className="text-sm text-slate-500">ต้องการ<span className="font-semibold text-emerald-600 px-1">อนุมัติและยืนยันตัวตน</span>ให้ผู้ใช้คนนี้เข้าสู่ระบบแบบแมนนวลใช่หรือไม่?</p>
               </div>
               <div className="pt-4 flex items-center gap-3">
                 <button onClick={() => setVerifyModal({isOpen: false, userId: null})} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                    ยกเลิก
                 </button>
                 <button onClick={confirmVerifyUser} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20">
                    ยืนยันตัวตน
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
