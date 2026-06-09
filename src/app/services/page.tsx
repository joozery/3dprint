"use client";

import Navbar from "@/components/layout/Navbar";
import { Layers, Printer, PenTool, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
    const services = [
        {
            title: "FDM (แบบเส้น)",
            description: "เทคโนโลยีการพิมพ์แบบฉีดเส้นพลาสติก เหมาะสำหรับงานต้นแบบ โครงสร้างที่ต้องการความแข็งแรง และชิ้นงานขนาดใหญ่",
            icon: <Printer className="w-10 h-10 text-blue-500" />
        },
        {
            title: "SLA (เรซิ่น)",
            description: "การพิมพ์ด้วยเรซิ่นเหลวที่ให้ความละเอียดสูงมาก เหมาะสำหรับงานโมเดล เครื่องประดับ และชิ้นงานที่ต้องการพื้นผิวเรียบเนียน",
            icon: <Layers className="w-10 h-10 text-purple-500" />
        },
        {
            title: "บริการพ่นสีและขัดผิว",
            description: "บริการหลังการพิมพ์เพื่อเพิ่มความสวยงามให้กับชิ้นงานของคุณ ไม่ว่าจะเป็นการขัดผิวเรียบ การลงสีรองพื้น หรือการพ่นสีตามที่ต้องการ",
            icon: <PenTool className="w-10 h-10 text-orange-500" />
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                {/* Hero Section */}
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-6">บริการพิมพ์ 3 มิติของเรา</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            เราให้บริการพิมพ์ 3 มิติด้วยเทคโนโลยีที่หลากหลาย เพื่อตอบสนองทุกความต้องการของคุณ ตั้งแต่งานต้นแบบไปจนถึงชิ้นงานที่นำไปใช้งานจริง
                        </p>
                    </div>
                </div>

                {/* Services List */}
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                <p className="text-slate-500 leading-relaxed mb-6">
                                    {service.description}
                                </p>
                                <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                    ดูรายละเอียด <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 bg-blue-600 rounded-3xl p-10 text-center text-white">
                        <h2 className="text-2xl font-black mb-4">พร้อมเริ่มต้นโปรเจกต์ของคุณหรือยัง?</h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto">อัปโหลดไฟล์ 3D ของคุณเพื่อประเมินราคาอัตโนมัติได้ทันทีตลอด 24 ชั่วโมง</p>
                        <Link href="/quote" className="inline-flex items-center justify-center bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-slate-50 transition-colors shadow-lg">
                            อัปโหลดไฟล์ 3D เลย
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
