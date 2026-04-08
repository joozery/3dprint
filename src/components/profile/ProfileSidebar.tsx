"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  FileText, 
  Settings, 
  HelpCircle, 
  Plus,
  Headset,
  ChevronRight,
  Truck
} from "lucide-react";

export function ProfileSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-[280px] bg-white/70 backdrop-blur-3xl border-r border-slate-200/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col flex-shrink-0 h-screen overflow-hidden rounded-none relative">
            
            {/* Header / Logo */}
            <div className="px-8 pt-8 pb-5">
                <Link href="/" className="inline-flex items-center gap-3 group relative w-full">
                    {/* Glowing effect behind logo */}
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500"></div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white to-slate-50 shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden shrink-0 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300">
                        <Image src="/logo/PDM_Logo_Icon_40x40px.svg" alt="PDM Logo" fill className="object-contain p-2" />
                    </div>
                    <span className="text-[20px] font-black tracking-tight text-slate-800">PDM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PRO</span></span>
                </Link>
            </div>

            {/* CTA Button */}
            <div className="px-6 py-2 pb-6 border-b border-slate-100/60 relative">
                <Link 
                    href="/quote" 
                    className="group relative flex items-center justify-center gap-2 w-full bg-slate-900 text-white rounded-[1rem] py-3.5 font-bold text-[13px] tracking-wide shadow-[0_8px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_12px_25px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all duration-500 overflow-hidden"
                >
                    {/* Animated gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Light sweep animation */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[sweep_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-10 w-1/2"></div>
                    
                    <Plus size={18} strokeWidth={3} className="relative z-20 group-hover:rotate-90 transition-transform duration-500" /> 
                    <span className="relative z-20">สร้างโปรเจกต์ใหม่</span>
                </Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto w-full no-scrollbar">
                <p className="px-4 text-[10px] font-black tracking-[0.2em] text-slate-400/80 uppercase mb-3 text-left">เมนูหลัก</p>
                
                <Link href="/profile" className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 overflow-hidden group ${pathname === '/profile' ? 'text-blue-700 bg-blue-50/50 shadow-[0_1px_4px_rgba(59,130,246,0.05)] border border-blue-100/50' : 'text-slate-500 hover:text-slate-900 border border-transparent hover:bg-slate-50'}`}>
                    {pathname === '/profile' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
                    <div className="flex items-center gap-3.5 relative z-10">
                        <LayoutDashboard size={18} className={`${pathname === '/profile' ? 'text-blue-600' : 'text-slate-400'} group-hover:scale-110 transition-transform duration-300`} /> 
                        <span className="group-hover:translate-x-1 transition-transform duration-300">ภาพรวมการใช้งาน</span>
                    </div>
                </Link>

                <Link href="/orders" className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 overflow-hidden group ${pathname === '/orders' ? 'text-blue-700 bg-blue-50/50 shadow-[0_1px_4px_rgba(59,130,246,0.05)] border border-blue-100/50' : 'text-slate-500 hover:text-slate-900 border border-transparent hover:bg-slate-50'}`}>
                    {pathname === '/orders' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
                    <div className="flex items-center gap-3.5 relative z-10">
                        <History size={18} className={`${pathname === '/orders' ? 'text-blue-600' : 'text-slate-400'} group-hover:scale-110 transition-transform duration-300`} /> 
                        <span className="group-hover:translate-x-1 transition-transform duration-300">ประวัติการสั่งซื้อ</span>
                    </div>
                </Link>

                <div className="w-full h-px bg-slate-100/80 my-3"></div>
                <p className="px-4 text-[10px] font-black tracking-[0.2em] text-slate-400/80 uppercase mb-3 text-left">เอกสารและตั้งค่า</p>

                <Link href="/profile/quotes" className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 overflow-hidden group ${pathname === '/profile/quotes' ? 'text-blue-700 bg-blue-50/50 border border-blue-100/50' : 'text-slate-500 hover:text-slate-900 border border-transparent hover:bg-slate-50'}`}>
                    {pathname === '/profile/quotes' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>}
                    <div className="flex items-center gap-3.5 relative z-10">
                        <FileText size={18} className={`${pathname === '/profile/quotes' ? 'text-blue-600' : 'text-slate-400'} group-hover:text-amber-500 transition-all duration-300`} /> 
                        <span className="group-hover:translate-x-1 transition-transform duration-300">ใบเสนอราคาของฉัน</span>
                    </div>
                </Link>

                <Link href="/profile/billing" className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 overflow-hidden group ${pathname === '/profile/billing' ? 'text-blue-700 bg-blue-50/50 border border-blue-100/50' : 'text-slate-500 hover:text-slate-900 border border-transparent hover:bg-slate-50'}`}>
                    {pathname === '/profile/billing' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>}
                    <div className="flex items-center gap-3.5 relative z-10">
                        <Settings size={18} className={`${pathname === '/profile/billing' ? 'text-blue-600' : 'text-slate-400'} group-hover:text-slate-700 group-hover:rotate-45 transition-all duration-500`} /> 
                        <span className="group-hover:translate-x-1 transition-transform duration-300">ข้อมูลใบเสนอราคา</span>
                    </div>
                </Link>

                <Link href="/profile/shipping" className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 overflow-hidden group ${pathname === '/profile/shipping' ? 'text-blue-700 bg-blue-50/50 border border-blue-100/50' : 'text-slate-500 hover:text-slate-900 border border-transparent hover:bg-slate-50'}`}>
                    {pathname === '/profile/shipping' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>}
                    <div className="flex items-center gap-3.5 relative z-10">
                        <Truck size={18} className={`${pathname === '/profile/shipping' ? 'text-blue-600' : 'text-slate-400'} group-hover:text-sky-500 group-hover:translate-x-1 transition-all duration-500`} /> 
                        <span className="group-hover:translate-x-1 transition-transform duration-300">ข้อมูลการจัดส่ง</span>
                    </div>
                </Link>
            </div>

            {/* Engineer Support Card (Call-To-Action) */}
            <div className="px-6 py-4 mt-auto">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100/60 rounded-2xl p-4.5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                    {/* Background decor */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors"></div>
                    
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center mb-3 text-indigo-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
                        <Headset size={20} />
                    </div>
                    
                    <h4 className="text-[13px] font-black tracking-wide text-slate-800 mb-1.5 relative z-10">ปรึกษาวิศวกร 3D</h4>
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed mb-4 relative z-10">
                        ต้องการคำแนะนำเรื่องวัสดุ หรือตรวจสอบไฟล์ก่อนพิมพ์? เราพร้อมช่วยคุณ
                    </p>
                    
                    <a 
                        href="https://line.me/ti/p/@3dev" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full text-center py-3.5 bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all relative z-10"
                    >
                        เริ่มแชทบน LINE (@3dev)
                    </a>
                </div>
            </div>

            {/* Bottom Support Section */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <Link href="#" className="relative flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-bold transition-all overflow-hidden group text-slate-500 hover:text-slate-900 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-200/60 hover:border-slate-300 hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <HelpCircle size={18} className="text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-300" /> 
                        <span>ศูนย์ช่วยเหลือ 24/7</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
            </div>
        </aside>
    );
}
