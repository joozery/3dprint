import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import DashboardHeader from "@/components/profile/DashboardHeader";
import { MobileBottomNav } from "@/components/profile/MobileBottomNav";
import ShippingFormUI from "./ShippingFormUI";

export default function ShippingProfilePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <div className="hidden md:flex h-screen z-40 shrink-0 flex-col relative">
        <ProfileSidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto w-full relative z-10 no-scrollbar">
        <DashboardHeader />
        <ShippingFormUI />
      </main>
      <MobileBottomNav />
    </div>
  );
}
