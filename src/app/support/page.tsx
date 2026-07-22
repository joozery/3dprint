import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import SupportPageClient from "./SupportPageClient";
import dbConnect from "@/lib/mongoose";
import Faq from "@/models/Faq";
import Article from "@/models/Article";
import SupportSettings from "@/models/SupportSettings";

async function getData() {
  try {
    await dbConnect();
    const [faqs, guides, settings] = await Promise.all([
      Faq.find({ isActive: true }).sort({ order: 1 }).lean(),
      Article.find({ type: "guide", isActive: true }).sort({ order: 1, createdAt: -1 }).lean(),
      SupportSettings.findOne().lean(),
    ]);
    return {
      faqs: JSON.parse(JSON.stringify(faqs)),
      guides: JSON.parse(JSON.stringify(guides)),
      settings: JSON.parse(JSON.stringify(settings ?? {})),
    };
  } catch {
    return { faqs: [], guides: [], settings: {} };
  }
}

export default async function SupportPage() {
  const { faqs, guides, settings } = await getData();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <SupportPageClient faqs={faqs} guides={guides} settings={settings} />
      <Footer />
    </div>
  );
}
