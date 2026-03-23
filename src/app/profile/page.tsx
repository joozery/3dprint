import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { redirect } from "next/navigation";

// Import New Sub-Components
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecentOrdersTable } from "@/components/profile/RecentOrdersTable";

export const dynamic = "force-dynamic"; 

export default async function UserDashboard() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch true data
  const rawQuotes = await Quote.find({ userId: (session.user as any)?.id }).sort({ createdAt: -1 });
  const quotes = JSON.parse(JSON.stringify(rawQuotes));
  
  // Calculate Stats
  const totalQuotes = quotes.length;
  const recentQuotes = quotes.slice(0, 10);
  const totalVolume = quotes.reduce((sum: number, q: any) => sum + (q.volumeCm3 || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* ── Left Sidebar (Component) ── */}
      <ProfileSidebar />

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9]/50 h-screen overflow-y-auto w-full">
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto">
            
            {/* ── Quick Stats Profile (Component) ── */}
            <ProfileStats 
                userName={session.user?.name || "User"} 
                totalQuotes={totalQuotes} 
                totalVolume={totalVolume} 
            />

            {/* ── Table Orders (Component) ── */}
            <RecentOrdersTable quotes={recentQuotes} />

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200/60 pb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-medium">
                <div>© 2026 3DEV Manufacturing Platform. All rights reserved.</div>
                <div className="flex gap-4 mt-2 sm:mt-0">
                    <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                </div>
            </div>

        </div>
      </main>

    </div>
  );
}
