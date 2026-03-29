"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    UploadCloud,
    Settings2,
    Printer,
    Truck,
    Layers,
    Cpu,
    Zap,
    CheckCircle2,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Globe,
    Mail,
    Phone,
    ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// --- Section 1: Technologies ---
export function TechSection() {
    const techs = [
        {
            title: "FDM Printing",
            subtitle: "Fused Deposition Modeling",
            description: "เหมาะสำหรับชิ้นงานต้นแบบ (Prototyping) ชิ้นส่วนกลไก และงานขนาดใหญ่ที่ต้องการความประหยัด",
            features: ["ราคาถูกที่สุด", "วัสดุหลากหลาย (PLA, ABS, PETG)", "ชิ้นงานแข็งแรงทนทาน"],
            icon: <Layers className="h-8 w-8 text-blue-500" />,
            color: "blue"
        },
        {
            title: "SLA Resin",
            subtitle: "Stereolithography",
            description: "เหมาะสำหรับงานที่ต้องการความละเอียดสูง พื้นผิวเรียบเนียน เช่น โมเดลฟิกเกอร์ หรืออัญมณี",
            features: ["ความละเอียดสูงมาก (Micron level)", "พื้นผิวเนียนเรียบ", "รองรับเรซิ่นวิศวกรรมเฉพาะทาง"],
            icon: <Cpu className="h-8 w-8 text-purple-500" />,
            color: "purple"
        }
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl mb-4">เทคโนโลยีที่รองรับ</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        เราใช้เครื่องพิมพ์ 3 มิติระดับอุตสาหกรรม เพื่อให้แน่ใจว่างานทุกชิ้นมีคุณภาพสูงสุด
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {techs.map((tech) => (
                        <Card key={tech.title} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4">
                                    <div className={`p-4 rounded-2xl bg-${tech.color}-50`}>
                                        {tech.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">{tech.title}</h3>
                                        <p className="text-sm text-blue-600 font-medium mb-4">{tech.subtitle}</p>
                                        <p className="text-slate-600 mb-6 leading-relaxed">
                                            {tech.description}
                                        </p>
                                        <ul className="space-y-3">
                                            {tech.features.map((f) => (
                                                <li key={f} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Section 2: How It Works ---
export function HowItWorks() {
    const steps = [
        {
            title: "อัปโหลดไฟล์ 3D",
            desc: "รองรับไฟล์ .STL, .OBJ, .STEP ระบบจะตรวจสอบและซ่อมแซมวิเคราะห์ความสมบูรณ์ให้แบบอัตโนมัติ",
            icon: <UploadCloud className="h-6 w-6 text-blue-600" />,
            color: "blue",
            delay: "0"
        },
        {
            title: "เลือกวัสดุและสี",
            desc: "เลือกวัสดุที่เหมาะสม ทั้งเรซิ่น ไนลอน โลหะ และเปรียบเทียบราคาแบบเรียลไทม์",
            icon: <Settings2 className="h-6 w-6 text-indigo-600" />,
            color: "indigo",
            delay: "100"
        },
        {
            title: "สั่งพิมพ์ระดับอุตสาหกรรม",
            desc: "วิศวกรตรวจสอบไฟล์และเริ่มการพิมพ์ด้วยเครื่องจักร High-end มาตรฐานสากล",
            icon: <Printer className="h-6 w-6 text-violet-600" />,
            color: "violet",
            delay: "200"
        },
        {
            title: "จัดส่งรวดเร็วถึงมือคุณ",
            desc: "ผ่านกระบวนการ QC อย่างเข้มงวด บรรจุให้อย่างดี และจัดส่งตรงเวลา",
            icon: <Truck className="h-6 w-6 text-sky-600" />,
            color: "sky",
            delay: "300"
        }
    ];

    return (
        <section className="py-28 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 w-full max-w-7xl -translate-x-1/2 h-full opacity-50 pointer-events-none">
                <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-300/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-indigo-300/20 blur-[120px] rounded-full" />
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100/60 border border-blue-200/60 mb-6 backdrop-blur-sm">
                        <span className="text-[11px] font-black text-blue-700 tracking-[0.2em] uppercase">Workflow</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 md:text-5xl mb-6 tracking-tight leading-tight">
                        ขั้นตอนการสั่งพิมพ์ที่ง่าย<br className="hidden md:block" />
                        <span className="text-blue-600 drop-shadow-sm">และเป็นมืออาชีพ</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        เราเปลี่ยนกระบวนการผลิตงานอุตสาหกรรมที่ซับซ้อน ให้กลายเป็นเรื่องง่ายด้วยระบบแพลตฟอร์มอัตโนมัติของเรา
                    </p>
                </div>

                <div className="relative mt-10">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden lg:block absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group" style={{ transitionDelay: `${step.delay}ms` }}>
                                {/* Step Content */}
                                <div className="flex flex-col items-center text-center relative z-10">
                                    
                                    {/* Icon Box */}
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-blue-100">
                                            <div className={`w-14 h-14 rounded-2xl bg-${step.color}-50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                                                {step.icon}
                                            </div>
                                        </div>
                                        
                                        {/* Step Number Badge */}
                                        <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-${step.color}-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-${step.color}-300 border-2 border-white transform transition-transform duration-300 group-hover:scale-110`}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div className="bg-white/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-2xl border border-white/50 md:border-none">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-blue-600">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Section 3: Footer ---
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0f172a] text-slate-300 pt-20 pb-10 border-t border-slate-800">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
                {/* Top Section: Newsletter & Branding */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-slate-800/60">
                    <div className="lg:col-span-5">
                        <div className="mb-6">
                            <Image
                                src="/logo/3devwhite.png"
                                alt="3DEV Logo"
                                width={140}
                                height={44}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
                            ผู้นำแพลตฟอร์มการผลิตและพิมพ์ 3 มิติระดับสากล ให้บริการด้วยมาตรฐานอุตสาหกรรม (Industrial Grade) เพื่อเปลี่ยนทุกไอเดียของคุณให้กลายเป็นชิ้นงานจริงได้อย่างรวดเร็วและแม่นยำ
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Youtube className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-800/60 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-white text-lg font-bold mb-2">ติดตามข่าวสารและสิทธิพิเศษ</h3>
                                <p className="text-sm text-slate-400">ลงทะเบียนเพื่อรับข่าวสารด้านเทคโนโลยีการผลิตจากเรา</p>
                            </div>
                            <div className="flex w-full xl:w-auto">
                                <input
                                    type="email"
                                    placeholder="กรอกอีเมลของคุณ"
                                    className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-sm w-full xl:w-64"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg font-medium transition-colors flex items-center shrink-0">
                                    ติดตาม <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                    <div className="col-span-2 lg:col-span-1">
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Global Presence</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 hover:text-white cursor-pointer transition-colors">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span>Thailand (TH/EN)</span>
                        </div>
                        <div className="space-y-3 mt-8">
                            <h4 className="text-white font-bold tracking-wide text-sm uppercase mb-4">Contact</h4>
                            <a href="mailto:info@3dev.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                <Mail className="w-4 h-4" /> info@3dev.com
                            </a>
                            <a href="tel:+6621234567" className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                <Phone className="w-4 h-4" /> +66 2 123 4567
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">บริการ (Services)</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">พิมพ์ 3 มิติ (3D Printing)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">งานกัด CNC (CNC Machining)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">พับโลหะ (Sheet Metal)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">ประกอบวงจร (PCB/PCBA)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">เทคโนโลยีใหม่ๆ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">วัสดุ (Materials)</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Industrial Resin (SLA)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Nylon (SLS/MJF)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Stainless Steel (SLM)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Standard Plastic (FDM)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">คู่มือเปรียบเทียบวัสดุ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">แหล่งเรียนรู้</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">คู่มือการออกแบบ 3D</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">เกณฑ์การอัปโหลดไฟล์</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">บทความ (Blog)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">กรณีศึกษา (Case Studies)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">ศูนย์ช่วยเหลือ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">เกี่ยวกับองค์กร</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">เกี่ยวกับ 3DEV</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">โรงงานและเทคโนโลยี</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">ร่วมงานกับเรา (Careers)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">ความยั่งยืน (Sustainability)</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">ติดต่อเรา</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-slate-500">
                        © {currentYear} PDM 3D Print Thailand. สงวนลิขสิทธิ์
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-bold">
                        <Link href="/privacy" className="hover:text-blue-400 transition-colors">นโยบายความเป็นส่วนตัว</Link>
                        <Link href="/terms" className="hover:text-blue-400 transition-colors">ข้อกำหนดการให้บริการ</Link>
                        <Link href="/cookies" className="hover:text-blue-400 transition-colors">นโยบายคุกกี้</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
