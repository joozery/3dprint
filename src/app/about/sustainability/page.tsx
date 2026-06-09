"use client";

import Navbar from "@/components/layout/Navbar";
import { TreePine, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const stats = [
    { num: "100%", label: "PLA Bio-based", sub: "วัสดุหลักผลิตจากพืช", color: "bg-green-50 border-green-200 text-green-700" },
    { num: "80%", label: "Waste Recycling", sub: "เศษวัสดุนำกลับมาใช้ใหม่", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { num: "50%", label: "Renewable Energy", sub: "เป้าหมายปี 2026", color: "bg-teal-50 border-teal-200 text-teal-700" },
    { num: "0", label: "Foam Packaging", sub: "ยกเลิกโฟมบรรจุภัณฑ์แล้ว", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
];

const commitments = [
    {
        title: "Biodegradable Materials",
        desc: "เราส่งเสริมการใช้ PLA และวัสดุชีวภาพเป็น Default Material ลดการใช้ ABS ที่ผลิตจากเชื้อเพลิงฟอสซิล ลูกค้าทุกคนที่เลือก PLA ได้รับส่วนลด Eco Credit",
        items: ["PLA จากข้าวโพดและอ้อย", "PETG รีไซเคิลได้ 100%", "ลด ABS ลง 40% จากปีที่แล้ว"],
        color: "border-green-500",
    },
    {
        title: "Zero Waste Production",
        desc: "เศษวัสดุจากการพิมพ์ทุกชิ้นถูกรวบรวมและส่งไปยังโรงรีไซเคิลพันธมิตร เราไม่ทิ้งขยะพลาสติกลงหลุมฝังกลบ",
        items: ["รีไซเคิล Filament Support Material", "หลอม Failed Print ใหม่", "Zero Landfill Policy"],
        color: "border-teal-500",
    },
    {
        title: "Green Packaging",
        desc: "กล่องบรรจุภัณฑ์ทุกใบทำจากกระดาษรีไซเคิล ยกเลิกโฟมกันกระแทกแล้วหันมาใช้ Honeycomb Paper Wrap แทน",
        items: ["กล่อง FSC Certified Paper", "Honeycomb Paper Wrap", "ปลอดพลาสติก Single-use"],
        color: "border-blue-500",
    },
];

const timeline = [
    { year: "2024", done: true, label: "ยกเลิกโฟมบรรจุภัณฑ์ทั้งหมด" },
    { year: "2024", done: true, label: "เปิดตัวโปรแกรม PLA Eco Credit" },
    { year: "2025", done: false, label: "ติดตั้ง Solar Panels ที่โรงงาน" },
    { year: "2026", done: false, label: "พลังงานหมุนเวียน 50%" },
    { year: "2027", done: false, label: "Carbon Neutral Operations" },
];

export default function SustainabilityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-emerald-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <TreePine className="w-4 h-4" /> เกี่ยวกับเรา
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-6">ความยั่งยืน</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            พันธกิจของเราในการเป็นผู้ผลิต 3D ที่รับผิดชอบต่อสิ่งแวดล้อมมากที่สุดในไทย
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    {/* Impact numbers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {stats.map((s) => (
                            <div key={s.label} className={`rounded-2xl border-2 p-6 text-center ${s.color}`}>
                                <p className="text-4xl font-black mb-1">{s.num}</p>
                                <p className="font-bold text-sm">{s.label}</p>
                                <p className="text-xs mt-1 opacity-70">{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Commitments */}
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">พันธกิจด้านสิ่งแวดล้อม</h2>
                    <div className="space-y-5 mb-16">
                        {commitments.map((c) => (
                            <div key={c.title} className={`bg-white rounded-2xl border-l-4 p-6 shadow-sm ${c.color}`}>
                                <h3 className="font-black text-slate-900 text-lg mb-2">{c.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">{c.desc}</p>
                                <ul className="flex flex-wrap gap-2">
                                    {c.items.map((item) => (
                                        <li key={item} className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Timeline */}
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">Sustainability Roadmap</h2>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-12">
                        <div className="space-y-4">
                            {timeline.map((t) => (
                                <div key={t.label} className="flex items-center gap-4">
                                    <span className={`text-xs font-black w-10 shrink-0 ${t.done ? "text-green-600" : "text-slate-400"}`}>{t.year}</span>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.done ? "bg-green-500" : "bg-slate-200"}`}>
                                        {t.done && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <p className={`text-sm font-semibold ${t.done ? "text-slate-800" : "text-slate-400"}`}>{t.label}</p>
                                    {t.done && <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✓ สำเร็จ</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <Link href="/materials/pla" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-8 py-4 rounded-full hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
                            ดูวัสดุ Eco-friendly <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
