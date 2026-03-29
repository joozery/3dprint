"use client";

import { useState, useEffect } from "react";
import { Cookie, X, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or denied cookies
    const consent = localStorage.getItem("cookie-consent-accepted");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsDismissing(true);
    localStorage.setItem("cookie-consent-accepted", "true");
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  const handleDecline = () => {
    setIsDismissing(true);
    localStorage.setItem("cookie-consent-accepted", "false");
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] max-w-5xl w-[95%] p-0 mx-auto",
        isDismissing ? "animate-out fade-out slide-out-to-bottom-10 duration-500" : "animate-in fade-in slide-in-from-bottom-10 duration-700"
      )}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-4 md:p-5 ring-1 ring-slate-900/5 rounded-none">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Icon Section (Sharp Edges) */}
          <div className="hidden sm:flex w-10 h-10 rounded-none bg-slate-50 items-center justify-center shrink-0 border border-slate-100">
            <Cookie className="w-5 h-5 text-slate-900 animate-bounce-subtle" />
          </div>

          {/* Text Section Area */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-[12px] font-black text-slate-900 tracking-[0.2em] flex items-center justify-center md:justify-start gap-3 mb-1 uppercase">
              DATA PRIVACY & COOKIES
              <span className="inline-block w-8 h-[2px] bg-slate-900"></span>
            </h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed tracking-tight">
              เว็บไซต์ของเราใช้คุกกี้เพื่อวิเคราะห์การเข้าใช้งานและเพิ่มความปลอดภัย 
              <span className="text-slate-400 font-normal"> หากคุณใช้งานต่อถือว่ายอมรับเบื้องต้น อ่านเพิ่มเติมที่ </span>
              <a href="/cookies" className="text-slate-900 font-black hover:text-blue-600 underline underline-offset-4 decoration-slate-200 transition-colors">นโยบายคุกกี้</a>
            </p>
          </div>

          {/* Buttons Group (Sharp Style) */}
          <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 mt-2 md:mt-0">
            <Button
              variant="ghost"
              onClick={handleDecline}
              className="rounded-none text-slate-400 font-bold text-[10px] h-11 px-6 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 uppercase tracking-widest whitespace-nowrap transition-all"
            >
              ตั้งค่า
            </Button>
            <Button
              onClick={handleAccept}
              className="group relative overflow-hidden rounded-none bg-slate-900 hover:bg-black text-white font-bold text-[10px] h-11 px-10 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] uppercase tracking-widest whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ยอมรับทั้งหมด
              </span>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Button>
            
            {/* Minimal Close */}
            <button 
              onClick={handleDecline}
              className="hidden lg:flex text-slate-300 hover:text-slate-900 transition-colors p-2 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
