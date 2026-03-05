import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FloatingSidebar from "@/components/home/FloatingSidebar";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { BentoSection } from "@/components/home/BentoSection";
import { HowItWorks, Footer } from "@/components/home/HomeSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      <HeroSection />
      <ShowcaseSection />
      <BentoSection />
      <HowItWorks />
      <Footer />
      <FloatingSidebar />
    </main>
  );
}
