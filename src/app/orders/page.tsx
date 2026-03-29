import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { redirect } from "next/navigation";
import { History, ListFilter, Download, Search } from "lucide-react";
import Link from "next/link";

// Sub Components
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import DashboardHeader from "@/components/profile/DashboardHeader";
import { RecentOrdersTable } from "@/components/profile/RecentOrdersTable";
import { MobileBottomNav } from "@/components/profile/MobileBottomNav";
import EmailCheckModal from "@/components/auth/EmailCheckModal";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch true data - All orders instead of limited
  const rawQuotes = await Quote.find({ userId: (session.user as any)?.id }).sort({ createdAt: -1 });
  const allQuotes = JSON.parse(JSON.stringify(rawQuotes));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans relative overflow-hidden">
      
      {/* ── Modal: ขออีเมลเพิ่ม (สำหรับคนเข้าทางลัด LINE/SSO) ── */}
      <EmailCheckModal />

      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* ── Left Sidebar (Flush Layout) ── */}
      <div className="hidden md:flex h-screen z-40 shrink-0 flex-col relative">
          <ProfileSidebar />
      </div>

      {/* ── Main Orders Content ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full relative z-10 no-scrollbar">
        
        {/* ── Top Header Navbar ── */}
        <DashboardHeader />

        <div className="p-6 md:p-10 max-w-[1200px] w-full mx-auto pb-24 relative z-10">
            
            {/* Header Area */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest mb-4">
                        <History size={14} /> Full History
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">View and manage all your past 3D printing requests.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none w-64 shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        <ListFilter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm hidden sm:flex">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* ── All Orders Table ── */}
            <div className="shadow-lg shadow-slate-200/40 rounded-2xl bg-white mb-6">
                {/* Reuse the RecentOrdersTable but pass ALL quotes */}
                <RecentOrdersTable quotes={allQuotes} />
            </div>

            {/* Pagination Mockup */}
            {allQuotes.length > 0 && (
                <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">1</span> to <span className="font-bold text-slate-800">{allQuotes.length}</span> of <span className="font-bold text-slate-800">{allQuotes.length}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-400 bg-slate-50 opacity-50 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 shadow-sm border-b-2">Next</button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-slate-200/60 pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-[13px] text-slate-400 font-medium">
                <div>© 2026 PDM 3D Print Thailand. สงวนลิขสิทธิ์</div>
                <div className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2 mt-3 sm:mt-0 font-bold">
                    <Link href="/privacy" className="hover:text-blue-600 transition-colors">นโยบายความเป็นส่วนตัว</Link>
                    <Link href="/terms" className="hover:text-blue-600 transition-colors">ข้อกำหนดการให้บริการ</Link>
                    <Link href="/cookies" className="hover:text-blue-600 transition-colors">นโยบายคุกกี้</Link>
                </div>
            </div>

        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
