"use client";

import Navbar from "@/components/layout/Navbar";
import { Upload, Star, Users, ArrowRight } from "lucide-react";

const benefits = [
    { icon: Star, color: "text-amber-600 bg-amber-50", title: "รับเครดิต PDM", desc: "ได้รับ PDM Credit ทุกครั้งที่มีคนดาวน์โหลดหรือพิมพ์โมเดลของคุณ" },
    { icon: Users, color: "text-blue-600 bg-blue-50", title: "ชุมชนนักออกแบบ", desc: "เข้าร่วมชุมชน Maker & Designer กว่า 5,000 คนที่แบ่งปันความรู้" },
    { icon: Upload, color: "text-green-600 bg-green-50", title: "แสดงผลงาน", desc: "โปรไฟล์ Designer ของคุณจะแสดงผลงานให้ลูกค้าและแบรนด์เห็น" },
];

export default function UploadModelPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Upload className="w-4 h-4" /> อัปโหลดโมเดล
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">แบ่งปันโมเดลของคุณ</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            แบ่งปันงานออกแบบกับชุมชน เปิดให้คนอื่นดาวน์โหลดและพิมพ์ได้ พร้อมรับเครดิต PDM
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Upload form */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">อัปโหลดโมเดล</h2>
                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                {/* Dropzone */}
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                    <p className="font-bold text-slate-700 mb-1">ลากวางไฟล์หรือคลิกเพื่อเลือก</p>
                                    <p className="text-xs text-slate-500">STL, OBJ, STEP, 3MF — สูงสุด 50 MB</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">ชื่อโมเดล *</label>
                                    <input type="text" placeholder="เช่น Parametric Wall Bracket" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">หมวดหมู่ *</label>
                                    <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="">เลือกหมวดหมู่...</option>
                                        <option>ชิ้นส่วนใช้งาน (Functional)</option>
                                        <option>ของตกแต่ง (Decorative)</option>
                                        <option>งานศิลปะ (Art)</option>
                                        <option>ของเล่น (Toys)</option>
                                        <option>อื่นๆ</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">คำอธิบาย</label>
                                    <textarea rows={3} placeholder="อธิบายโมเดล วิธีใช้งาน เทคนิคที่แนะนำ..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">License *</label>
                                    <div className="space-y-2">
                                        {[
                                            { val: "free", label: "Free — ใช้งานได้ฟรีทุกวัตถุประสงค์" },
                                            { val: "cc-by", label: "CC BY — ใช้ได้ แต่ต้องอ้างอิงชื่อผู้สร้าง" },
                                            { val: "cc-by-nc", label: "CC BY-NC — ใช้ได้เฉพาะไม่ใช่เชิงพาณิชย์" },
                                        ].map((l) => (
                                            <label key={l.val} className="flex items-center gap-3 cursor-pointer">
                                                <input type="radio" name="license" value={l.val} className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-slate-700">{l.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <Upload className="w-4 h-4" /> อัปโหลดโมเดล
                                </button>
                            </form>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-5">
                            <h2 className="text-xl font-black text-slate-900">ทำไมต้องแบ่งปันโมเดล?</h2>
                            {benefits.map((b) => (
                                <div key={b.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                                        <b.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{b.title}</h3>
                                        <p className="text-sm text-slate-500">{b.desc}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                <h3 className="font-bold text-amber-800 mb-2">📋 ขั้นตอนการตรวจสอบ</h3>
                                <p className="text-sm text-amber-700">โมเดลทุกชิ้นจะผ่านการตรวจสอบโดยทีมงานก่อนเผยแพร่สู่สาธารณะ ใช้เวลา <strong>1-3 วันทำการ</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
