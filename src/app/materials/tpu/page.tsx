"use client";

import Navbar from "@/components/layout/Navbar";
import { Zap, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

function RatingDots({ value, max = 5, color = "text-yellow-500" }: { value: number; max?: number; color?: string }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className={`text-lg ${i < value ? color : "text-slate-200"}`}>●</span>
            ))}
        </div>
    );
}

export default function TPUPage() {
    const properties = [
        { label: "ความยืดหยุ่น", value: 5, note: "สูงสุด" },
        { label: "ทนแรงกระแทก", value: 5, note: "สูงมาก" },
        { label: "ความแข็งแรง", value: 3, note: "ปานกลาง" },
        { label: "Shore Hardness", value: 3, note: "85A – 95A" },
        { label: "ราคา", value: 3, note: "ปานกลาง" },
    ];

    const useCases = [
        "กันชน / โช้คอัพ", "ด้ามจับ / Grip",
        "พื้นรองเท้า", "ซีลและ O-Ring",
        "เคสโทรศัพท์", "ยางกันกระแทก",
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-yellow-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Zap className="w-4 h-4" /> วัสดุ (Materials)
                        </span>
                        <h1 className="text-5xl font-black mb-4">TPU</h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">Thermoplastic Polyurethane — ยืดหยุ่นสูงเหมือนยาง ทนแรงกระแทก เหมาะกับชิ้นส่วนที่ต้องการความอ่อนตัว</p>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {["ยืดหยุ่นสูง", "ทนกระแทก", "เหมือนยาง", "Shore 85-95A"].map((b) => (
                                <span key={b} className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium">{b}</span>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Link href="/quote" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors inline-flex items-center gap-2">
                                สั่งพิมพ์ด้วย TPU <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">คุณสมบัติของวัสดุ</h2>
                            <div className="space-y-5">
                                {properties.map((p) => (
                                    <div key={p.label} className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700 w-36">{p.label}</span>
                                        <div className="flex items-center gap-3">
                                            <RatingDots value={p.value} color="text-yellow-500" />
                                            <span className="text-xs text-slate-500 w-20">{p.note}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">Printing Parameters</h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Nozzle Temp", value: "220 – 240 °C" },
                                    { label: "Bed Temp", value: "30 – 60 °C" },
                                    { label: "Print Speed", value: "20 – 30 mm/s (ช้า)" },
                                    { label: "Extruder", value: "Direct Drive แนะนำ" },
                                    { label: "Retraction", value: "น้อยหรือปิด" },
                                    { label: "Available Process", value: "FDM" },
                                ].map((r) => (
                                    <div key={r.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-sm text-slate-500">{r.label}</span>
                                        <span className="text-sm font-semibold text-slate-800">{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-black text-slate-900 text-center mb-8">เหมาะกับงานประเภทใด?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {useCases.map((u) => (
                                <div key={u} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-2.5 shadow-sm">
                                    <CheckCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{u}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="rounded-3xl bg-gradient-to-r from-yellow-500 to-amber-500 p-10 text-center text-white">
                        <h2 className="text-2xl font-black mb-3">ต้องการชิ้นงานที่ยืดหยุ่นเหมือนยาง?</h2>
                        <p className="text-yellow-100 mb-8">TPU คือวัสดุที่ใช่สำหรับงานที่ต้องการ Flexibility</p>
                        <Link href="/quote" className="inline-flex items-center gap-2 bg-white text-yellow-700 font-bold px-8 py-4 rounded-full hover:bg-yellow-50 transition-colors shadow-lg">
                            สั่งพิมพ์ TPU <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
