import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Wrench } from "lucide-react";
import ModelCard, { FreeModelItem } from "@/components/models/ModelCard";

async function getModels(): Promise<FreeModelItem[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/public/free-models?category=functional`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.models || [];
  } catch {
    return [];
  }
}

export default async function FunctionalModelsPage() {
  const models = await getModels();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1">
        {/* Hero */}
        <div className="bg-slate-900 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
              <Wrench className="w-4 h-4" /> โมเดล 3D ฟรี
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">ชิ้นส่วนใช้งาน</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              โมเดล Functional พร้อมพิมพ์ เฟือง ตัวยึด คลิป และอุปกรณ์ที่ใช้งานได้จริง
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {models.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <Wrench className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-bold text-lg">ยังไม่มีโมเดลในหมวดหมู่นี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {models.map(model => (
                <ModelCard key={model._id} model={model} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/models" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700">
              ← ดูโมเดลทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
