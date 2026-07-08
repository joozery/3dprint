import type { Metadata } from "next";
import Image from "next/image";
import { Wrench, Printer, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "กำลังปรับปรุงระบบ | Print My Design",
  description: "Print My Design กำลังเร่งพัฒนาเว็บไซต์ให้ดีกว่าเดิม อีกไม่นานจะกลับมาเปิดให้บริการเต็มรูปแบบ",
  robots: { index: false, follow: false },
};

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center px-6">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(37, 99, 235, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 99, 235, 0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Soft glows */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full text-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/logo/logo.png"
            alt="Print My Design"
            width={160}
            height={54}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {/* Printer icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
              <Printer size={44} className="animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white border border-blue-100 shadow-lg flex items-center justify-center text-blue-600">
              <Wrench size={18} className="animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
          <Clock size={13} />
          กำลังปรับปรุงระบบ
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
          เรากำลังพิมพ์เว็บไซต์ใหม่อยู่
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto mb-10">
          <span className="text-blue-600 font-bold">Print My Design</span>{" "}
          กำลังเร่งพัฒนาเว็บไซต์ให้ดีกว่าเดิม อีกไม่นานจะกลับมาเปิดให้บริการเต็มรูปแบบ
          ขอบคุณที่รอนะครับ
        </p>

        {/* Printing progress bar */}
        <div className="max-w-sm mx-auto">
          <div className="h-2.5 rounded-full bg-blue-100 overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <span>Printing...</span>
            <span className="text-blue-600">Coming Soon</span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-14 text-slate-400 text-xs font-medium">
          © {new Date().getFullYear()} Print My Design — 3D Printing Platform
        </p>
      </div>
    </main>
  );
}
