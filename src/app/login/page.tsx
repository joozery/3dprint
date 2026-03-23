"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [view, setView] = useState<"login" | "register" | "forgot">("login");
    
    // form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (view === "register") {
                if (password !== confirmPassword) {
                    toast.error("รหัสผ่านไม่ตรงกัน โปรดตรวจสอบอีกครั้ง");
                    setLoading(false);
                    return;
                }

                // Call /api/auth/register
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();
                
                if (!res.ok) {
                    toast.error(data.message || "สมัครสมาชิกไม่สำเร็จ");
                    setLoading(false);
                    return;
                }

                toast.success("สมัครสมาชิกสำเร็จ กำลังเข้าสู่ระบบ...");
                
                // Auto Sign-In after register
                const signInRes = await signIn("credentials", {
                    redirect: false,
                    email,
                    password
                });

                if (signInRes?.ok) {
                    router.push("/");
                    router.refresh();
                }

            } else if (view === "login") {
                // Call NextAuth Sign-In
                const res = await signIn("credentials", {
                    redirect: false,
                    email,
                    password
                });

                if (res?.error) {
                    toast.error(res.error);
                } else if (res?.ok) {
                    toast.success("เข้าสู่ระบบเรียบร้อยแล้ว");
                    router.push("/");
                    router.refresh();
                }

            } else if (view === "forgot") {
                // Feature Mock-up for forgot password
                setTimeout(() => {
                    toast.success(`ลิงก์รีเซ็ตรหัสผ่านได้ส่งไปยังอีเมล ${email} แล้ว โปรดตรวจสอบกล่องข้อความของคุณ`);
                    setView("login");
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        } finally {
            if (view !== "forgot") {
                setLoading(false);
            } else {
                setTimeout(() => setLoading(false), 1500);
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">

            {/* ── Left Panel (Branding / Image) ── */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between p-12 bg-slate-900 border-r border-slate-200 shadow-2xl">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/login-bg.png"
                        alt="3D Print Background"
                        fill
                        className="object-cover object-right opacity-60 mix-blend-luminosity"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />
                </div>

                {/* Logo Top Left */}
                <div className="relative z-10">
                    <Link href="/" className="inline-block transition-transform hover:scale-105">
                        <Image src="/logo/3devwhite.png" alt="3DEV Logo" width={130} height={40} className="object-contain drop-shadow-xl" />
                    </Link>
                </div>

                {/* Bottom Left Content */}
                <div className="relative z-10 pb-8">
                    <div className="w-16 h-1.5 bg-blue-500 mb-8 rounded-full shadow-lg shadow-blue-500/50" />
                    <h1 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.2] drop-shadow-md">
                        แพลตฟอร์มสั่งพิมพ์ 3 มิติ<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            ระดับอุตสาหกรรม
                        </span>
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-lg mb-8 font-medium">
                        ยกระดับกระบวนการผลิตของคุณด้วยแพลตฟอร์มอัจฉริยะ อัปโหลดไฟล์ประเมินราคาแบบเรียลไทม์ และสั่งพิมพ์งานคุณภาพสูงได้ตลอด 24 ชั่วโมง
                    </p>
                    {/* Trust Badge */}
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl w-fit border border-white/10">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-400 flex items-center justify-center text-[10px] text-white font-bold bg-[url('https://i.pravatar.cc/100?img=1')] bg-cover" />
                            <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-400 flex items-center justify-center text-[10px] text-white font-bold bg-[url('https://i.pravatar.cc/100?img=2')] bg-cover" />
                            <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-400 flex items-center justify-center text-[10px] text-white font-bold bg-[url('https://i.pravatar.cc/100?img=3')] bg-cover" />
                            <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-blue-600 flex items-center justify-center text-xs text-white font-bold z-10">+500</div>
                        </div>
                        <div className="text-sm font-medium text-slate-200">
                            องค์กรชั้นนำไว้วางใจ
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Panel (Auth Form) ── */}
            <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col pt-8 pb-12 px-6 sm:px-12 md:px-20 lg:px-24 justify-center relative bg-white">
                
                {/* Mobile Logo */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/">
                        <Image src="/logo/3dev.png" alt="3DEV Logo" width={110} height={32} className="object-contain" />
                    </Link>
                </div>

                <div className="w-full max-w-[440px] mx-auto">
                    
                    {/* --- Forgot Password View --- */}
                    {view === "forgot" ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button 
                                onClick={() => setView("login")}
                                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> กลับไปเข้าสู่ระบบ
                            </button>
                            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">ลืมรหัสผ่าน?</h2>
                            <p className="text-base text-slate-500 mb-10 leading-relaxed">
                                ไม่ต้องกังวล กรุณากรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณ
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block mb-2">อีเมล <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pl-12 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 mt-4 rounded-xl text-white text-base font-bold transition-all bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-xl shadow-blue-600/20 flex items-center justify-center"
                                >
                                    {loading ? <span className="animate-pulse">กำลังส่งข้อมูล...</span> : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* --- Login / Register View --- */
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                                    ยินดีต้อนรับสู่ <span className="text-blue-600">3DEV</span>
                                </h2>
                                <p className="text-base text-slate-500">
                                    จัดการงานพิมพ์ 3 มิติของคุณได้ในที่เดียว
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50">
                                <button
                                    onClick={() => setView("login")}
                                    className={cn(
                                        "flex-1 py-3 text-sm font-bold transition-all rounded-lg",
                                        view === "login" ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    )}
                                >
                                    เข้าสู่ระบบ
                                </button>
                                <button
                                    onClick={() => setView("register")}
                                    className={cn(
                                        "flex-1 py-3 text-sm font-bold transition-all rounded-lg",
                                        view === "register" ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    )}
                                >
                                    สมัครสมาชิก
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                
                                {/* Name Field (Register Only) */}
                                {view === "register" && (
                                    <div className="animate-in fade-in zoom-in-95 duration-300">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block mb-2">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="ชื่อของคุณ"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                required
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pl-12 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm focus:shadow-md"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block mb-2">อีเมล <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pl-12 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm focus:shadow-md"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block mb-2">รหัสผ่าน <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showPass ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            autoComplete={view === "login" ? "current-password" : "new-password"}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pl-12 pr-12 text-base text-slate-900 placeholder:text-slate-400 tracking-widest focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm focus:shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-3.5 text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password (Register Only) */}
                                {view === "register" && (
                                    <div className="animate-in fade-in zoom-in-95 duration-300">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block mb-2">ยืนยันรหัสผ่าน <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPass ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                required
                                                autoComplete="new-password"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pl-12 pr-12 text-base text-slate-900 placeholder:text-slate-400 tracking-widest focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm focus:shadow-md"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Auto Actions / Forgot Pass (Login Only) */}
                                {view === "login" && (
                                    <div className="flex items-center justify-between pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={cn(
                                                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                remember ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300 group-hover:border-blue-400"
                                            )}>
                                                {remember && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span className="text-sm text-slate-600 font-medium select-none">จดจำฉันหน้าเครื่องนี้</span>
                                            <input type="checkbox" className="hidden" checked={remember} onChange={() => setRemember(!remember)} />
                                        </label>
                                        <button 
                                            type="button" 
                                            onClick={() => setView("forgot")} 
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            ลืมรหัสผ่าน?
                                        </button>
                                    </div>
                                )}

                                {/* Main Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={cn(
                                        "w-full py-4 mt-4 rounded-xl text-white text-base font-bold transition-all shadow-xl flex items-center justify-center gap-2",
                                        loading
                                            ? "bg-slate-400 cursor-not-allowed shadow-none"
                                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-600/20"
                                    )}
                                >
                                    {loading ? (
                                        <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> กำลังเข้าสู่ระบบ...</>
                                    ) : (
                                        <>{view === "login" ? "เข้าสู่ระบบ" : "สมัครใช้งาน"} <ArrowRight className="w-5 h-5" /></>
                                    )}
                                </button>
                            </form>

                            {/* --- SSO Social Logins --- */}
                            <div className="pt-6">
                                <div className="relative flex items-center mb-6">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                        หรือเชื่อมต่อผ่าน
                                    </span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {/* Google */}
                                    <button onClick={() => signIn("google", { callbackUrl: "/" })} type="button" className="flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm active:scale-95 group">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    </button>
                                    
                                    {/* Facebook */}
                                    <button onClick={() => signIn("facebook", { callbackUrl: "/" })} type="button" className="flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-100 bg-white hover:bg-[#1877F2]/5 hover:border-[#1877F2]/30 transition-all shadow-sm active:scale-95 group">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1877F2] transition-transform group-hover:scale-110" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </button>

                                    {/* LINE */}
                                    <button onClick={() => signIn("line", { callbackUrl: "/" })} type="button" className="flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-100 bg-white hover:bg-[#00C300]/5 hover:border-[#00C300]/30 transition-all shadow-sm active:scale-95 group">
                                        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#00C300] transition-transform group-hover:scale-110" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.969 8.911 9.421 9.611.369.079.873.242 1 .554.116.284.075.727.036 1.026l-.234 1.407c-.031.189-.142.697.607.382.748-.313 4.027-2.373 5.483-4.045 2.378-2.529 3.687-5.111 3.687-8.935z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <p className="text-sm text-slate-500 text-center leading-relaxed mt-8">
                                การเข้าสู่ระบบถือว่าคุณยอมรับ<br className="sm:hidden"/>
                                <Link href="/terms" className="font-bold text-slate-700 hover:text-blue-600 hover:underline mx-1 transition-colors">เงื่อนไขการใช้งาน</Link>
                                และ
                                <Link href="/privacy" className="font-bold text-slate-700 hover:text-blue-600 hover:underline ml-1 transition-colors">นโยบายความเป็นส่วนตัว</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
