"use client";

import Navbar from "@/components/layout/Navbar";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const leaders = [
    { name: "คุณสมชาย รักดี", role: "CEO & Co-Founder", dept: "Leadership", avatar: "ส", bio: "วิศวกรเครื่องกล 15 ปี มหาวิทยาลัยเกษตรศาสตร์ ผู้เชี่ยวชาญด้าน Manufacturing และ Product Development", color: "bg-blue-600" },
    { name: "ดร.วิทยา นวัตกรรม", role: "CTO & Co-Founder", dept: "Technology", avatar: "ว", bio: "PhD. Material Science, Chulalongkorn University เชี่ยวชาญ 3D Printing Materials และ Process Engineering", color: "bg-purple-600" },
    { name: "คุณปรียา สุขใจ", role: "Head of Operations", dept: "Operations", avatar: "ป", bio: "MBA บริหารธุรกิจ ประสบการณ์ Supply Chain Management 10 ปี เคยทำงานกับบริษัทผลิตชิ้นส่วนยานยนต์ชั้นนำ", color: "bg-emerald-600" },
];

const departments = [
    { name: "Engineering", count: "8 คน", desc: "วิศวกรผู้เชี่ยวชาญตรวจสอบไฟล์และดูแลกระบวนการพิมพ์", color: "bg-blue-50 text-blue-700" },
    { name: "Production", count: "12 คน", desc: "ทีมควบคุมเครื่องพิมพ์และดูแลกระบวนการผลิต 24 ชั่วโมง", color: "bg-purple-50 text-purple-700" },
    { name: "Quality Control", count: "4 คน", desc: "ตรวจสอบชิ้นงานทุกชิ้นก่อนจัดส่งด้วยมาตรฐาน ISO", color: "bg-green-50 text-green-700" },
    { name: "Customer Success", count: "6 คน", desc: "ดูแลลูกค้าตั้งแต่สั่งจนถึงรับงาน ตอบคำถามแบบ Real-time", color: "bg-amber-50 text-amber-700" },
];

const values = [
    { title: "Transparency", desc: "เราโปร่งใสเรื่องราคา กระบวนการ และสถานะออเดอร์ ลูกค้าเห็นทุกขั้นตอน" },
    { title: "Innovation", desc: "ลงทุนอย่างต่อเนื่องในเครื่องจักรใหม่และกระบวนการที่ดีกว่า" },
    { title: "Customer First", desc: "ความพึงพอใจของลูกค้าคือเป้าหมายสูงสุด ไม่มีข้อยกเว้น" },
];

export default function TeamPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Users className="w-4 h-4" /> เกี่ยวกับเรา
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-6">ทีมงานของเรา</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            ทีมวิศวกร ผู้เชี่ยวชาญด้านวัสดุ และผู้ให้บริการลูกค้าที่พร้อมช่วยทุกโปรเจกต์ของคุณ
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-10">ทีมผู้นำ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {leaders.map((l) => (
                            <div key={l.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                                <div className={`w-24 h-24 rounded-full ${l.color} text-white text-3xl font-black flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                                    {l.avatar}
                                </div>
                                <h3 className="font-black text-slate-900 text-lg">{l.name}</h3>
                                <p className="text-blue-600 font-semibold text-sm mt-1 mb-3">{l.role}</p>
                                <p className="text-slate-500 text-sm leading-relaxed">{l.bio}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">แผนกและทีมงาน</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {departments.map((d) => (
                            <div key={d.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${d.color}`}>{d.name}</span>
                                    <span className="text-xs text-slate-500">{d.count}</span>
                                </div>
                                <p className="text-sm text-slate-600">{d.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">วัฒนธรรมองค์กร</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                        {values.map((v) => (
                            <div key={v.title} className="bg-white rounded-2xl border-l-4 border-blue-600 p-6 shadow-sm">
                                <h3 className="font-black text-blue-700 text-lg mb-2">{v.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/about/careers" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                            ร่วมเป็นส่วนหนึ่งของทีม <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
