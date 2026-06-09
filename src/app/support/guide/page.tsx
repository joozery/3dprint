"use client";

import Navbar from "@/components/layout/Navbar";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        num: "01", color: "bg-blue-600", title: "สมัครสมาชิก",
        desc: "กรอกอีเมลและรหัสผ่าน จากนั้นยืนยัน OTP ที่ส่งไปยังอีเมลของคุณ ใช้เวลาไม่เกิน 2 นาที",
        tips: ["ใช้อีเมลจริงที่เข้าถึงได้", "รหัสผ่านอย่างน้อย 8 ตัว", "สามารถสมัครผ่าน Google/LINE ได้"],
    },
    {
        num: "02", color: "bg-purple-600", title: "อัปโหลดไฟล์ 3D",
        desc: "ไปที่หน้า \"สั่งพิมพ์\" แล้วลากวางหรือเลือกไฟล์ 3D ของคุณ รองรับ STL, STEP, OBJ และ 3MF",
        tips: ["ขนาดไฟล์สูงสุด 100 MB ต่อไฟล์", "อัปโหลดได้หลายไฟล์พร้อมกัน", "ไฟล์ถูกเข้ารหัส SSL ปลอดภัย 100%"],
    },
    {
        num: "03", color: "bg-pink-600", title: "เลือกวัสดุและ Finish",
        desc: "เลือกกระบวนการพิมพ์ (FDM/SLA) วัสดุ สี ผิวงาน และจำนวน ระบบจะอัปเดตราคาแบบ Real-time",
        tips: ["FDM = ราคาประหยัย ชิ้นงานใหญ่", "SLA = ละเอียดสูง พื้นผิวเนียน", "ดูคู่มือวัสดุถ้าไม่แน่ใจ"],
    },
    {
        num: "04", color: "bg-amber-500", title: "รับใบเสนอราคา",
        desc: "ระบบ AI วิเคราะห์ไฟล์และคำนวณราคาให้ทันทีภายใน 30 วินาที สามารถบันทึกหรือแชร์ใบเสนอราคาได้",
        tips: ["ราคารวม VAT 7% แล้ว", "บันทึกไว้ใน Cart ได้ก่อนชำระ", "ขอ Formal Quotation ได้"],
    },
    {
        num: "05", color: "bg-green-600", title: "สั่งพิมพ์และรับงาน",
        desc: "ชำระเงิน → ทีมวิศวกรตรวจสอบไฟล์ → พิมพ์และ QC → จัดส่งถึงมือคุณตรงเวลา",
        tips: ["ชำระผ่านบัตรเครดิต / พร้อมเพย์", "ติดตามสถานะออเดอร์แบบ Real-time", "จัดส่งทั่วไทยด้วย Kerry / Flash"],
    },
];

export default function GuidePage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <BookOpen className="w-4 h-4" /> คู่มือการใช้งาน
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">เริ่มต้นใช้งาน PDM</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            ไม่เคยใช้งานมาก่อน? ไม่เป็นไร ทำตาม 5 ขั้นตอนนี้แล้วคุณจะสั่งพิมพ์งานแรกได้ภายใน 5 นาที
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="space-y-6">
                        {steps.map((s, i) => (
                            <div key={s.num} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex gap-5">
                                <div className={`w-14 h-14 rounded-2xl ${s.color} text-white text-xl font-black flex items-center justify-center shrink-0`}>
                                    {s.num}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-slate-900 mb-2">{s.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                                    <ul className="space-y-1">
                                        {s.tips.map((tip) => (
                                            <li key={tip} className="text-xs text-slate-600 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" /> {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:flex items-center text-slate-300">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <h3 className="font-bold text-blue-900 mb-2">ยังมีคำถาม?</h3>
                            <p className="text-sm text-blue-700 mb-4">ดูคำถามที่พบบ่อยของเรา</p>
                            <Link href="/support/faq" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                                ไปที่หน้า FAQ <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                            <h3 className="font-bold text-green-900 mb-2">ต้องการความช่วยเหลือ?</h3>
                            <p className="text-sm text-green-700 mb-4">ทีมงานพร้อมช่วยคุณ จ-ศ 9:00-18:00</p>
                            <Link href="/support/contact" className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700">
                                ติดต่อเรา <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
