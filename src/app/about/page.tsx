"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import Image from "next/image";
import Link from "next/link";
import {
    Upload,
    Target,
    Eye,
    Gem,
    CheckCircle2,
    Clock,
    Layers,
    MessageCircle,
    ShieldCheck,
    Award,
    Linkedin,
    ArrowRight,
    Users,
    Cpu,
    Zap,
    HeartHandshake,
} from "lucide-react";

// Mapping string names from DB to Lucide components
const IconMap: Record<string, any> = {
    Award, Users, Cpu, Zap, Target, Eye, Gem, CheckCircle2, Clock, Layers, MessageCircle, ShieldCheck
};

export default function AboutPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/about");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Failed to fetch about data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    const { hero, whoWeAre, mvv, whyUs, team, cta } = data || {};

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <Navbar />

            {/* ── 1. Hero ── */}
            <section className="relative min-h-[560px] flex items-center overflow-hidden bg-slate-900">
                {/* Background image */}
                <Image
                    src="/cover/coverabout.png"
                    alt="PrintMyDesign 3D Printing"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlay เบาๆ ด้านซ้าย ให้ข้อความอ่านง่าย */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
                    <div className="max-w-xl">
                        <span className="inline-block text-blue-300 font-bold text-xs tracking-[0.18em] uppercase mb-5">
                            {hero?.subtitle}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                            {hero?.title1}
                            <br />
                            <span className="text-blue-300">{hero?.titleHighlight}</span>
                            <br />
                            {hero?.title2}
                        </h1>
                        <p className="text-slate-200 text-base leading-relaxed mb-8">
                            {hero?.description}
                        </p>
                        <Link
                            href="/quote"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 active:scale-95"
                        >
                            <Upload className="w-4 h-4" />
                            อัปโหลดไฟล์ STL เพื่อประเมินราคา
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 2. Who We Are ── */}
            <section className="bg-white py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                    {/* Left text */}
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">
                            {whoWeAre?.title}
                        </h2>
                        <div className="w-10 h-1 bg-blue-600 rounded-full mb-6" />
                        <p className="text-slate-500 leading-relaxed mb-6 whitespace-pre-wrap">
                            {whoWeAre?.description}
                        </p>

                        {/* Stats row */}
                        <div className="grid grid-cols-4 gap-4 mt-8">
                            {whoWeAre?.stats?.map((s: any) => {
                                const Icon = IconMap[s.icon] || Award;
                                return (
                                    <div key={s.label} className="flex flex-col items-center text-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700 leading-tight">{s.label}</span>
                                        <span className="text-[11px] text-blue-600 font-black">{s.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="relative h-[360px] rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src="/about/office.png"
                            alt="PrintMyDesign Office"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* ── 3. Mission Vision Values ── */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        พันธกิจ วิสัยทัศน์ และค่านิยมของเรา
                    </h2>
                    <div className="w-10 h-1 bg-blue-600 rounded-full mb-10" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mvv?.map((item: any) => {
                            const Icon = IconMap[item.icon] || Target;
                            return (
                                <div
                                    key={item.title}
                                    className={`bg-white border ${item.border} rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow`}
                                >
                                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-5`}>
                                        <Icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-base mb-3">{item.title}</h3>
                                    {item.desc ? (
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {item.items?.map((val: string) => (
                                                <li key={val} className="flex items-center gap-2 text-sm text-slate-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                                                    {val}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 4. Why Choose Us ── */}
            <section className="bg-white py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">ทำไมลูกค้าถึงเลือกเรา</h2>
                    <div className="w-10 h-1 bg-blue-600 rounded-full mb-10" />

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {whyUs?.map((item: any) => {
                            const Icon = IconMap[item.icon] || CheckCircle2;
                            return (
                                <div
                                    key={item.title}
                                    className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center group"
                                >
                                    <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${item.color}`} />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-sm mb-2">{item.title}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. Team ── */}
            <section className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    {/* Header — centered */}
                    <div className="text-center mb-8">
                        <span className="inline-block text-blue-600 font-bold text-xs tracking-[0.18em] uppercase mb-4">
                            Our Team
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">ทีมงานของเรา</h2>
                        <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-3" />
                        <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
                            ทีมผู้เชี่ยวชาญด้านการพิมพ์ 3 มิติ การออกแบบ และวิศวกรรม
                            พร้อมดูแลทุกโปรเจกต์ของคุณตั้งแต่ต้นจนจบ
                        </p>
                    </div>

                    {/* Team cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {team?.map((member: any, idx: number) => (
                            <div
                                key={member.name}
                                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Photo */}
                                <div className="relative aspect-[3/4] w-full">
                                    <Image
                                        src={member.img}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Gradient overlay bottom */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                                    {/* Number badge */}
                                    <div className="absolute top-4 left-4 w-8 h-8 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-lg">
                                        {String(idx + 1).padStart(2, "0")}
                                    </div>

                                    {/* Info at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <p className="font-black text-white text-base leading-tight">{member.name}</p>
                                        <p className="text-blue-300 text-xs mt-1 font-medium">{member.role}</p>

                                        {/* LinkedIn — shows on hover */}
                                        <div className="mt-3 flex items-center gap-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <button className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-md">
                                                <Linkedin className="w-4 h-4 text-white" />
                                            </button>
                                            <span className="text-xs text-slate-300 font-medium">LinkedIn Profile</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── 6. CTA ── */}
            <section className="relative overflow-hidden" style={{ minHeight: "200px" }}>
                {/* Background image */}
                <Image
                    src="/cover/coverptojext.png"
                    alt="3D Printed Objects"
                    fill
                    className="object-cover object-left-center"
                />
                {/* Overlay เฉพาะฝั่งขวา ให้อ่านข้อความง่าย */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-950/60 to-blue-950/80" />

                {/* Content — ชิดขวา */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 flex justify-end">
                    <div className="max-w-lg text-right">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                            {cta?.title}
                        </h2>
                        <p className="text-blue-200 text-sm mb-7">
                            {cta?.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-end gap-3">
                            <Link
                                href="/quote"
                                className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg active:scale-95"
                            >
                                <Upload className="w-4 h-4" />
                                อัปโหลดไฟล์ STL
                            </Link>
                            <Link
                                href="/support/contact"
                                className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
                            >
                                ติดต่อสอบถามเพิ่มเติม
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
