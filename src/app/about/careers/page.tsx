"use client";

import Navbar from "@/components/layout/Navbar";
import { Briefcase, ArrowRight, MapPin, Clock } from "lucide-react";

const perks = [
    { emoji: "💰", title: "เงินเดือนแข่งขันได้", desc: "ให้ผลตอบแทนสูงกว่าตลาดโดยเฉลี่ย 15-20% พร้อม Performance Bonus" },
    { emoji: "🏠", title: "WFH บางส่วน", desc: "ยืดหยุ่นทำงานจากที่บ้านได้ 2-3 วัน/สัปดาห์ ขึ้นอยู่กับตำแหน่ง" },
    { emoji: "🚀", title: "เติบโตเร็ว", desc: "Startup ที่กำลังขยายตัว ทุกคนมีโอกาสรับผิดชอบงานสำคัญตั้งแต่วันแรก" },
    { emoji: "🤝", title: "ทีมเล็ก ทำงานจริง", desc: "ไม่มี Politics ทุกคน Contribute ได้อย่างเต็มที่ เสียงทุกคนถูกได้ยิน" },
];

const jobs = [
    {
        title: "Frontend Developer",
        stack: "React / Next.js / TypeScript",
        type: "Full-time",
        location: "กรุงเทพฯ / Remote บางส่วน",
        salary: "฿50,000 – ฿80,000",
        color: "border-blue-200",
        badge: "bg-blue-100 text-blue-700",
        desc: "พัฒนา UI/UX ของแพลตฟอร์ม 3D Printing ออนไลน์ ทำงานร่วมกับ Designer และ Backend ทีมขนาดเล็กที่ Move Fast",
    },
    {
        title: "Production Engineer (3D Printing)",
        stack: "3D Printing, CAD, Quality Control",
        type: "Full-time",
        location: "กรุงเทพฯ (On-site)",
        salary: "฿35,000 – ฿55,000",
        color: "border-purple-200",
        badge: "bg-purple-100 text-purple-700",
        desc: "ดูแลและควบคุมเครื่องพิมพ์ 3D ตรวจสอบคุณภาพไฟล์ก่อนพิมพ์ และพัฒนากระบวนการผลิต",
    },
    {
        title: "Customer Success Specialist",
        stack: "Customer Service, CRM",
        type: "Full-time / Part-time",
        location: "กรุงเทพฯ / Remote",
        salary: "฿25,000 – ฿40,000",
        color: "border-green-200",
        badge: "bg-green-100 text-green-700",
        desc: "ดูแลลูกค้าตั้งแต่สั่งจนรับงาน ตอบคำถามทาง Chat/Email แก้ปัญหาและสร้างความพึงพอใจสูงสุด",
    },
    {
        title: "UI/UX Designer",
        stack: "Figma, Prototyping, Design System",
        type: "Full-time",
        location: "กรุงเทพฯ / WFH",
        salary: "฿45,000 – ฿70,000",
        color: "border-pink-200",
        badge: "bg-pink-100 text-pink-700",
        desc: "ออกแบบประสบการณ์ผู้ใช้สำหรับแพลตฟอร์ม B2B Manufacturing สร้าง Design System และ Prototype",
    },
];

const processSteps = [
    { num: "01", label: "ส่ง CV", desc: "ส่งมาทาง Email" },
    { num: "02", label: "สัมภาษณ์รอบแรก", desc: "Online 30 นาที" },
    { num: "03", label: "Technical Test", desc: "Take-home assignment" },
    { num: "04", label: "ยื่นข้อเสนอ", desc: "ภายใน 3 วัน" },
];

export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Briefcase className="w-4 h-4" /> เกี่ยวกับเรา
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-6">ร่วมงานกับ PDM</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            มาสร้างอนาคตของการผลิต 3D ร่วมกัน เรามองหาคนที่มีความกระตือรือร้น ชอบ Problem-solving และอยากเติบโตไปพร้อมกัน
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-10">ทำไมต้องมาร่วมงานกับเรา</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-16">
                        {perks.map((p) => (
                            <div key={p.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                                <div className="text-4xl mb-4">{p.emoji}</div>
                                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                                <p className="text-sm text-slate-500">{p.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">ตำแหน่งที่เปิดรับ</h2>
                    <div className="space-y-4 mb-16">
                        {jobs.map((job) => (
                            <div key={job.title} className={`bg-white rounded-2xl border-2 p-6 shadow-sm ${job.color}`}>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <h3 className="font-black text-slate-900 text-lg">{job.title}</h3>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${job.badge}`}>{job.type}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">{job.stack}</p>
                                        <div className="flex flex-wrap gap-3 mb-3">
                                            <span className="flex items-center gap-1 text-xs text-slate-600"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                            <span className="flex items-center gap-1 text-xs text-slate-600"><Clock className="w-3.5 h-3.5" /> {job.salary}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{job.desc}</p>
                                    </div>
                                    <a href={`mailto:hr@pdmpro.co.th?subject=สมัครงาน: ${job.title}`} className="inline-flex items-center gap-2 border border-blue-300 text-blue-600 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm shrink-0">
                                        สมัครงาน <ArrowRight className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">ขั้นตอนการสมัคร</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
                        {processSteps.map((s) => (
                            <div key={s.num} className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white text-lg font-black flex items-center justify-center mx-auto mb-3">{s.num}</div>
                                <p className="font-bold text-slate-800 text-sm">{s.label}</p>
                                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-8 text-center">
                        <p className="font-bold text-blue-900 mb-2">ไม่เห็นตำแหน่งที่ใช่?</p>
                        <p className="text-sm text-blue-700 mb-4">ส่ง CV มาที่ <strong>hr@pdmpro.co.th</strong> เราเก็บไว้พิจารณาเสมอ</p>
                        <a href="mailto:hr@pdmpro.co.th" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm">
                            ส่ง CV Unsolicited <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
