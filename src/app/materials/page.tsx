"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import Image from "next/image";
import Link from "next/link";
import { 
    ChevronRight, CheckCircle2, ShieldCheck, Layers, Cpu, Settings, Thermometer,
    Zap, Droplets, Leaf, Shield, Box, Sparkles, AlertCircle, ArrowRight, Truck, CreditCard, HeartHandshake, HeadphonesIcon,
    Home, Car, Puzzle
} from "lucide-react";

export default function MaterialsPage() {
    const [activeTab, setActiveTab] = useState("PLA");

    const tabs = [
        { id: "PLA", name: "PLA", icon: Leaf, color: "text-green-500", bg: "bg-green-50" },
        { id: "ABS", name: "ABS", icon: Shield, color: "text-orange-500", bg: "bg-orange-50" },
        { id: "PETG", name: "PETG", icon: Box, color: "text-blue-500", bg: "bg-blue-50" },
        { id: "TPU", name: "TPU", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-50" },
        { id: "Nylon", name: "Nylon", icon: Layers, color: "text-slate-500", bg: "bg-slate-50" },
        { id: "Resin", name: "Resin", icon: Zap, color: "text-purple-500", bg: "bg-purple-50" },
        { id: "Carbon Fiber", name: "Carbon Fiber", icon: Settings, color: "text-zinc-800", bg: "bg-zinc-100" }
    ];

    const useCases = [
        { title: "Home Decor", desc: "ของตกแต่งบ้าน", img: "/asset/home.png" },
        { title: "Toys & Figures", desc: "ของเล่น & ฟิกเกอร์", img: "/asset/robot.png" },
        { title: "Functional Parts", desc: "ชิ้นส่วนการใช้งาน", img: "/asset/automotive-parts.png" },
        { title: "Cosplay & Props", desc: "คอสเพลย์ & พร็อพ", img: "/asset/Cosplay.png" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-500/30">
            <Navbar />
            
            <div className="flex-1">
                {/* 1. Hero Section */}
                <section className="relative overflow-hidden bg-[#0a0f25] pt-24 pb-16 lg:pt-32 lg:pb-16">
                    {/* Background Image */}
                    <Image
                        src="/covermat.png"
                        alt="Materials Background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            {/* Left Content */}
                            <div className="w-full lg:w-[55%]">
                                <div className="text-blue-400 text-xs font-black tracking-widest uppercase mb-4">
                                    MATERIAL LIBRARY
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-6 tracking-tight">
                                    เลือกวัสดุที่ใช่<br/>
                                    <span className="text-blue-500">สำหรับทุกโปรเจกต์</span>
                                </h1>
                                <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed font-light">
                                    รวบรวมวัสดุคุณภาพสูงสำหรับงานพิมพ์ 3D ครบทุกประเภท เลือกง่าย ได้งานสวย ตอบโจทย์ทุกความต้องการ
                                </p>
                                
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-blue-600/30 mb-10 flex items-center gap-2">
                                    Compare Materials <ChevronRight className="w-4 h-4" />
                                </button>

                                {/* Features */}
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                            <ShieldCheck className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Premium Quality</div>
                                            <div className="text-slate-400 text-xs">วัสดุคุณภาพสูง</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                            <Layers className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Wide Selection</div>
                                            <div className="text-slate-400 text-xs">เลือกได้หลากหลาย</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                            <HeadphonesIcon className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Technical Support</div>
                                            <div className="text-slate-400 text-xs">ทีมงานพร้อมให้คำแนะนำ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Tabs */}
                <section className="py-6 border-b border-slate-100 bg-white sticky top-[72px] z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2">
                            {tabs.map((tab) => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full whitespace-nowrap transition-all border ${
                                        activeTab === tab.id 
                                            ? `bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm` 
                                            : `bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300`
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tab.bg}`}>
                                        <tab.icon className={`w-3.5 h-3.5 ${tab.color}`} />
                                    </div>
                                    {tab.name}
                                </button>
                            ))}
                            <button className="flex items-center gap-2.5 px-6 py-2.5 rounded-full whitespace-nowrap transition-all border bg-slate-50 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 ml-auto">
                                <Layers className="w-4 h-4" /> View All
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. Material Detail Card */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="bg-[#f0f4f8] rounded-[2.5rem] border border-white p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                            {/* Background Image */}
                            <Image 
                                src="/pla.png" 
                                alt="PLA Material" 
                                fill 
                                className="object-cover object-center pointer-events-none" 
                            />
                            
                            {/* Abstract background blobs (overlay) removed */}

                            <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                                {/* Left Content: Text + Thumbnails */}
                                <div className="w-full lg:w-[60%] flex flex-col justify-between">
                                    <div className="max-w-md">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-50">
                                            <Leaf className="w-6 h-6 text-green-500" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">PLA (Polylactic Acid)</h2>
                                        <p className="text-slate-600 mb-6 leading-relaxed font-medium">
                                            วัสดุยอดนิยม พิมพ์ง่าย เป็นมิตรกับสิ่งแวดล้อม เหมาะสำหรับงานโมเดลทั่วไปที่ไม่ได้ต้องการความทนทานสูง
                                        </p>
                                        
                                        <ul className="space-y-3 mb-8">
                                            {["พิมพ์ง่าย", "ผิวสวย ไม่มีบิดงอ", "เหมาะสำหรับงานตกแต่งและต้นแบบ", "เป็นมิตรต่อสิ่งแวดล้อม"].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                                    <span className="text-sm font-bold text-slate-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-full transition-all w-fit flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5">
                                            ดูรายละเอียด <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Thumbnails row at the bottom */}
                                    <div className="flex gap-4 mt-12 lg:mt-16 z-20">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-24 h-24 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer group">
                                                {/* Placeholder for the green object image */}
                                                <div className="w-16 h-16 bg-gradient-to-tr from-green-100 to-green-50 rounded-xl group-hover:from-green-200 transition-colors flex items-center justify-center">
                                                    <Box className="w-8 h-8 text-green-500/50" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Content: Properties Card */}
                                <div className="w-full lg:w-[40%] flex justify-end relative z-20">
                                    <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                                        <h3 className="text-xl font-black text-slate-900 mb-8">Material Properties</h3>
                                        
                                        <div className="space-y-6 mb-10">
                                            {[
                                                { label: "ความแข็งแรง", sub: "(Strength)", val: 4, icon: Shield },
                                                { label: "ทนความร้อน", sub: "(Heat Resistance)", val: 2, icon: Thermometer },
                                                { label: "ความยืดหยุ่น", sub: "(Flexibility)", val: 2, icon: Sparkles },
                                                { label: "ทนต่อแรงกระแทก", sub: "(Impact Resistance)", val: 3, icon: AlertCircle },
                                                { label: "การใช้งานภายนอก", sub: "(Outdoor Durability)", val: 2, icon: Home },
                                                { label: "ความง่ายในการพิมพ์", sub: "(Printability)", val: 5, icon: Settings },
                                            ].map((prop, i) => (
                                                <div key={i}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <prop.icon className="w-4 h-4 text-slate-500" />
                                                            <span className="text-xs font-bold text-slate-900">{prop.label} <span className="text-slate-400 font-medium">{prop.sub}</span></span>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-900">{prop.val}/5</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full" style={{ width: `${(prop.val/5)*100}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 text-center">
                                            <div>
                                                <div className="text-[10px] text-slate-500 mb-1 font-semibold">Nozzle Temp.</div>
                                                <div className="text-sm font-black text-slate-900">190-220°C</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-500 mb-1 font-semibold">Bed Temp.</div>
                                                <div className="text-sm font-black text-slate-900">50-60°C</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-500 mb-1 font-semibold">Cooling</div>
                                                <div className="text-sm font-black text-slate-900">เปิดพัดลม</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Comparison Table */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900">เปรียบเทียบวัสดุ</h2>
                            <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors border border-blue-100">
                                <Box className="w-4 h-4" /> ดูตารางเปรียบเทียบแบบเต็ม <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-x-auto hide-scrollbar rounded-3xl border border-slate-200">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-5">คุณสมบัติ</th>
                                        <th className="px-6 py-5 text-center"><div className="flex items-center justify-center gap-2"><Leaf className="w-4 h-4 text-green-500"/> PLA</div></th>
                                        <th className="px-6 py-5 text-center"><div className="flex items-center justify-center gap-2"><Shield className="w-4 h-4 text-blue-500"/> ABS</div></th>
                                        <th className="px-6 py-5 text-center"><div className="flex items-center justify-center gap-2"><Box className="w-4 h-4 text-orange-500"/> PETG</div></th>
                                        <th className="px-6 py-5 text-center"><div className="flex items-center justify-center gap-2"><Droplets className="w-4 h-4 text-purple-500"/> TPU</div></th>
                                        <th className="px-6 py-5 text-center"><div className="flex items-center justify-center gap-2"><Layers className="w-4 h-4 text-slate-600"/> Nylon</div></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white text-center font-medium">
                                    <tr>
                                        <td className="px-6 py-4 text-left text-slate-500 font-semibold">ความแข็งแรง</td>
                                        <td className="px-6 py-4 text-amber-400">★★★★☆</td>
                                        <td className="px-6 py-4 text-amber-400">★★★★★</td>
                                        <td className="px-6 py-4 text-amber-400">★★★★☆</td>
                                        <td className="px-6 py-4 text-amber-400">★★★☆☆</td>
                                        <td className="px-6 py-4 text-amber-400">★★★★★</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-left text-slate-500 font-semibold">ทนความร้อน</td>
                                        <td className="px-6 py-4 text-slate-700">60°C</td>
                                        <td className="px-6 py-4 text-slate-700">100°C</td>
                                        <td className="px-6 py-4 text-slate-700">80°C</td>
                                        <td className="px-6 py-4 text-slate-700">60°C</td>
                                        <td className="px-6 py-4 text-slate-700">120°C</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-left text-slate-500 font-semibold">ความยืดหยุ่น</td>
                                        <td className="px-6 py-4 text-slate-700">ต่ำ</td>
                                        <td className="px-6 py-4 text-slate-700">ต่ำ</td>
                                        <td className="px-6 py-4 text-slate-700">ปานกลาง</td>
                                        <td className="px-6 py-4 text-slate-700">สูง</td>
                                        <td className="px-6 py-4 text-slate-700">ปานกลาง</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-left text-slate-500 font-semibold">ความง่ายในการพิมพ์</td>
                                        <td className="px-6 py-4 text-green-600 font-bold">ง่ายมาก</td>
                                        <td className="px-6 py-4 text-slate-700">ปานกลาง</td>
                                        <td className="px-6 py-4 text-slate-700">ง่าย</td>
                                        <td className="px-6 py-4 text-red-500 font-bold">ยาก</td>
                                        <td className="px-6 py-4 text-red-500 font-bold">ยาก</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-left text-slate-500 font-semibold">การใช้งาน</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs flex flex-col items-center gap-1 justify-center"><Puzzle className="w-5 h-5"/> ต้นแบบ, ของตกแต่ง</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs"><div className="flex flex-col items-center gap-1 justify-center"><Settings className="w-5 h-5"/> ชิ้นส่วนที่รับแรง</div></td>
                                        <td className="px-6 py-4 text-slate-500 text-xs"><div className="flex flex-col items-center gap-1 justify-center"><Box className="w-5 h-5"/> ชิ้นส่วนใช้งานทั่วไป</div></td>
                                        <td className="px-6 py-4 text-slate-500 text-xs"><div className="flex flex-col items-center gap-1 justify-center"><Car className="w-5 h-5"/> ยาง, ซีล, กันกระแทก</div></td>
                                        <td className="px-6 py-4 text-slate-500 text-xs"><div className="flex flex-col items-center gap-1 justify-center"><Cpu className="w-5 h-5"/> ชิ้นส่วนวิศวกรรม</div></td>
                                    </tr>
                                    <tr className="bg-slate-50 font-black">
                                        <td className="px-6 py-4 text-left text-slate-500 font-semibold">ราคา</td>
                                        <td className="px-6 py-4 text-green-600">$</td>
                                        <td className="px-6 py-4 text-slate-700">$$</td>
                                        <td className="px-6 py-4 text-green-600">$$</td>
                                        <td className="px-6 py-4 text-slate-700">$$$</td>
                                        <td className="px-6 py-4 text-slate-700">$$$</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 5. Use Cases */}
                <section className="py-16 bg-white border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">ไอเดียการใช้งาน</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {useCases.map((uc, i) => (
                                <div key={i} className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-pointer text-center flex flex-col">
                                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative mb-6">
                                        <Image src={uc.img} alt={uc.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h3 className="font-black text-lg text-slate-900 mb-1">{uc.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{uc.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. FAQ / Consultation */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
                        <div className="w-full lg:w-1/3">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                                ยังไม่แน่ใจ<br/>ควรเลือกวัสดุอะไร?
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                ทีมงานผู้เชี่ยวชาญพร้อมให้คำแนะนำ เพื่อช่วยให้คุณเลือกวัสดุที่เหมาะสมกับงานของคุณที่สุด
                            </p>
                            <Link href="/support" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full transition-colors shadow-lg shadow-blue-600/30">
                                ปรึกษาผู้เชี่ยวชาญฟรี <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="w-full lg:w-2/3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-900">คำถามที่พบบ่อย</h3>
                                <Link href="/support/faq" className="text-sm font-bold text-blue-600 hover:underline">ดูทั้งหมด</Link>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "PLA แตกต่างจาก ABS อย่างไร?",
                                    "PETG ดีกว่า PLA ยังไง?",
                                    "TPU เหมาะกับงานแบบไหน?",
                                    "วัสดุไหนเหมาะกับงานภายนอก?",
                                    "จะเลือกวัสดุอย่างไรให้เหมาะกับงานของฉัน?"
                                ].map((q, i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors">
                                        <span className="font-bold text-slate-700 text-sm">{q}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Footer Features */}
                <section className="py-10 bg-white border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="flex items-center gap-4">
                                <Truck className="w-6 h-6 text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Fast Delivery</div>
                                    <div className="text-xs text-slate-500">จัดส่งรวดเร็ว</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <CreditCard className="w-6 h-6 text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Secure Payment</div>
                                    <div className="text-xs text-slate-500">ชำระเงินปลอดภัย</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <HeartHandshake className="w-6 h-6 text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">Satisfaction Guarantee</div>
                                    <div className="text-xs text-slate-500">รับประกันความพึงพอใจ</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <HeadphonesIcon className="w-6 h-6 text-slate-400" />
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">24/7 Support</div>
                                    <div className="text-xs text-slate-500">บริการช่วยเหลือ 24 ชม.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            
            <Footer />
        </div>
    );
}
