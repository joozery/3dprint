"use client";

import Navbar from "@/components/layout/Navbar";
import { Box, Droplets, FlaskConical, Link2 } from "lucide-react";
import Link from "next/link";

export default function MaterialsPage() {
    const materials = [
        {
            title: "PLA (Polylactic Acid)",
            tech: "FDM",
            desc: "วัสดุยอดนิยม พิมพ์ง่าย เป็นมิตรกับสิ่งแวดล้อม เหมาะสำหรับงานโมเดลทั่วไปที่ไม่ได้ใช้งานในอุณหภูมิสูง",
            icon: <Box className="w-8 h-8 text-green-500" />
        },
        {
            title: "ABS / PETG",
            tech: "FDM",
            desc: "ทนความร้อนและแรงกระแทกได้ดีกว่า PLA เหมาะสำหรับชิ้นงานที่ต้องการนำไปใช้งานจริง (Functional Parts)",
            icon: <Link2 className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Standard Resin",
            tech: "SLA",
            desc: "เรซิ่นมาตรฐาน ให้รายละเอียดและพื้นผิวที่เนียนกริบ เหมาะสำหรับงานฟิกเกอร์และเครื่องประดับ",
            icon: <Droplets className="w-8 h-8 text-purple-500" />
        },
        {
            title: "Engineering Resin",
            tech: "SLA",
            desc: "เรซิ่นวิศวกรรม ทนทานและยืดหยุ่นสูง เหมาะสำหรับชิ้นส่วนข้อต่อ หรืองานที่ต้องรับแรง",
            icon: <FlaskConical className="w-8 h-8 text-orange-500" />
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-6">วัสดุการพิมพ์ (Materials)</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            เลือกวัสดุที่ใช่สำหรับงานของคุณ เรามีวัสดุคุณภาพสูงให้เลือกหลากหลายประเภท ครอบคลุมตั้งแต่งานอดิเรกไปจนถึงงานอุตสาหกรรม
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {materials.map((mat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-5">
                                    {mat.icon}
                                </div>
                                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded mb-3">{mat.tech}</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{mat.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{mat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center border-t border-slate-200 pt-16">
                        <h2 className="text-2xl font-bold mb-4">ไม่แน่ใจว่าควรใช้วัสดุไหน?</h2>
                        <p className="text-slate-500 mb-6">ทีมวิศวกรของเราพร้อมให้คำปรึกษาเพื่อเลือกวัสดุที่เหมาะสมกับโปรเจกต์ของคุณที่สุด</p>
                        <Link href="/support" className="inline-flex items-center justify-center bg-blue-50 text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors">
                            ติดต่อฝ่ายสนับสนุน
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
