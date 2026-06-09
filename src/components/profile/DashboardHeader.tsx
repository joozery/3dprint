"use client";

import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardHeader() {
    const { data: session } = useSession();
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
            <div className="flex items-center gap-4 w-full justify-between md:justify-end">
                {/* Mobile Logo */}
                <div className="md:hidden flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-white to-slate-50 shadow-sm border border-slate-200 flex items-center justify-center">
                        <img src="/logo/PDM_Logo_Icon_40x40px.svg" alt="PDM" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-[16px] font-black tracking-tight text-slate-800">PDM</span>
                </div>

                <div className="flex items-center gap-5">
                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex relative group mr-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input type="text" className="pl-9 pr-4 py-2 bg-slate-100/50 border border-slate-200/60 rounded-full text-[13px] font-medium text-slate-700 placeholder-slate-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all shadow-sm" placeholder={t.profile.searchPlaceholder} />
                    </div>

                    {/* Profile Dropdown Area */}
                    <div className="flex items-center gap-3 pl-2 sm:pl-3 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-[13px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">{session?.user?.name || "User"}</p>
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{session?.user?.email || "user@example.com"}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 border-2 border-white object-cover overflow-hidden group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                session?.user?.name?.charAt(0)?.toUpperCase() || "U"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
