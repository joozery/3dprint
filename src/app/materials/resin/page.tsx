"use client";

import Navbar from "@/components/layout/Navbar";
import { FlaskConical, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

function RatingDots({ value, max = 5, color = "text-purple-500" }: { value: number; max?: number; color?: string }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className={`text-lg ${i < value ? color : "text-slate-200"}`}>●</span>
            ))}
        </div>
    );
}

export default function ResinPage() {
    const properties = [
        { label: "ความละเอียด", value: 5, note: "สูงสุด 25µm" },
        { label: "พื้นผิว", value: 5, note: "เนียนมาก" },
        { label: "ความแข็ง", value: 3, note: "ปานกลาง" },
        { label: "ทนความร้อน", value: 2, note: "50°C" },
        { label: "ราคา", value: 3, note: "ปานกลาง" },
    ];

    const useCases = [
        "ฟิกเกอร์และโมเดลตัวละคร", "ต้นแบบเครื่องประดับ",
        "งานทันตกรรม", "ผลิตภัณฑ์ความงาม",
        "งานศิลปะ Collector", "ต้นแบบ Consumer Product",
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-purple-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <FlaskConical className="w-4 h-4" /> วัสดุ (Materials)
                        </span>
                        <h1 className="text-5xl font-black mb-4">Standard Resin</h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">เรซิ่นมาตรฐานสำหรับ SLA/DLP Printing ให้ความละเอียดสูงที่สุดและพื้นผิวเนียนเรียบระดับไมครอน</p>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {["ละเอียด 25µm", "พื้นผิวเนียน", "SLA/DLP", "รายละเอียดสูง"].map((b) => (
                                <span key={b} className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium">{b}</span>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Link href="/quote" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors inline-flex items-center gap-2">
                                สั่งพิมพ์ด้วย Resin <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="mb-8 rounded-2xl bg-purple-50 border border-purple-200 p-5 flex items-start gap-3">
                        <FlaskConical className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800"><strong>หมายเหตุ:</strong> Resin ใช้กับกระบวนการ SLA และ DLP เท่านั้น ไม่สามารถใช้กับเครื่อง FDM ได้</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">คุณสมบัติของวัสดุ</h2>
                            <div className="space-y-5">
                                {properties.map((p) => (
                                    <div key={p.label} className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700 w-32">{p.label}</span>
                                        <div className="flex items-center gap-3">
                                            <RatingDots value={p.value} color="text-purple-500" />
                                            <span className="text-xs text-slate-500 w-20">{p.note}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">Specifications</h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Layer Resolution", value: "25 – 100 µm" },
                                    { label: "XY Accuracy", value: "± 0.05 mm" },
                                    { label: "Max Build", value: "145 × 145 × 185 mm" },
                                    { label: "Colors", value: "Clear, Grey, Black, White" },
                                    { label: "Post-Process", value: "IPA Wash + UV Cure" },
                                    { label: "Process", value: "SLA / DLP" },
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
                                    <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{u}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 p-10 text-center text-white">
                        <h2 className="text-2xl font-black mb-3">ต้องการความละเอียดสูงสุด?</h2>
                        <p className="text-purple-100 mb-8">Resin SLA ให้รายละเอียดที่ไม่มีวัสดุใดเทียบได้</p>
                        <Link href="/quote" className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-4 rounded-full hover:bg-purple-50 transition-colors shadow-lg">
                            สั่งพิมพ์ Resin <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
