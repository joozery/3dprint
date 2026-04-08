"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Database, 
  FileText,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ClipboardList,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { label: "แดชบอร์ดหลัก", icon: LayoutDashboard, href: "/admin", badge: null },
  { label: "ใบเสนอราคาใหม่", icon: FileText, href: "/admin/quotes", badge: "3", badgeColor: "bg-blue-600" },
  { label: "รายการสั่งซื้อ", icon: ShoppingBag, href: "/admin/orders", badge: "New", badgeColor: "bg-emerald-500" },
  { label: "คลังไฟล์โมเดล", icon: Database, href: "/admin/models", badge: null },
  { label: "จัดการสมาชิก", icon: Users, href: "/admin/users", badge: null },
  { label: "จัดการแอดมิน", icon: ShieldCheck, href: "/admin/admins", badge: null },
  { label: "ประวัติระบบ", icon: ClipboardList, href: "/admin/logs", badge: null },
  { label: "ตั้งค่าระบบ", icon: Settings, href: "/admin/settings", badge: null },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Search Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const lookupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && lookupInputRef.current) {
      setTimeout(() => {
        lookupInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery(""); // clear when closed
    }
  }, [isSearchOpen]);

  if (!isMounted) return null;

  // Filter items for search
  const filteredItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMenuItem = (href: string) => {
    setIsSearchOpen(false);
    router.push(href);
  };

  return (
    <>
      <aside 
        className={`${
          isCollapsed ? "w-[90px]" : "w-[280px]"
        } h-screen bg-white text-slate-600 flex flex-col relative z-40 shadow-[4px_0_24px_rgba(0,0,0,0.04)] transition-all duration-500 ease-in-out border-r border-slate-200/80`}
      >
        {/* Brand Header */}
        <div className="h-24 flex items-center px-6 mt-2 relative shrink-0">
          <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-slate-100" />
          <Link 
            href="/admin" 
            className={`flex items-center group w-full ${isCollapsed ? "justify-center" : "gap-3"}`}
          >
            <div className="relative flex items-center justify-center p-2 rounded-xl border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300 shadow-sm shrink-0">
               <Image src="/logo/PDM_Logo_Icon_40x40px.svg" alt="PDM" width={30} height={30} />
            </div>
            
            <div className={`flex flex-col overflow-hidden transition-all duration-500 whitespace-nowrap ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              <span className="text-[19px] font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">PDM ADMIN</span>
              <span className="text-[10px] text-slate-500 font-bold tracking-[0.15em] uppercase mt-0.5">Management v2.0</span>
            </div>
          </Link>
        </div>

        {/* Pseudo Search Shortcut Button */}
        {!isCollapsed && (
          <div className="px-5 pt-6 pb-2 shrink-0 animate-in fade-in duration-500">
             <button 
               onClick={() => setIsSearchOpen(true)}
               className="w-full flex items-center justify-between bg-slate-50 border border-slate-200/80 text-slate-400 rounded-xl px-3 py-2.5 text-sm hover:border-slate-300 hover:bg-white hover:text-slate-600 transition-all group shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
             >
               <span className="flex items-center gap-2">
                 <Search size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                 <span className="font-semibold text-slate-500 group-hover:text-slate-600">ค้นหาเมนู...</span>
               </span>
               <kbd className="hidden md:inline-flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 font-bold shadow-sm group-hover:border-slate-300 group-hover:text-slate-500 transition-colors">
                 <span className="text-xs">⌘</span>K
               </kbd>
             </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isCollapsed ? 'px-3 py-6' : 'px-4 py-3'} space-y-1`}>
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-3 pt-2">Main Menu</div>
          )}
          
          {menuItems.map((item) => {
            const exactActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)) || (pathname.startsWith("/admin") && item.href !== "/admin" && pathname.includes(item.href.split("/")[2]));
            const Icon = item.icon;
            
            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? "justify-center px-0 h-11 w-11 mx-auto rounded-xl" : "justify-between px-4 py-3.5 rounded-xl"} transition-all duration-300 relative overflow-hidden ${
                    exactActive 
                      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50/50 hover:border hover:border-slate-100/50 border border-transparent"
                  }`}
                >
                  <div className={`flex items-center relative z-10 ${isCollapsed ? "justify-center" : "gap-3.5 w-full"}`}>
                     <div className={`flex items-center justify-center transition-all duration-300 shrink-0 ${exactActive ? "text-blue-600 scale-110" : "group-hover:text-blue-600 group-hover:scale-110"}`}>
                       <Icon size={isCollapsed ? 20 : 18} strokeWidth={exactActive ? 2.5 : 2} className={!exactActive ? "text-slate-400 group-hover:text-blue-600" : ""} />
                       
                       {/* Mini Status Dot when collapsed */}
                       {isCollapsed && item.badge && (
                         <span className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full ${item.badgeColor} border-2 border-white shadow-sm`} />
                       )}
                     </div>
                     
                     {!isCollapsed && (
                       <span className={`text-[13.5px] font-bold tracking-wide whitespace-nowrap transition-all duration-300 ${exactActive ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                         {item.label}
                       </span>
                     )}
                  </div>
                  
                  {/* Badges & Chevrons (Expanded only) */}
                  {!isCollapsed && (
                    <div className="relative z-10 flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={14} className={`transition-all duration-300 ${exactActive ? "opacity-100 text-blue-500" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-slate-400"}`} />
                    </div>
                  )}
                </Link>
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 whitespace-nowrap flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>{item.badge}</span>
                    )}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Footer (Collapse Toggle + Logout) */}
        <div className="pt-4 pb-5 shrink-0 px-4 flex flex-col gap-1 relative z-20 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center ${isCollapsed ? "justify-center h-11 w-11 mx-auto rounded-xl" : "gap-3 px-4 py-3 rounded-xl"} text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all duration-300 group`}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} className="group-hover:text-blue-600 transition-colors" />
            ) : (
              <PanelLeftClose size={18} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
            )}
            {!isCollapsed && (
              <span className="text-[13px] font-bold tracking-wide whitespace-nowrap">ย่อเมนูด้านข้าง</span>
            )}
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={`flex items-center ${isCollapsed ? "justify-center h-11 w-11 mx-auto rounded-xl" : "gap-3 px-4 py-3 rounded-xl"} text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group relative`}
          >
            <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
              <LogOut size={18} strokeWidth={2} className="text-slate-400 group-hover:text-red-500" />
            </div>
            {!isCollapsed && (
              <span className="text-[13px] font-bold tracking-wide whitespace-nowrap">ออกจากระบบ</span>
            )}

            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50 whitespace-nowrap">
                ออกจากระบบ
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-red-600" />
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* --- COMMAND PALETTE MODAL --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 backdrop-blur-sm bg-slate-900/40" onClick={() => setIsSearchOpen(false)}>
          <div 
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Area */}
            <div className="relative flex items-center px-4 py-4 border-b border-slate-100">
              <Search className="absolute left-5 text-blue-500" size={20} />
              <input
                ref={lookupInputRef}
                type="text"
                placeholder="พิมพ์เพื่อค้นหาเมนู..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-medium pl-10 pr-4 outline-none border-none focus:ring-0 text-base"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && filteredItems.length > 0) {
                     handleSelectMenuItem(filteredItems[0].href);
                  }
                }}
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[350px] overflow-y-auto w-full p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-slate-50/50">
               {filteredItems.length === 0 ? (
                 <div className="p-8 text-center text-slate-500">
                    <p className="text-sm font-medium">ไม่มีเมนูที่ตรงกับการค้นหา</p>
                 </div>
               ) : (
                 <div className="space-y-1">
                   {filteredItems.map((item, index) => {
                     const Icon = item.icon;
                     return (
                       <button
                         key={item.href}
                         onClick={() => handleSelectMenuItem(item.href)}
                         className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-blue-50 focus:bg-blue-50 hover:text-blue-700 text-slate-600 group transition-colors text-left border border-transparent hover:border-blue-100"
                       >
                         <div className="flex items-center gap-3">
                           <div className="flex items-center justify-center bg-white border border-slate-200 p-2 rounded-lg group-hover:bg-blue-100 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors shadow-sm">
                             <Icon size={18} className="text-slate-500 group-hover:text-blue-600" />
                           </div>
                           <span className="font-bold text-sm tracking-wide">{item.label}</span>
                         </div>
                         
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] text-blue-500 uppercase font-bold hidden group-hover:block">Select</span>
                           {index === 0 && searchQuery.length > 0 && (
                             <kbd className="hidden sm:inline-flex bg-white border border-slate-200 shadow-sm px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 font-bold">Enter↵</kbd>
                           )}
                         </div>
                       </button>
                     );
                   })}
                 </div>
               )}
            </div>
            
            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 shadow-sm px-1 rounded text-slate-500">↑↓</kbd> นำทาง</span>
                <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 shadow-sm px-1 rounded text-slate-500">Enter</kbd> เลือก</span>
              </div>
              <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 shadow-sm px-1 rounded text-slate-500">Esc</kbd> ปิด</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
