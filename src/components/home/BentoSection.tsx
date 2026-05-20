"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Palette, Cpu } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function BentoSection() {
    const { t } = useLanguage();

    return (
        <section className="bg-white py-32 px-4 font-sans relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                            <Zap size={14} className="fill-blue-600" />
                            {t.bento.badge}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                            {t.bento.heading1}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                {t.bento.heading2}
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    
                    {/* Card 1: Industrial Grade (Large) */}
                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-[60%] h-full md:w-[50%] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-x-2">
                            <Image src="/showcase/metal.png" alt="Metal Print" fill className="object-cover md:object-contain object-right mix-blend-multiply opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/20 to-transparent" />
                        </div>
                        <div className="relative z-10 p-10 flex flex-col h-full justify-center w-full md:w-[60%]">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <Cpu size={24} strokeWidth={2.5}/>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3">
                                {t.bento.card1Title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
                                {t.bento.card1Desc}
                            </p>
                            <Link href="/quote" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 w-fit group/btn">
                                {t.bento.card1Cta} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Instant Quote (Small) */}
                    <div className="relative rounded-3xl overflow-hidden bg-blue-600 text-white group hover:shadow-2xl hover:shadow-blue-600/20 transition-all duration-500 flex flex-col justify-between">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700 opacity-50" />
                        {/* Giant faded icon in background */}
                        <div className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-110 group-hover:text-white/10 transition-all duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 16 4-4 4 4"/></svg>
                        </div>
                        <div className="relative p-8 z-10">
                            <h3 className="text-2xl font-black leading-tight mb-3">
                                {t.bento.card2Title}
                            </h3>
                            <p className="text-blue-100 text-sm font-medium leading-relaxed">
                                {t.bento.card2Desc}
                            </p>
                        </div>
                        <div className="relative px-8 pb-8 z-10 w-full mt-auto">
                            <Link href="/quote" className="w-full inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold text-sm py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/50">
                                {t.bento.card2Cta}
                            </Link>
                        </div>
                    </div>

                    {/* Card 3: Variety of Colors (Small) */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white to-rose-50/50 border border-slate-200 group hover:border-rose-200 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-500 flex flex-col justify-center">
                        <div className="absolute -top-6 -right-6 text-rose-500/5 group-hover:scale-110 group-hover:text-rose-500/10 transition-all duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                        </div>
                        <div className="relative p-8 z-10 flex flex-col items-start h-full justify-between">
                            <div className="w-14 h-14 bg-white shadow-sm border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-8 group-hover:scale-110 transition-transform">
                                <Palette size={28} strokeWidth={2.5}/>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3">
                                    {t.bento.card3Title}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    {t.bento.card3Desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: High Quality (Large) */}
                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 group hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-900/50 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-[55%] h-full opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700">
                            <Image src="/showcase/sls.png" alt="SLS Nylon" fill className="object-cover md:object-contain object-right" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
                        </div>
                        
                        <div className="relative z-10 p-10 flex flex-col h-full justify-center w-full md:w-[65%]">
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24} strokeWidth={2.5}/>
                            </div>
                            <h3 className="text-2xl font-black text-white leading-tight mb-3">
                                {t.bento.card4Title}
                            </h3>
                            <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-sm">
                                {t.bento.card4Desc}
                            </p>
                            <Link href="/quote" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-400 w-fit group/btn transition-colors">
                                {t.bento.card4Cta} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
