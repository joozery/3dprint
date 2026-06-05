import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import Order from "@/models/Order";
import { redirect } from "next/navigation";
import Link from "next/link";


// Import New Sub-Components
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import DashboardHeader from "@/components/profile/DashboardHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecentOrdersTable } from "@/components/profile/RecentOrdersTable";
import { MobileBottomNav } from "@/components/profile/MobileBottomNav";
import EmailCheckModal from "@/components/auth/EmailCheckModal";

export const dynamic = "force-dynamic"; 

export default async function UserDashboard() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any)?.id;

  // Fetch quotes and orders in parallel
  const [rawQuotes, rawOrders] = await Promise.all([
    Quote.find({ userId }).sort({ createdAt: -1 }).lean(),
    Order.find({ userId }).sort({ createdAt: -1 }).lean(),
  ]);
  const quotes = JSON.parse(JSON.stringify(rawQuotes));
  const orders = JSON.parse(JSON.stringify(rawOrders));

  // Calculate Stats
  const totalQuotes   = quotes.length;
  const pendingQuotes = quotes.filter((q: any) => q.status === "draft").length;
  const recentQuotes  = quotes.slice(0, 10);
  const totalOrders   = orders.length;
  const totalSpending = orders.reduce((sum: number, o: any) => sum + (o.pricing?.totalAmount || 0), 0);

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

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full relative z-10 no-scrollbar">
        
        {/* ── Top Header Navbar ── */}
        <DashboardHeader />

        <div className="p-6 md:p-10 max-w-[1200px] w-full mx-auto pb-24 relative z-10">
            
            {/* ── Quick Stats Profile ── */}
            <ProfileStats
                userName={session.user?.name || "User"}
                totalQuotes={totalQuotes}
                pendingQuotes={pendingQuotes}
                totalOrders={totalOrders}
                totalSpending={totalSpending}
            />

            {/* ── Table Orders ── */}
            <div className="mt-10">
                <RecentOrdersTable quotes={recentQuotes} />
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-slate-200/60 pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-[13px] text-slate-400 font-medium">
                <div>© 2026 PrintMyDesign by Septillion Co., Ltd. สงวนลิขสิทธิ์</div>
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
