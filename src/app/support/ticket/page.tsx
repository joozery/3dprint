"use client";

import Navbar from "@/components/layout/Navbar";
import { Inbox, ArrowRight } from "lucide-react";

export default function TicketPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Inbox className="w-4 h-4" /> ส่งคำร้อง
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">ส่งคำร้องถึงทีมงาน</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            ฝากปัญหาหรือคำถามไว้กับเรา ทีมงานจะตอบกลับภายใน 1-2 วันทำการ
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <h2 className="text-xl font-black text-slate-900 mb-6">แบบฟอร์มส่งคำร้อง</h2>
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">ชื่อ-นามสกุล *</label>
                                    <input type="text" placeholder="กรอกชื่อจริง" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">อีเมล *</label>
                                    <input type="email" placeholder="your@email.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ประเภทคำร้อง *</label>
                                <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="">เลือกประเภท...</option>
                                    <option>คำถามทั่วไป</option>
                                    <option>ปัญหาเกี่ยวกับออเดอร์</option>
                                    <option>ปัญหาการชำระเงิน</option>
                                    <option>ปัญหาการจัดส่ง</option>
                                    <option>คำร้องเรียน</option>
                                    <option>อื่นๆ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">หมายเลขออเดอร์ (ถ้ามี)</label>
                                <input type="text" placeholder="เช่น ORD-2025-001234" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">รายละเอียด *</label>
                                <textarea rows={5} placeholder="อธิบายปัญหาหรือคำถามของคุณอย่างละเอียด..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ไฟล์แนบ (ถ้ามี)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                                    <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">คลิกหรือลากวางไฟล์ที่นี่</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF สูงสุด 10 MB</p>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                                ส่งคำร้อง <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-6">
                        ทีมงานจะตอบกลับภายใน <strong className="text-slate-700">1-2 วันทำการ</strong> ทางอีเมลที่คุณระบุ
                    </p>
                </div>
            </div>
        </div>
    );
}
