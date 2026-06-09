"use client";

import Navbar from "@/components/layout/Navbar";
import { Box, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

function RatingDots({ value, max = 5, color = "text-red-500" }: { value: number; max?: number; color?: string }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className={`text-lg ${i < value ? color : "text-slate-200"}`}>●</span>
            ))}
        </div>
    );
}

const resinTypes = [
    { name: "Tough Resin", color: "border-red-200 bg-red-50", badge: "bg-red-100 text-red-700", desc: "ทนแรงกระแทกสูง เหมาะกับชิ้นส่วนที่ต้องรับแรงและไม่แตกหัก" },
    { name: "High Temp Resin", color: "border-orange-200 bg-orange-50", badge: "bg-orange-100 text-orange-700", desc: "ทนความร้อนสูงถึง 238°C (HDT) สำหรับ Jig, Fixture และชิ้นส่วนใต้ฝากระโปรง" },
    { name: "Flexible Resin", color: "border-blue-200 bg-blue-50", badge: "bg-blue-100 text-blue-700", desc: "ยืดหยุ่นได้ในระดับ Resin เหมาะกับ Gasket, Seal ที่ต้องการ SLA Precision" },
    { name: "Castable Resin", color: "border-amber-200 bg-amber-50", badge: "bg-amber-100 text-amber-700", desc: "เผาหมดไฟได้สะอาด ใช้ทำต้นแบบหล่อโลหะ เครื่องประดับ แหวน จี้" },
];

export default function EngineeringResinPage() {
    const properties = [
        { label: "ความแข็งแรง", value: 5, note: "สูงสุด" },
        { label: "ทนความร้อน", value: 4, note: "120°C+" },
        { label: "ความแข็ง", value: 5, note: "สูงมาก" },
        { label: "ความละเอียด", value: 5, note: "Micron" },
        { label: "ราคา", value: 2, note: "สูง" },
    ];

    const useCases = [
        "Jig & Fixture", "แม่พิมพ์ทดสอบ",
        "ชิ้นส่วนใต้ฝากระโปรง", "อุปกรณ์ทางการแพทย์",
        "ต้นแบบหล่อโลหะ", "Snap fit ความแม่นยำสูง",
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-red-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Box className="w-4 h-4" /> วัสดุ (Materials)
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Engineering Resin</h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">เรซิ่นระดับ Engineering Grade สำหรับงานที่ต้องการความแข็งแกร่ง ทนความร้อน และความแม่นยำสูง</p>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {["Engineering Grade", "ทนความร้อนสูง", "High Strength", "Precision"].map((b) => (
                                <span key={b} className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium">{b}</span>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Link href="/quote" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors inline-flex items-center gap-2">
                                สั่งพิมพ์ Eng. Resin <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-10">ประเภทของ Engineering Resin</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
                        {resinTypes.map((r) => (
                            <div key={r.name} className={`rounded-2xl border-2 p-6 ${r.color}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.badge}`}>{r.name}</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{r.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">คุณสมบัติทั่วไป</h2>
                            <div className="space-y-5">
                                {properties.map((p) => (
                                    <div key={p.label} className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700 w-32">{p.label}</span>
                                        <div className="flex items-center gap-3">
                                            <RatingDots value={p.value} color="text-red-500" />
                                            <span className="text-xs text-slate-500 w-20">{p.note}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">เหมาะกับงานใด?</h2>
                            <div className="space-y-2">
                                {useCases.map((u) => (
                                    <div key={u} className="flex items-center gap-2.5 py-1.5">
                                        <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
                                        <span className="text-sm font-medium text-slate-700">{u}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 p-10 text-center text-white">
                        <h2 className="text-2xl font-black mb-3">ต้องการ Engineering-Grade Resin?</h2>
                        <p className="text-red-100 mb-8">ติดต่อทีมงานเพื่อเลือก Resin ที่เหมาะกับงานของคุณ</p>
                        <Link href="/quote" className="inline-flex items-center gap-2 bg-white text-red-700 font-bold px-8 py-4 rounded-full hover:bg-red-50 transition-colors shadow-lg">
                            สั่งพิมพ์เลย <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
