import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import DashboardHeader from "@/components/profile/DashboardHeader";
import { MobileBottomNav } from "@/components/profile/MobileBottomNav";
import BillingClientForm from "./BillingClientForm";

export const dynamic = "force-dynamic";

export default async function ProfileBillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <div className="hidden md:flex h-screen z-40 shrink-0 flex-col relative">
        <ProfileSidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full relative z-10 no-scrollbar">
        <DashboardHeader />

        <div className="p-6 md:p-10 max-w-[800px] w-full mx-auto pb-24">
          <BillingClientForm />
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
