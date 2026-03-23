import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { redirect } from "next/navigation";
import { History, ListFilter, Download, Search } from "lucide-react";

// Sub Components
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { RecentOrdersTable } from "@/components/profile/RecentOrdersTable";

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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* ── Left Sidebar ── */}
      <ProfileSidebar />

      {/* ── Main Orders Content ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9]/50 h-screen overflow-y-auto w-full">
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto">
            
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
            <div className="mt-12 pt-6 border-t border-slate-200/60 pb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-medium">
                <div>© 2026 3DEV Manufacturing Platform. All rights reserved.</div>
            </div>

        </div>
      </main>

    </div>
  );
}
