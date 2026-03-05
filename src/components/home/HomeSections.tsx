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
            title: "อัปโหลดโมเดล",
            desc: "รองรับไฟล์ .STL, .OBJ, .STEP ระบบจะตรวจสอบความสมบูรณ์อัตโนมัติ",
            icon: <UploadCloud className="h-6 w-6" />,
            color: "bg-blue-500"
        },
        {
            title: "ระบุข้อกำหนด",
            desc: "เลือกวัสดุ, สี และความละเอียดที่ต้องการ เพื่อรับราคาทันที",
            icon: <Settings2 className="h-6 w-6" />,
            color: "bg-cyan-500"
        },
        {
            title: "เริ่มการผลิต",
            desc: "Admin ยืนยันไฟล์งาน และส่งเข้าคิวพิมพ์ด้วยเครื่องระดับโปร",
            icon: <Printer className="h-6 w-6" />,
            color: "bg-indigo-500"
        },
        {
            title: "จัดส่งถึงมือ",
            desc: "บรรจุอย่างดี พร้อมส่งผ่าน Flash, DHL หรือ FedEx ทั่วโลก",
            icon: <Truck className="h-6 w-6" />,
            color: "bg-blue-600"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                    <div className="max-w-xl">
                        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-none mb-4">FLOW</Badge>
                        <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">ขั้นตอนการสั่งพิมพ์</h2>
                    </div>
                    <p className="text-slate-500 max-w-md">
                        สั่งงานง่ายๆ ภายในไม่กี่นาที ด้วยระบบคำนวณราคาอัตโนมัติที่เราพัฒนาขึ้นมาโดยเฉพาะ
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connector line (desktop only) */}
                    <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-slate-100 -z-10" />

                    {steps.map((step, idx) => (
                        <div key={step.title} className="flex flex-col items-center text-center">
                            <div className={`h-16 w-16 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-lg mb-6 relative`}>
                                <span className="absolute -top-3 -left-3 h-7 w-7 rounded-full bg-white text-slate-900 text-xs font-bold flex items-center justify-center border shadow-sm">
                                    {idx + 1}
                                </span>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed leading-relaxed px-4">
                                {step.desc}
                            </p>
                        </div>
                    ))}
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
                        © {currentYear} 3DEV Corporation. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
