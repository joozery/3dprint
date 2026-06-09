"use client";

import Navbar from "@/components/layout/Navbar";
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const contacts = [
        { icon: Phone, label: "โทรศัพท์", value: "02-xxx-xxxx", sub: "วันจันทร์-ศุกร์ 9:00-18:00 น.", color: "bg-blue-50 text-blue-600" },
        { icon: Mail, label: "อีเมล", value: "hello@pdmpro.co.th", sub: "ตอบกลับภายใน 1 วันทำการ", color: "bg-purple-50 text-purple-600" },
        { icon: MessageCircle, label: "LINE OA", value: "@pdmpro", sub: "ตอบไวที่สุด แอดเพื่อนได้เลย", color: "bg-green-50 text-green-600" },
        { icon: MapPin, label: "ที่ตั้ง", value: "กรุงเทพมหานคร", sub: "ติดต่อล่วงหน้าก่อนเข้าพบ", color: "bg-orange-50 text-orange-600" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Phone className="w-4 h-4" /> ติดต่อเรา
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">ติดต่อ PrintMyDesign</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            พร้อมให้บริการและตอบทุกคำถาม เลือกช่องทางที่สะดวกที่สุดสำหรับคุณ
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-16">
                    {/* Contact cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {contacts.map((c) => (
                            <div key={c.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${c.color}`}>
                                    <c.icon className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{c.label}</p>
                                <p className="font-bold text-slate-900 mb-1">{c.value}</p>
                                <p className="text-xs text-slate-500">{c.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact form */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 mb-6">ส่งข้อความถึงเรา</h2>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">ชื่อ</label>
                                        <input type="text" placeholder="ชื่อ-นามสกุล" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">เบอร์โทร</label>
                                        <input type="tel" placeholder="08x-xxx-xxxx" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">อีเมล</label>
                                    <input type="email" placeholder="your@email.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">ข้อความ</label>
                                    <textarea rows={5} placeholder="บอกเล่าความต้องการของคุณ..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    ส่งข้อความ <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        <div className="space-y-6">
                            {/* Map placeholder */}
                            <div className="bg-slate-200 rounded-2xl h-56 flex items-center justify-center border border-slate-100">
                                <div className="text-center">
                                    <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 font-medium">Google Maps</p>
                                    <p className="text-xs text-slate-400">กรุงเทพมหานคร</p>
                                </div>
                            </div>

                            {/* Business hours */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" /> เวลาทำการ
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { day: "วันจันทร์ – ศุกร์", time: "09:00 – 18:00 น." },
                                        { day: "วันเสาร์", time: "10:00 – 15:00 น." },
                                        { day: "วันอาทิตย์", time: "ปิดให้บริการ" },
                                    ].map((h) => (
                                        <div key={h.day} className="flex justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                                            <span className="text-slate-600">{h.day}</span>
                                            <span className={`font-semibold ${h.time === "ปิดให้บริการ" ? "text-red-500" : "text-slate-800"}`}>{h.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
