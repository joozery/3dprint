"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [tab, setTab] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">

            {/* ── Full-screen Background Image ── */}
            <div className="absolute inset-0">
                <Image
                    src="/3dprinter.png"
                    alt="3D Print Background"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* overlay บางๆ ให้ฟอร์มด้านขวาอ่านง่ายขึ้น */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/60" />
            </div>

            {/* ── Logo top-left ── */}
            <div className="absolute top-6 left-8 z-10">
                <Link href="/">
                    <Image src="/logo/3dev.png" alt="3DEV" width={80} height={32} className="object-contain" />
                </Link>
            </div>

            {/* ── Main Layout ── */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-12 gap-8 items-center min-h-screen">

                {/* Left: ว่างให้ภาพพื้นหลังแสดงผลเต็มๆ */}
                <div className="col-span-12 lg:col-span-6 hidden lg:block" />

                {/* Right: Login Card */}
                <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-end py-8">
                    <div className="w-full max-w-[400px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-200/50 border border-white/60 overflow-hidden">

                        {/* Tab Header */}
                        <div className="flex border-b border-slate-100">
                            {(["login", "register"] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={cn(
                                        "flex-1 py-5 text-sm font-black uppercase tracking-widest transition-all",
                                        tab === t
                                            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {t === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 space-y-5">
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Name (Register only) */}
                                {tab === "register" && (
                                    <div className="group">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">ชื่อ-นามสกุล *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="ชื่อของคุณ"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">อีเมล *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">รหัสผ่าน *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input
                                            type={showPass ? "text" : "password"}
                                            placeholder="รหัสผ่านของคุณ"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-9 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember / Forgot */}
                                {tab === "login" && (
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div
                                                onClick={() => setRemember(!remember)}
                                                className={cn(
                                                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                                                    remember ? "bg-blue-600 border-blue-600" : "border-slate-300"
                                                )}
                                            >
                                                {remember && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">จดจำฉัน</span>
                                        </label>
                                        <Link href="/forgot-password" className="text-xs text-blue-600 font-bold hover:underline">
                                            ลืมรหัสผ่าน?
                                        </Link>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={cn(
                                        "w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wider transition-all shadow-lg shadow-blue-200",
                                        loading
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                                    )}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            กำลังโหลด...
                                        </span>
                                    ) : tab === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-xs text-slate-400 font-medium">หรือ</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {/* Google Sign In */}
                            <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-bold text-slate-700 shadow-sm hover:shadow-md active:scale-[0.98]">
                                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                เข้าสู่ระบบด้วย Google
                            </button>

                            {/* Terms */}
                            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                                การเข้าสู่ระบบถือว่าคุณยอมรับ
                                <Link href="/terms" className="text-blue-500 hover:underline mx-1">เงื่อนไขการใช้งาน</Link>
                                และ
                                <Link href="/privacy" className="text-blue-500 hover:underline ml-1">นโยบายความเป็นส่วนตัว</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating animation keyframes */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-16px); }
                }
            `}</style>
        </div>
    );
}
