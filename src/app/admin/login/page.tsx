"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, AlertCircle, Loader2, ArrowRight, KeyRound, RotateCcw, Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ไม่สามารถส่ง OTP ได้");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", { redirect: false, email, password, otp });
      if (res?.error) {
        setError(res.error === "OTP_REQUIRED" ? "โปรดระบุรหัส OTP" : res.error);
        return;
      }
      if (res?.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* ── Left Panel (Brand) ─────────────────────── */}
      <div className="hidden lg:flex flex-col w-[52%] bg-[#060912] relative overflow-hidden p-16">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Blue glow orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none" style={{ background: "rgba(37,99,235,0.18)" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none" style={{ background: "rgba(99,102,241,0.14)" }} />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo/PDM_Logo_Icon_40x40px.svg" alt="PDM Logo" width={36} height={36} className="rounded-lg" />
            <span className="text-white font-bold text-sm tracking-wide">PDM Admin</span>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-[10px] font-semibold uppercase tracking-widest">Secure Admin Portal</span>
            </div>

            <h1 className="text-white text-5xl font-bold leading-[1.1] tracking-tight mb-6">
              Manage<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Everything
              </span>
              <br />from here.
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-sm">
              ศูนย์กลางการจัดการ PDM 3D Print Thailand — ออเดอร์, ลูกค้า, ใบเสนอราคา และการตั้งค่าระบบทั้งหมด
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mt-12 pt-10 border-t border-white/5">
              {[
                { label: "ระบบออนไลน์", value: "99.9%" },
                { label: "ความปลอดภัย", value: "2FA" },
                { label: "การเข้ารหัส", value: "TLS" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-white font-bold text-xl">{s.value}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-slate-700 text-xs">© 2026 PDM Thailand. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right Panel (Form) ──────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Image src="/logo/PDM_Logo_Icon_40x40px.svg" alt="PDM Logo" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-slate-800 text-sm">PDM Admin</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {s}
                </div>
                {s < 2 && <div className={`w-12 h-px transition-all ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />}
              </div>
            ))}
            <span className="ml-1 text-slate-400 text-xs">
              {step === 1 ? "ข้อมูลผู้ดูแล" : "ยืนยัน OTP"}
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-slate-900 text-2xl font-bold tracking-tight">
              {step === 1 ? "เข้าสู่ระบบ" : "ยืนยันตัวตน"}
            </h2>
            <p className="text-slate-400 text-sm mt-1.5">
              {step === 1
                ? "กรุณากรอกข้อมูลผู้ดูแลระบบ PDM"
                : `โค้ด 6 หลักถูกส่งไปยัง ${email}`}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 mb-6">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* ── Step 1: Login form ── */}
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-semibold">อีเมลผู้ดูแล</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email"
                    placeholder="admin@pdm3d.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-semibold">รหัสผ่าน</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-blue-600/20 mt-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> กำลังตรวจสอบ...</>
                ) : (
                  <>ถัดไป <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          ) : (
            /* ── Step 2: OTP form ── */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-slate-600 text-xs font-semibold">รหัส OTP 6 หลัก</label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    autoFocus
                    className="w-full h-14 pl-10 rounded-xl border border-slate-200 text-slate-800 text-xl font-bold tracking-[0.4em] placeholder:text-slate-200 placeholder:tracking-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> กำลังยืนยัน...</>
                ) : (
                  <><Shield size={16} /> ยืนยันการเข้าสู่ระบบ</>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setOtp(""); setError(""); }}
                className="w-full text-slate-400 hover:text-slate-700 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw size={13} /> ย้อนกลับ
              </button>
            </form>
          )}

          {/* Back to site */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <a href="/login" className="text-slate-400 hover:text-blue-600 text-xs transition-colors">
              ← กลับสู่หน้าหลัก
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
