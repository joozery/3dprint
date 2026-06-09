"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    History, 
    Plus, 
    Menu, 
    FileText, 
    Settings,
    HelpCircle,
    Headset,
    ChevronRight,
    LogOut
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function MobileBottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const p = t.profile;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 pb-safe shadow-[0_-4px_30px_rgba(0,0,0,0.05)] px-2 pb-2">
            <div className="grid grid-cols-5 items-center w-full pt-2">
                
                {/* 1. Dashboard */}
                <Link href="/profile" className={`flex flex-col items-center justify-center w-full h-12 gap-1 rounded-xl transition-all ${pathname === '/profile' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <LayoutDashboard size={22} className={pathname === '/profile' ? 'scale-110' : ''} />
                    <span className="text-[10px] font-bold">{p.overview}</span>
                </Link>

                {/* 2. Orders */}
                <Link href="/orders" className={`flex flex-col items-center justify-center w-full h-12 gap-1 rounded-xl transition-all ${pathname === '/orders' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <History size={22} className={pathname === '/orders' ? 'scale-110' : ''} />
                    <span className="text-[10px] font-bold">{p.ordersNav}</span>
                </Link>

                {/* 3. Floating Action Button for Quote (Center) */}
                <div className="flex flex-col items-center justify-center w-full relative">
                    <Link href="/quote" className="absolute -top-12 flex flex-col items-center justify-center">
                        <div className="w-[60px] h-[60px] rounded-full bg-slate-900 border-[5px] border-[#F8FAFC] text-white flex items-center justify-center shadow-lg shadow-slate-900/30 active:scale-95 transition-transform hover:-translate-y-1">
                            <Plus size={28} strokeWidth={3} />
                        </div>
                    </Link>
                </div>

                {/* 4. Support (LINE) */}
                <a 
                    href="https://line.me/ti/p/@3dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center w-full h-12 gap-1 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
                >
                    <Headset size={22} />
                    <span className="text-[10px] font-bold">{p.lineChat}</span>
                </a>

                {/* 5. More Menu using Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="flex flex-col items-center justify-center w-full h-12 gap-1 rounded-xl text-slate-400 hover:text-slate-600 transition-all outline-none">
                            <Menu size={22} />
                            <span className="text-[10px] font-bold">{p.moreMenu}</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-[2rem] px-6 py-8 pb-12 outline-none border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[85vh] overflow-y-auto no-scrollbar">
                        <SheetHeader className="mb-6 text-left">
                            <SheetTitle className="text-xl font-black text-slate-900">{p.accountAndHelp}</SheetTitle>
                        </SheetHeader>
                        
                        <div className="space-y-6">
                            {/* Navigation Links */}
                            <div className="flex flex-col space-y-2">
                                <Link href="#" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 active:scale-[0.98] transition-transform">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-500">
                                            <FileText size={20} className="text-amber-500" />
                                        </div>
                                        <span className="font-bold text-sm text-slate-700">{p.invoiceHistory}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300" />
                                </Link>

                                <Link href="#" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 active:scale-[0.98] transition-transform">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-500">
                                            <Settings size={20} className="text-slate-700" />
                                        </div>
                                        <span className="font-bold text-sm text-slate-700">{p.accountSettings}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300" />
                                </Link>

                                <Link href="#" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 active:scale-[0.98] transition-transform">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-500">
                                            <HelpCircle size={20} className="text-emerald-500" />
                                        </div>
                                        <span className="font-bold text-sm text-slate-700">{p.helpCenter}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300" />
                                </Link>
                            </div>

                            {/* Engineer Support Card Mobile */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl"></div>
                                
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600 relative z-10">
                                    <Headset size={24} />
                                </div>
                                
                                <h4 className="text-base font-black tracking-wide text-slate-800 mb-2 relative z-10">{p.consultEngineer}</h4>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed mb-5 relative z-10">
                                    {p.consultEngineerDesc}
                                </p>

                                <a
                                    href="https://line.me/ti/p/@3dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-3.5 bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all relative z-10"
                                >
                                    {p.startLineChat}
                                </a>
                            </div>

                            {/* Logout Action Mobile */}
                            <div className="pt-2">
                                <button 
                                    onClick={() => signOut({ callbackUrl: '/' })} 
                                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm border border-red-100 active:scale-[0.98] transition-transform"
                                >
                                    <LogOut size={18} /> {p.logout}
                                </button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
