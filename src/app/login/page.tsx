"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, ArrowRight, ShieldCheck, RefreshCw, ChevronLeft } from "lucide-react";
import EmailCheckModal from "@/components/auth/EmailCheckModal";

export default function LoginPage() {
    const router = useRouter();
    const [view, setView] = useState<"login" | "register" | "forgot" | "otp" | "forgot-otp" | "reset-password">("login");
    
    // form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    
    // UI states
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Timer for Resend OTP
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน โปรดตรวจสอบอีกครั้ง");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "เกิดข้อผิดพลาด");
                setLoading(false);
                return;
            }

            toast.success("ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว");
            setView("otp");
            setTimer(60);
        } catch (error) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("ยืนยันตัวตนสำเร็จ! กำลังเข้าสู่ระบบ...");
                
                // ให้เวลา DB อัปเดตสถานะ verified ให้เรียบร้อย 2 วินาที
                setTimeout(async () => {
                    const resSignIn = await signIn("credentials", {
                        redirect: false,
                        email,
                        password
                    });

                    if (resSignIn?.ok) {
                        toast.success("เข้าสู่ระบบเรียบร้อย");
                        router.push("/");
                        // ใช้ window.location.href เพื่อให้หน้าแรกโหลดข้อมูลใหม่แน่นอน
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 500);
                    } else {
                        console.error("Auto Login Error:", resSignIn?.error);
                        toast.error("เข้าสู่ระบบอัตโนมัติไม่สำเร็จ (DB Sync Delay) โปรดลองกด 'เข้าสู่ระบบ' อีกครั้งด้วยตนเอง");
                        setView("login");
                    }
                    setLoading(false);
                }, 2000);
            } else {
                toast.error(data.message || "รหัส OTP ไม่ถูกต้อง");
                setLoading(false);
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyForgotOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 6) {
            setView("reset-password");
        } else {
            toast.error("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setView("forgot-otp");
                setTimer(60);
            } else {
                toast.error(data.message || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp, newPassword: password })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");
                setView("login");
                setPassword("");
                setConfirmPassword("");
                setOtp("");
            } else {
                toast.error(data.message || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (res?.error === "ACCOUNT_NOT_VERIFIED") {
                toast.warning("บัญชีของคุณยังไม่ได้ยืนยันตัวตน โปรดขอรหัส OTP ใหม่");
                // Trigger resend to go to OTP view
                handleResendOTP();
                setView("otp");
            } else if (res?.error) {
                toast.error(res.error);
            } else if (res?.ok) {
                toast.success("เข้าสู่ระบบเรียบร้อยแล้ว");
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (timer > 0) return;
        if (!email) {
            toast.error("ข้อมูลไม่ครบถ้วน โปรดลองทำรายการใหม่อีกครั้ง");
            setView("login");
            return;
        }
        setLoading(true);
        try {
            const endpoint = view === "forgot-otp" ? "/api/auth/forgot-password" : "/api/auth/register";
            const body = view === "forgot-otp" ? { email } : { name, email, password };
            
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                toast.success("ส่งรหัส OTP ใหม่เรียบร้อยแล้ว");
                setTimer(60);
            } else {
                const err = await res.json();
                toast.error(err.message || "ส่งไม่สำเร็จ");
            }
        } catch (error) {
            toast.error("การเชื่อมต่อล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F0F2F5] p-4 sm:p-6 font-sans items-center justify-center relative">
            
            {/* ── Modal: ขออีเมลเพิ่ม (สำหรับคนเข้าทางลัด LINE/SSO) ── */}
            <EmailCheckModal />

            <div className="w-full max-w-[900px] h-auto md:h-[600px] bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex overflow-hidden border border-white relative z-10">
                
                {/* ── Left Sidebar (Static Image) ── */}
                <div className="hidden md:flex w-[40%] relative">
                    <Image 
                        src="/industrial-bg.png" 
                        alt="3D Industrial" 
                        fill 
                        priority 
                        loading="eager"
                        sizes="(max-width: 768px) 0vw, 40vw"
                        className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 to-indigo-900/90 mix-blend-multiply" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                        <Link href="/" className="inline-block group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                <Image src="/logo/PDM_Logo_Icon_40x40px.svg" alt="PDM" width={32} height={32} />
                            </div>
                        </Link>
                        <div className="text-white">
                            <h2 className="text-2xl font-black mb-3">เข้าสู่โลก PDM</h2>
                            <p className="text-white/70 text-sm font-medium leading-relaxed">
                                ยกระดับงานพิมพ์ 3 มิติของคุณ <br/> ด้วยโซลูชันอัจฉริยะแบบครบวงจร
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Right Content Panel ── */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="w-full h-full overflow-y-auto pt-14 pb-14 px-8 lg:px-14 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="w-full max-w-[340px] mx-auto">
                            
                            {/* --- OTP Verification View --- */}
                            {view === "otp" || view === "forgot-otp" ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <button onClick={() => setView(view === "otp" ? "register" : "forgot")} className="mb-6 flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold">
                                        <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
                                    </button>
                                    <div className="mb-8 text-center md:text-left">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">ยืนยันรหัส OTP</h3>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                            เราได้ส่งรหัส 6 หลักไปที่ <span className="text-slate-900 font-bold">{email}</span> เพื่อความปลอดภัย โปรดระบุรหัสดังกล่าวเพื่อดำเนินการต่อ
                                        </p>
                                    </div>

                                    <form onSubmit={view === "otp" ? handleVerifyOTP : handleVerifyForgotOTP} className="space-y-6">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="0 0 0 0 0 0"
                                                value={otp}
                                                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-center text-3xl font-black tracking-[0.4em] text-blue-600 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading || otp.length < 6}
                                            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black tracking-wider shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-200 flex items-center justify-center gap-3"
                                        >
                                            {view === "otp" ? "ยืนยันตัวตน" : "ถัดไป"} <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center">
                                        <button 
                                            onClick={handleResendOTP}
                                            disabled={timer > 0 || loading}
                                            className="text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors disabled:text-slate-300 text-blue-600"
                                        >
                                            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                                            {timer > 0 ? `ขอรหัสใหม่ในอีก ${timer} วินาที` : "ส่งรหัสอีกครั้ง"}
                                        </button>
                                    </div>
                                </div>
                            ) : view === "forgot" ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <button onClick={() => setView("login")} className="mb-6 flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold">
                                        <ChevronLeft className="w-4 h-4" /> กลับสู่หน้าเข้าสู่ระบบ
                                    </button>
                                    <div className="mb-10 text-center md:text-left pt-2">
                                        <h3 className="text-3xl font-black text-slate-900 mb-2">ลืมรหัสผ่าน?</h3>
                                        <p className="text-slate-400 text-sm font-medium">ไม่เป็นไร! กรอกอีเมลของคุณด้านล่าง แล้วเราจะส่งรหัส OTP สำหรับตั้งรหัสผ่านใหม่ไปให้</p>
                                    </div>
                                    <form onSubmit={handleForgotPassword} className="space-y-5">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 ml-1">อีเมลแอดเดรส</label>
                                            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm" />
                                        </div>
                                        <button type="submit" disabled={loading || !email} className="w-full py-4 mt-2 rounded-[18px] bg-blue-600 text-white text-[13px] font-black tracking-[.15em] uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-300 flex items-center justify-center gap-2">
                                            {loading ? "กำลังส่ง..." : "ส่งรหัส OTP"}
                                            {!loading && <ArrowRight className="w-4 h-4" />}
                                        </button>
                                    </form>
                                </div>
                            ) : view === "reset-password" ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <button onClick={() => setView("forgot-otp")} className="mb-6 flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold">
                                        <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
                                    </button>
                                    <div className="mb-10 text-center md:text-left pt-2">
                                        <h3 className="text-3xl font-black text-slate-900 mb-2">ตั้งรหัสผ่านใหม่</h3>
                                        <p className="text-slate-400 text-sm font-medium">กรุณาตั้งรหัสผ่านใหม่ที่คุณจำได้ง่ายและปลอดภัย</p>
                                    </div>
                                    <form onSubmit={handleResetPassword} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 ml-1">รหัสผ่านใหม่</label>
                                            <div className="relative">
                                                <input type={showPass ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm" />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 ml-1">ยืนยันรหัสผ่านใหม่</label>
                                            <input type={showPass ? "text" : "password"} placeholder="••••••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm" />
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full py-4 mt-2 rounded-[18px] bg-blue-600 text-white text-[13px] font-black tracking-[.15em] uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-300 flex items-center justify-center gap-2">
                                            {loading ? "กำลังบันทึก..." : "รีเซ็ตรหัสผ่าน"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10 text-center md:text-left pt-2">
                                        <h3 className="text-3xl font-black text-slate-900 mb-2">
                                            {view === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium">
                                            {view === "login" ? "ดีใจที่พบคุณอีกครั้ง!" : "เริ่มต้นใช้งาน PDM ฟรีได้ตั้งแต่วันนี้"}
                                        </p>
                                    </div>

                                    <form onSubmit={view === "login" ? handleLogin : handleRegister} className="space-y-3">
                                        {view === "register" && (
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 ml-1">ชื่อ-นามสกุล</label>
                                                <input type="text" placeholder="ระบุชื่อจริงของคุณ" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-50 border-none rounded-xl px-5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm" />
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 ml-1">อีเมลแอดเดรส</label>
                                            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 border-none rounded-xl px-5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm" />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 ml-1">รหัสผ่าน</label>
                                            <div className="relative">
                                                <input type={showPass ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 border-none rounded-xl px-5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm" />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {view === "login" ? (
                                            <div className="flex justify-end pr-1">
                                                <button type="button" onClick={() => setView("forgot")} className="text-xs font-bold text-blue-600 hover:underline">ลืมรหัสผ่าน?</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 ml-1">ยืนยันรหัสผ่าน</label>
                                                <input type={showPass ? "text" : "password"} placeholder="••••••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-slate-50 border-none rounded-xl px-5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm" />
                                            </div>
                                        )}

                                        {view === "register" && (
                                            <div className="text-[11px] text-slate-500 font-medium px-1 text-center pb-2 pt-1">
                                                เมื่อดำเนินการต่อ ถือว่าคุณยอมรับ <Link href="/terms" className="text-blue-600 hover:underline font-bold">ข้อกำหนด</Link> และ <Link href="/privacy" className="text-blue-600 hover:underline font-bold">นโยบายความเป็นส่วนตัว</Link>
                                            </div>
                                        )}

                                        <button type="submit" disabled={loading} className="w-full py-4 mt-2 rounded-[18px] bg-blue-600 text-white text-[13px] font-black tracking-[.15em] uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-300 flex items-center justify-center gap-2">
                                            {loading ? "กำลังโหลด..." : (view === "login" ? "เข้าสู่ระบบ" : "สมัครใช้งาน")}
                                            {!loading && <ArrowRight className="w-4 h-4" />}
                                        </button>
                                    </form>

                                    <div className="mt-10">
                                        <div className="relative flex items-center mb-8">
                                            <div className="flex-grow border-t border-slate-100"></div>
                                            <span className="flex-shrink-0 mx-3 text-[10px] font-black uppercase tracking-widest text-slate-300">เข้าด้วยช่องทางอื่น</span>
                                            <div className="flex-grow border-t border-slate-100"></div>
                                        </div>
                                        <div className="flex justify-center gap-8 items-center">
                                            <button 
                                                onClick={() => signIn("google", { callbackUrl: "/" })} 
                                                className="hover:scale-110 transition-transform p-2 bg-white rounded-full border border-slate-100 shadow-sm"
                                            >
                                                <Image src="https://www.svgrepo.com/show/355037/google.svg" alt="G" width={24} height={24} />
                                            </button>
                                            
                                            <button 
                                                onClick={() => signIn("facebook", { callbackUrl: "/" })} 
                                                className="hover:scale-110 transition-transform p-2 bg-white rounded-full border border-slate-100 shadow-sm"
                                            >
                                                <Image src="https://www.svgrepo.com/show/448224/facebook.svg" alt="F" width={26} height={26} />
                                            </button>

                                            <button 
                                                onClick={() => signIn("line", { callbackUrl: "/" })} 
                                                className="hover:scale-110 transition-transform p-2 bg-white rounded-full border border-slate-100 shadow-sm"
                                            >
                                                <Image src="/loginscial/LINE_logo.svg.webp" alt="L" width={28} height={28} className="rounded-md" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-12 text-center text-[13px] font-medium text-slate-500">
                                        {view === "login" ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"} {" "}
                                        <button onClick={() => setView(view === "login" ? "register" : "login")} className="text-blue-600 font-black hover:underline ml-1">
                                            {view === "login" ? "สมัครเดี๋ยวนี้" : "เข้าสู่ระบบที่นี่"}
                                        </button>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
