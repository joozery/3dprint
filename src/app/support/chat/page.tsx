"use client";

import Navbar from "@/components/layout/Navbar";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
    const hours = [
        { day: "วันจันทร์ – ศุกร์", time: "09:00 – 18:00 น." },
        { day: "วันเสาร์", time: "10:00 – 15:00 น." },
        { day: "วันอาทิตย์ / วันหยุดนักขัตฤกษ์", time: "ปิดให้บริการ" },
    ];

    const channels = [
        { name: "LINE Official", handle: "@pdmpro", color: "bg-green-500", desc: "ตอบไวที่สุด" },
        { name: "Facebook Messenger", handle: "PrintMyDesign.TH", color: "bg-blue-600", desc: "สำหรับลูกค้า Facebook" },
        { name: "Email Support", handle: "hello@pdmpro.co.th", color: "bg-slate-600", desc: "ตอบภายใน 1 วันทำการ" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <MessageCircle className="w-4 h-4" /> Live Chat
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">ติดต่อผ่าน Live Chat</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            คุยกับทีมงานผู้เชี่ยวชาญแบบ Real-time รับคำตอบทันที ไม่ต้องรอนาน
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-16">
                    {/* Status */}
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-5 py-2.5 rounded-full">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                            ออนไลน์ — วันจันทร์-ศุกร์ 9:00–18:00 น.
                        </span>
                    </div>

                    {/* Chat UI mockup */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                        <div className="bg-blue-600 px-5 py-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">PDM Support</p>
                                <p className="text-blue-200 text-xs">Online · ตอบใน ~2 นาที</p>
                            </div>
                        </div>
                        <div className="p-5 space-y-4 min-h-[180px]">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-xs">
                                    <p className="text-sm text-slate-700">สวัสดีครับ! มีอะไรให้ช่วยได้บ้างครับ? 😊</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-xs font-bold text-slate-500">คุณ</div>
                                <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-2.5 max-w-xs">
                                    <p className="text-sm text-white">อยากถามเรื่องราคาพิมพ์ PLA ครับ</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-5 pb-5">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <MessageCircle className="w-4 h-4" /> เริ่ม Live Chat
                            </button>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
                        <h3 className="font-black text-slate-900 mb-4">เวลาทำการ</h3>
                        <div className="space-y-3">
                            {hours.map((h) => (
                                <div key={h.day} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                    <span className="text-sm text-slate-700 font-medium">{h.day}</span>
                                    <span className={`text-sm font-bold ${h.time === "ปิดให้บริการ" ? "text-red-500" : "text-slate-900"}`}>{h.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alternative channels */}
                    <h3 className="font-black text-slate-900 mb-4">ช่องทางติดต่ออื่นๆ</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {channels.map((c) => (
                            <div key={c.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mx-auto mb-3`}>
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <p className="font-bold text-slate-800 text-sm mb-1">{c.name}</p>
                                <p className="text-xs text-slate-500 mb-2">{c.handle}</p>
                                <span className="text-xs text-emerald-600 font-semibold">{c.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
