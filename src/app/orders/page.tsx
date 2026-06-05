import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { redirect } from "next/navigation";
import Link from "next/link";

// Sub Components
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import DashboardHeader from "@/components/profile/DashboardHeader";
import { OrderHistoryTable } from "@/components/profile/OrderHistoryTable";
import { MobileBottomNav } from "@/components/profile/MobileBottomNav";
import EmailCheckModal from "@/components/auth/EmailCheckModal";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const rawOrders = await Order.find({ userId: (session.user as any)?.id })
    .populate("quotes")
    .sort({ createdAt: -1 })
    .lean();
  const allOrders = JSON.parse(JSON.stringify(rawOrders));

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

        <div className="p-6 md:p-10 max-w-[1100px] w-full mx-auto pb-24 relative z-10">
            
            {/* Header Area matching screenshot */}
            <div className="mb-10">
                <h1 className="text-[28px] font-black text-slate-900 tracking-tight">ประวัติคำสั่งซื้อ</h1>
                <p className="text-slate-400 mt-1 font-bold text-sm uppercase tracking-widest">คำสั่งซื้อของคุณ</p>
                <div className="h-[1.5px] bg-slate-100 w-full mt-6" />
            </div>

            {/* ── All Orders Table ── */}
            <div className="mb-6">
                <OrderHistoryTable orders={allOrders} />
            </div>

            {/* Pagination Mockup */}
            {allOrders.length > 0 && (
                <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">1</span> to <span className="font-bold text-slate-800">{allOrders.length}</span> of <span className="font-bold text-slate-800">{allOrders.length}</span> results
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
