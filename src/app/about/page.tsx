"use client";

import Navbar from "@/components/layout/Navbar";
import { Building, Users, Target, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                {/* Hero */}
                <div className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
                    <div className="absolute top-0 right-0 opacity-10">
                        {/* Background pattern or 3D shape illustration could go here */}
                    </div>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4 block">About PDM</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            เปลี่ยนไอเดียของคุณ<br/>ให้เป็นความจริง
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            เราคือผู้เชี่ยวชาญด้านเทคโนโลยี 3D Printing ที่มุ่งมั่นยกระดับวงการผลิตของไทย ด้วยบริการที่รวดเร็ว แม่นยำ และเข้าถึงได้ง่ายที่สุด
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">ทำไมต้องเลือกเรา?</h2>
                        <p className="text-slate-500 mt-4">มาตรฐานที่เรายึดมั่นในการให้บริการลูกค้าทุกคน</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">คุณภาพสูงสุด</h3>
                            <p className="text-slate-500 leading-relaxed">เราใช้เครื่องพิมพ์ระดับอุตสาหกรรม (Industrial Grade) เพื่อให้ได้ชิ้นงานที่สมบูรณ์แบบที่สุด</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">ทีมวิศวกรผู้เชี่ยวชาญ</h3>
                            <p className="text-slate-500 leading-relaxed">เรามีวิศวกรคอยตรวจสอบไฟล์และให้คำปรึกษา เพื่อให้งานพิมพ์ออกมาใช้งานได้จริง</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">ปลอดภัยและเป็นความลับ</h3>
                            <p className="text-slate-500 leading-relaxed">ไฟล์โมเดลทุกชิ้นของคุณจะถูกเก็บรักษาอย่างดี และไม่มีการนำไปใช้หรือเผยแพร่โดยเด็ดขาด</p>
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                <div className="bg-white border-t border-slate-200 py-20 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-black text-slate-900">เกี่ยวกับ PDM PRO</h2>
                            <p className="text-slate-500 leading-relaxed text-lg">
                                PrintMyDesign (PDM) ก่อตั้งขึ้นด้วยวิสัยทัศน์ที่จะทำให้ทุกคนสามารถเข้าถึงเทคโนโลยี 3D Printing ได้อย่างง่ายดายผ่านแพลตฟอร์มออนไลน์ที่ประเมินราคาได้ทันที
                            </p>
                            <p className="text-slate-500 leading-relaxed">
                                ไม่ว่าคุณจะเป็นนักศึกษา นักออกแบบ วิศวกร หรือองค์กรขนาดใหญ่ เราพร้อมเป็นพาร์ทเนอร์ในการผลิตชิ้นงานให้กับคุณ
                            </p>
                            <div className="pt-4 flex items-center gap-4">
                                <Building className="text-slate-400 w-6 h-6" />
                                <div>
                                    <p className="font-bold text-slate-900">บริษัท ปริ้นมายดีไซน์ จำกัด</p>
                                    <p className="text-sm text-slate-500">กรุงเทพมหานคร, ประเทศไทย</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative h-[400px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                            {/* In a real scenario, this would be an actual company image */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 flex-col gap-4">
                                <Building className="w-20 h-20" />
                                <span className="font-bold tracking-widest uppercase">PDM Headquarters</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
