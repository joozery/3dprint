"use client";

import Navbar from "@/components/layout/Navbar";
import { MessageCircle, Mail, Phone, FileText } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-6">ศูนย์ช่วยเหลือ (Support)</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            มีคำถามหรือต้องการความช่วยเหลือ? ทีมงานของเราพร้อมให้คำปรึกษาตลอดเวลา ไม่ว่าจะเป็นเรื่องการออกแบบ การประเมินราคา หรือการจัดส่ง
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <MessageCircle className="w-6 h-6 text-blue-600" />
                                ช่องทางการติดต่อ
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">LINE Official</h3>
                                        <p className="text-slate-500 text-sm mb-2">ตอบกลับเร็วที่สุด (09:00 - 18:00)</p>
                                        <a href="#" className="text-blue-600 font-bold hover:underline">@3dprintpro</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Email</h3>
                                        <p className="text-slate-500 text-sm mb-2">ส่งไฟล์หรือขอใบเสนอราคาทางการ</p>
                                        <a href="mailto:support@3dprintpro.com" className="text-blue-600 font-bold hover:underline">support@3dprintpro.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Phone</h3>
                                        <p className="text-slate-500 text-sm mb-2">โทรสอบถามด่วน</p>
                                        <span className="text-slate-700 font-bold">02-XXX-XXXX</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-600" />
                                คำถามที่พบบ่อย (FAQ)
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { q: "ใช้เวลาพิมพ์กี่วัน?", a: "โดยปกติใช้เวลา 1-3 วันทำการ ขึ้นอยู่กับขนาดและความซับซ้อนของชิ้นงาน" },
                                    { q: "รับไฟล์นามสกุลอะไรบ้าง?", a: "เรารองรับไฟล์ .STL, .OBJ, .STEP และ .3MF ครับ" },
                                    { q: "มีขั้นต่ำในการสั่งทำไหม?", a: "ไม่มีขั้นต่ำครับ ชิ้นเดียวก็รับพิมพ์!" }
                                ].map((faq, i) => (
                                    <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <h3 className="font-bold text-slate-800 mb-1">{faq.q}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
