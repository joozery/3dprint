"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  FileText, 
  Settings, 
  HelpCircle, 
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils"; // สมมติว่ามีฟังก์ชันนี้ ถ้าไม่มีให้ใช้ string template ก็ได้

export function ProfileSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-[260px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-screen">
            <div className="p-6 pb-4">
                <Link href="/" className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-sm shadow-blue-600/20">
                        3D
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">3DEV</span>
                </Link>
            </div>

            <div className="px-4 py-2">
                <Link 
                    href="/quote" 
                    className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg transition-all rounded-xl py-2.5 font-semibold text-sm shadow-sm"
                >
                    <Plus size={16} strokeWidth={2.5} /> New Project
                </Link>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                <Link href="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === '/profile' ? 'bg-slate-50 text-blue-600 font-semibold' : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900'}`}>
                    <LayoutDashboard size={18} /> Overview
                </Link>
                <Link href="/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === '/orders' ? 'bg-slate-50 text-blue-600 font-semibold' : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900'}`}>
                    <History size={18} /> Order History
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <FileText size={18} /> Invoices
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Settings size={18} /> Settings
                </Link>
            </nav>

            <div className="p-4 mt-auto">
                <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 font-medium text-sm hover:text-slate-900 transition-colors">
                    <HelpCircle size={18} /> Support
                </Link>
            </div>
        </aside>
    );
}
