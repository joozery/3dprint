"use client";

import Navbar from "@/components/layout/Navbar";
import { Download, Search, Box } from "lucide-react";

export default function ModelsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-black mb-6">คลังโมเดล 3D ฟรี</h1>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                            ดาวน์โหลดไฟล์ 3D (STL, OBJ) ฟรี เพื่อนำไปพิมพ์ หรือใช้เป็นไอเดียสร้างแรงบันดาลใจ เรารวบรวมโมเดลที่ผ่านการทดสอบแล้วว่าพิมพ์ได้จริง
                        </p>
                        
                        <div className="relative max-w-2xl mx-auto">
                            <input 
                                type="text" 
                                placeholder="ค้นหาโมเดล เช่น กระถางต้นไม้, ของเล่น, กล่อง..." 
                                className="w-full px-6 py-4 rounded-full text-slate-900 outline-none pr-16"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 w-12 rounded-full flex items-center justify-center transition-colors">
                                <Search className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Box className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-2">กำลังอัปเดตฐานข้อมูลโมเดล</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        เรากำลังรวบรวมและตรวจสอบโมเดล 3 มิติกว่า 1,000 ชิ้น เพื่อให้แน่ใจว่าทุกชิ้นสามารถพิมพ์ได้จริง แวะกลับมาใหม่เร็วๆ นี้นะครับ!
                    </p>
                    <button className="bg-slate-200 text-slate-500 font-bold px-6 py-3 rounded-full cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    );
}
