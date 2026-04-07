"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, ChevronDown, Search, Settings, User, Globe } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

interface AdminTopbarProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export default function AdminTopbar({ user }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50 sticky top-0 shadow-sm transition-all duration-300">
      {/* Search Bar - Clean */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
          <Search size={16} />
        </div>
        <input 
          type="text" 
          placeholder="ค้นหาข้อมูล..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
        />
      </div>

      {/* Right Controls Container */}
      <div className="flex items-center gap-4">
        {/* Quick Links */}
        <div className="hidden md:flex items-center gap-1 pr-4 border-r border-slate-100">
           <Link href="/" target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all">
              <Globe size={18} />
           </Link>
           <Link href="/admin/settings" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all">
              <Settings size={18} />
           </Link>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all">
           <Bell size={18} />
           <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
        </button>

        {/* User Profile */}
        <div className="relative">
           <button
             onClick={() => setMenuOpen(!menuOpen)}
             className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white border transition-all ${
               menuOpen ? "border-blue-500 bg-slate-50" : "border-slate-200"
             }`}
           >
             <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0 border border-slate-200">
               {user.image ? (
                 <Image src={user.image} alt={user.name} width={32} height={32} className="object-cover" />
               ) : (
                 <span className="text-blue-600 text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</span>
               )}
             </div>
             <span className="text-slate-700 text-sm font-medium hidden sm:block truncate max-w-[100px]">{user.name}</span>
             <ChevronDown size={14} className={`text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
           </button>

           {menuOpen && (
             <>
               <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
               <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                     <p className="text-slate-900 text-sm font-bold truncate">{user.name}</p>
                     <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
                  </div>
                  <Link 
                   href="/admin/profile"
                   onClick={() => setMenuOpen(false)}
                   className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 text-sm transition-all"
                  >
                     <User size={16} /> ข้อมูลส่วนตัว
                  </Link>
                  <div className="h-px bg-slate-50" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm transition-all"
                  >
                    <LogOut size={16} /> ออกจากระบบ
                  </button>
               </div>
             </>
           )}
        </div>
      </div>
    </header>
  );
}
