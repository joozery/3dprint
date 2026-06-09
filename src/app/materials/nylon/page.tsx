"use client";

import Navbar from "@/components/layout/Navbar";
import { Layers, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

function RatingDots({ value, max = 5, color = "text-teal-500" }: { value: number; max?: number; color?: string }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className={`text-lg ${i < value ? color : "text-slate-200"}`}>●</span>
            ))}
        </div>
    );
}

export default function NylonPage() {
    const properties = [
        { label: "ความแข็งแรง", value: 5, note: "สูงสุด" },
        { label: "ทนความร้อน", value: 4, note: "150°C" },
        { label: "ความยืดหยุ่น", value: 4, note: "ดีมาก" },
        { label: "ทนสารเคมี", value: 5, note: "สูงมาก" },
        { label: "ราคา", value: 2, note: "สูง" },
    ];

    const useCases = [
        "Functional Prototype", "ชิ้นส่วนยานยนต์",
        "อุปกรณ์การแพทย์", "Snap Fit & Living Hinge",
        "ชิ้นงานรับแรงสูง", "ชิ้นส่วนไม่ต้องการ Support",
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-teal-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Layers className="w-4 h-4" /> วัสดุ (Materials)
                        </span>
                        <h1 className="text-5xl font-black mb-4">Nylon SLS</h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">PA12 Nylon ผ่านกระบวนการ SLS (Selective Laser Sintering) — แข็งแรงสูงสุด เบา ทนสารเคมี ไม่ต้องการ Support</p>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {["PA12 Nylon", "SLS Process", "ไม่ต้อง Support", "แข็งแรงสูง"].map((b) => (
                                <span key={b} className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium">{b}</span>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Link href="/quote" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors inline-flex items-center gap-2">
                                สั่งพิมพ์ Nylon SLS <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="mb-8 rounded-2xl bg-teal-50 border border-teal-200 p-5 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-teal-800 mb-1">ข้อดีพิเศษของ SLS Nylon</p>
                            <p className="text-sm text-teal-700">ไม่ต้องการ Support Structure เพราะผงไนลอนรอบชิ้นงานทำหน้าที่พยุงแทน ทำให้สามารถพิมพ์รูปทรงซับซ้อนและ Hollow ได้โดยตรง</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">คุณสมบัติของวัสดุ</h2>
                            <div className="space-y-5">
                                {properties.map((p) => (
                                    <div key={p.label} className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700 w-32">{p.label}</span>
                                        <div className="flex items-center gap-3">
                                            <RatingDots value={p.value} color="text-teal-500" />
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
                                    { label: "Process", value: "SLS (Selective Laser Sintering)" },
                                    { label: "Layer Thickness", value: "0.1 mm" },
                                    { label: "Accuracy", value: "± 0.3 mm" },
                                    { label: "Max Build Size", value: "340 × 340 × 600 mm" },
                                    { label: "Color", value: "Natural White / Grey (ย้อมสีได้)" },
                                    { label: "Lead Time", value: "2 – 5 วัน" },
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
                                    <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{u}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-500 p-10 text-center text-white">
                        <h2 className="text-2xl font-black mb-3">ต้องการชิ้นงาน Functional ที่แข็งแกร่งที่สุด?</h2>
                        <p className="text-teal-100 mb-8">Nylon SLS คือวัสดุระดับ Production Grade ที่ดีที่สุด</p>
                        <Link href="/quote" className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-8 py-4 rounded-full hover:bg-teal-50 transition-colors shadow-lg">
                            สั่งพิมพ์ Nylon <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
