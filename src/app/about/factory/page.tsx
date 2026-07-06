"use client";

import Navbar from "@/components/layout/Navbar";
import { Factory, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const machines = [
    { name: "Bambu X1 Carbon", type: "FDM Multi-color", badge: "bg-blue-100 text-blue-700", specs: ["AMS 4 สีพร้อมกัน", "260×260×256 mm", "PLA/PETG/TPU", "Speed 500 mm/s"], desc: "เครื่องพิมพ์ FDM ความเร็วสูงสุดในตลาด รองรับ Multi-color ด้วย AMS" },
    { name: "Formlabs Form 3L", type: "SLA Resin", badge: "bg-purple-100 text-purple-700", specs: ["Layer 25-300 µm", "335×200×300 mm", "Resin ทุกชนิด", "LFS Technology"], desc: "SLA ขนาดใหญ่ความแม่นยำสูง รองรับ Engineering Resin ทุกประเภท" },
    { name: "Fuse 1+ 30W", type: "SLS Nylon", badge: "bg-teal-100 text-teal-700", specs: ["PA12 Nylon", "165×165×300 mm", "ไม่ต้อง Support", "Industrial Grade"], desc: "SLS ระดับ Industrial สำหรับ Nylon PA12 ไม่ต้องการ Support Structure" },
    { name: "EOS M290", type: "Metal SLS", badge: "bg-orange-100 text-orange-700", specs: ["Stainless/Titanium", "250×250×325 mm", "Laser 400W", "Aerospace Grade"], desc: "พิมพ์โลหะด้วย SLS สำหรับงาน Aerospace และ Medical" },
];

const qcSteps = [
    { num: "01", label: "รับไฟล์", desc: "ตรวจสอบความสมบูรณ์ของไฟล์" },
    { num: "02", label: "ตรวจสอบ", desc: "วิศวกรตรวจสอบ Geometry" },
    { num: "03", label: "พิมพ์", desc: "ใช้เครื่องตามสเปค" },
    { num: "04", label: "QC", desc: "วัดขนาด ตรวจพื้นผิว" },
    { num: "05", label: "บรรจุ", desc: "บรรจุภัณฑ์กันกระแทก" },
    { num: "06", label: "จัดส่ง", desc: "ส่งพร้อมเลข Tracking" },
];

export default function FactoryPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Factory className="w-4 h-4" /> เกี่ยวกับเรา
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-6">โรงงาน & เทคโนโลยี</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            สำรวจเครื่องจักรระดับอุตสาหกรรมและกระบวนการผลิตที่ทำให้ PDM ส่งมอบงานคุณภาพสูงได้ทุกครั้ง
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-blue-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {[
                                { num: "20+", label: "เครื่องพิมพ์" },
                                { num: "5", label: "เทคโนโลยี" },
                                { num: "24/7", label: "Production" },
                                { num: "< 0.2mm", label: "Tolerance" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <p className="text-3xl font-black">{s.num}</p>
                                    <p className="text-blue-200 text-sm mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-10">Fleet เครื่องจักร</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                        {machines.map((m) => (
                            <div key={m.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="bg-slate-200 h-44 flex items-center justify-center">
                                    <Factory className="w-16 h-16 text-slate-400" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="font-black text-slate-900">{m.name}</h3>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${m.badge}`}>{m.type}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">{m.desc}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {m.specs.map((s) => (
                                            <div key={s} className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 text-center mb-10">กระบวนการ QC</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {qcSteps.map((s) => (
                            <div key={s.num} className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white text-lg font-black flex items-center justify-center mx-auto mb-3">{s.num}</div>
                                <p className="font-bold text-slate-800 text-sm">{s.label}</p>
                                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="rounded-3xl bg-gradient-to-r from-slate-800 to-slate-700 p-10 text-center text-white">
                        <h2 className="text-2xl font-black mb-3">เห็นผลงานจริงก่อนตัดสินใจ</h2>
                        <p className="text-slate-400 mb-8">ดูโมเดลตัวอย่างที่ผ่านกระบวนการผลิตจริง</p>
                        <Link href="/quote" className="inline-flex items-center gap-2 bg-white text-slate-800 font-bold px-8 py-4 rounded-full hover:bg-slate-50 transition-colors shadow-lg">
                            ดูตัวอย่างงาน <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
