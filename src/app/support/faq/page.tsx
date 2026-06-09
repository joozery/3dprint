"use client";

import Navbar from "@/components/layout/Navbar";
import { HelpCircle, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
    { q: "ไฟล์ที่รองรับมีอะไรบ้าง?", a: "เรารองรับไฟล์ STL, STEP (STP), OBJ และ 3MF ขนาดไฟล์สูงสุด 100 MB ต่อไฟล์ สามารถอัปโหลดได้หลายไฟล์พร้อมกัน หากไฟล์มีปัญหาระบบจะแจ้งเตือนและแนะนำการแก้ไข" },
    { q: "ใช้เวลากี่วันในการผลิต?", a: "ขึ้นอยู่กับกระบวนการ: FDM ใช้เวลา 1-5 วันทำการ, SLA ใช้เวลา 1-3 วันทำการ, Nylon SLS ใช้เวลา 2-5 วันทำการ นับจากวันที่ชำระเงินและไฟล์ผ่านการตรวจสอบแล้ว" },
    { q: "ชำระเงินด้วยวิธีใดได้บ้าง?", a: "รองรับการชำระผ่านบัตรเครดิต/เดบิต (Visa/Mastercard), พร้อมเพย์ (PromptPay) และการโอนเงินผ่านธนาคาร สำหรับองค์กรสามารถออกใบแจ้งหนี้และรับชำระแบบ B2B ได้" },
    { q: "สามารถขอยกเลิกออเดอร์ได้หรือไม่?", a: "สามารถยกเลิกได้ภายใน 1 ชั่วโมงหลังสั่งซื้อ หากเลยเวลาดังกล่าวและยังไม่เริ่มพิมพ์ สามารถแจ้งยกเลิกได้โดยหักค่าดำเนินการ 10% เมื่อเริ่มพิมพ์แล้วจะไม่สามารถยกเลิกหรือขอคืนเงินได้" },
    { q: "ไฟล์ 3D ของฉันปลอดภัยหรือไม่?", a: "ใช่ ไฟล์ทุกชิ้นถูกเข้ารหัสด้วย SSL ระหว่างอัปโหลด และเก็บในระบบที่ปลอดภัย เราไม่เผยแพร่ ขาย หรือนำไฟล์ของคุณไปใช้งานอื่นใดนอกจากการผลิต" },
    { q: "รองรับขนาดชิ้นงานสูงสุดเท่าไร?", a: "FDM: 300×300×400 mm, SLA: 145×145×185 mm, Nylon SLS: 340×340×600 mm หากชิ้นงานใหญ่กว่านี้สามารถตัดแล้วประกอบได้ ทีมวิศวกรจะช่วยแนะนำ" },
    { q: "มีการรับประกันคุณภาพหรือไม่?", a: "ใช่ ทีมวิศวกรตรวจสอบทุกชิ้นก่อนจัดส่ง หากพบข้อบกพร่องจากฝั่งเรา เราจะพิมพ์ใหม่หรือคืนเงินให้โดยไม่มีค่าใช้จ่ายเพิ่มเติม" },
    { q: "จัดส่งถึงต่างจังหวัดได้ไหม?", a: "ได้ทุกจังหวัดทั่วไทย ผ่านบริการ Kerry Express, Flash Express และ SCG Express สามารถติดตามพัสดุได้แบบ Real-time ผ่านลิงก์ที่ส่งให้ทาง Email" },
];

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
            >
                <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <HelpCircle className="w-4 h-4" /> FAQ
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">คำถามที่พบบ่อย</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            รวบรวมคำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด หากไม่พบคำตอบที่ต้องการ ติดต่อทีมงานได้เลย
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-16">
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>

                    <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-200 p-8 text-center">
                        <h3 className="font-black text-blue-900 text-lg mb-2">ไม่พบคำตอบที่ต้องการ?</h3>
                        <p className="text-blue-700 text-sm mb-6">ทีมงานพร้อมตอบทุกคำถามของคุณ</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link href="/support/chat" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm">
                                Live Chat <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/support/contact" className="inline-flex items-center gap-2 border border-blue-300 text-blue-700 font-bold px-6 py-2.5 rounded-full hover:bg-blue-100 transition-colors text-sm">
                                ติดต่อเรา
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
