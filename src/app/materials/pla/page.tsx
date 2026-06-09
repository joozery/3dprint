"use client";

import Navbar from "@/components/layout/Navbar";
import { Leaf, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

function RatingDots({ value, max = 5, color = "text-emerald-500" }: { value: number; max?: number; color?: string }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className={`text-lg ${i < value ? color : "text-slate-200"}`}>●</span>
            ))}
        </div>
    );
}

export default function PLAPage() {
    const properties = [
        { label: "ความแข็งแรง", value: 3, note: "ปานกลาง" },
        { label: "ทนความร้อน", value: 2, note: "60°C" },
        { label: "ความยืดหยุ่น", value: 1, note: "เปราะ" },
        { label: "ความละเอียด", value: 4, note: "สูง" },
        { label: "ราคา", value: 5, note: "ถูกที่สุด" },
    ];

    const useCases = [
        "ต้นแบบสินค้า (Prototype)", "งานแสดงและนิทรรศการ",
        "โมเดลสถาปัตยกรรม", "งานการศึกษาและ Lab",
        "ของตกแต่งบ้าน", "ชิ้นส่วนทั่วไปในอาคาร",
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-emerald-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Leaf className="w-4 h-4" /> วัสดุ (Materials)
                        </span>
                        <h1 className="text-5xl font-black mb-4">PLA</h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">Polylactic Acid — วัสดุพิมพ์ 3D ยอดนิยมที่สุด เป็นมิตรกับสิ่งแวดล้อม ผลิตจากพืช ราคาประหยัด</p>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {["ราคาประหยัย", "Bio-based 100%", "พิมพ์ง่าย", "สีสันสวยงาม"].map((b) => (
                                <span key={b} className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium">{b}</span>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Link href="/quote" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors inline-flex items-center gap-2">
                                สั่งพิมพ์ด้วย PLA <ArrowRight className="w-4 h-4" />
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
                                        <span className="text-sm font-semibold text-slate-700 w-32">{p.label}</span>
                                        <div className="flex items-center gap-3">
                                            <RatingDots value={p.value} color="text-emerald-500" />
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
                                    { label: "Nozzle Temp", value: "190 – 220 °C" },
                                    { label: "Bed Temp", value: "60 °C" },
                                    { label: "Print Speed", value: "40 – 100 mm/s" },
                                    { label: "Layer Height", value: "0.1 – 0.3 mm" },
                                    { label: "Storage", value: "เก็บในที่แห้ง ซิปล็อก" },
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
                                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{u}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 rounded-2xl bg-amber-50 border border-amber-200 p-6">
                        <h3 className="font-bold text-amber-800 mb-2">⚠️ ข้อจำกัดของ PLA</h3>
                        <ul className="space-y-1 text-sm text-amber-700">
                            <li>• ทนความร้อนต่ำ (60°C) ไม่เหมาะกับชิ้นงานในรถหรือกลางแจ้ง</li>
                            <li>• เปราะกว่า ABS และ PETG ไม่เหมาะกับชิ้นส่วนรับแรงกระแทก</li>
                            <li>• ดูดซับความชื้นได้ ต้องเก็บในซองซิปล็อก</li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-16">
                    <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-green-500 p-10 text-center text-white">
                        <h2 className="text-2xl font-black mb-3">พร้อมสั่งพิมพ์ด้วย PLA แล้วหรือยัง?</h2>
                        <p className="text-emerald-100 mb-8">ราคาเริ่มต้นถูกที่สุด รับไฟล์ทุกรูปแบบ STL, STEP, OBJ</p>
                        <Link href="/quote" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors shadow-lg">
                            อัปโหลดไฟล์ 3D <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
