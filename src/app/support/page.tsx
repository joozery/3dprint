import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import SupportPageClient from "./SupportPageClient";

async function getFaqs() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/faq`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.faqs ?? [];
  } catch {
    return [];
  }
}

async function getGuides() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/articles?type=guide`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}

async function getSupportSettings() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/support-settings`, { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    return data.settings ?? {};
  } catch {
    return {};
  }
}

export default async function SupportPage() {
  const [faqs, guides, settings] = await Promise.all([
    getFaqs(),
    getGuides(),
    getSupportSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <SupportPageClient faqs={faqs} guides={guides} settings={settings} />
      <Footer />
    </div>
  );
}
