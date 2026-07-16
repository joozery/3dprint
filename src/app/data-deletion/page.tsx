"use client";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { Trash2, Mail, Clock, ShieldCheck } from "lucide-react";

// หน้าคำแนะนำการขอลบข้อมูล — จำเป็นสำหรับ Facebook Login (Data Deletion Instructions URL)
const CONTACT_EMAIL = "wooyoumarketing@gmail.com";

export default function DataDeletionPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-20 w-full">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-bl-[100%] z-0"></div>
                    <div className="relative z-10 flex items-center gap-4 mb-3">
                        <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                            <Trash2 size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">การขอลบข้อมูลส่วนตัว</h1>
                    </div>
                    <p className="text-slate-500 font-medium mb-10 pb-6 border-b border-slate-100 relative z-10">
                        Data Deletion Instructions — PDM 3D Print (printmydesign.net)
                    </p>

                    <div className="space-y-8 text-slate-600 leading-relaxed font-medium relative z-10">
                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">ข้อมูลที่เราจัดเก็บ</h2>
                            <p>
                                เมื่อคุณเข้าสู่ระบบด้วยบัญชี Facebook, Google หรือ LINE เราจัดเก็บเฉพาะ
                                ชื่อ อีเมล และรูปโปรไฟล์ของคุณ เพื่อใช้สร้างบัญชีและยืนยันตัวตนเท่านั้น
                                รวมถึงข้อมูลการใช้งาน เช่น ไฟล์โมเดล ใบเสนอราคา ที่อยู่จัดส่ง และประวัติการสั่งซื้อ
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">วิธีขอลบข้อมูลทั้งหมด</h2>
                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-blue-600 shrink-0 mt-1" />
                                    <p>
                                        ส่งอีเมลมาที่ <a href={`mailto:${CONTACT_EMAIL}?subject=ขอลบข้อมูลส่วนตัว`} className="text-blue-600 font-bold hover:underline">{CONTACT_EMAIL}</a>{" "}
                                        โดยใช้หัวข้อ <b>"ขอลบข้อมูลส่วนตัว"</b> พร้อมระบุอีเมลของบัญชีที่คุณใช้สมัคร
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock size={18} className="text-blue-600 shrink-0 mt-1" />
                                    <p>
                                        เราจะลบบัญชีและข้อมูลส่วนตัวทั้งหมดของคุณออกจากระบบภายใน <b>30 วัน</b>{" "}
                                        และแจ้งยืนยันกลับทางอีเมลเมื่อดำเนินการเสร็จสิ้น
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-1" />
                                    <p>
                                        ข้อมูลที่กฎหมายกำหนดให้เก็บรักษา เช่น เอกสารทางภาษีของคำสั่งซื้อที่ชำระเงินแล้ว
                                        อาจถูกเก็บไว้ตามระยะเวลาที่กฎหมายกำหนด แต่จะไม่ถูกนำไปใช้เพื่อวัตถุประสงค์อื่น
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">การถอนสิทธิ์แอปจาก Facebook</h2>
                            <p>
                                คุณสามารถถอนการเชื่อมต่อแอปนี้จากบัญชี Facebook ของคุณได้ที่{" "}
                                <span className="font-bold">Facebook → Settings → Apps and Websites</span>{" "}
                                ซึ่งจะหยุดการแชร์ข้อมูลใหม่กับเราทันที (ข้อมูลที่เก็บไว้แล้วลบได้ตามขั้นตอนด้านบน)
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
