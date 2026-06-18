import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import ModelsPageClient from "./ModelsPageClient";

async function getModels() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/public/free-models?category=all`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.models || [];
  } catch {
    return [];
  }
}

export default async function ModelsPage() {
  const models = await getModels();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <div className="flex-1">
        <ModelsPageClient initialModels={models} />
      </div>
      <Footer />
    </div>
  );
}
