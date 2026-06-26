import Navbar from "@/components/layout/Navbar";
import { HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import FaqAccordion from "./FaqAccordion";

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

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1">
        <div className="bg-slate-900 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
              <HelpCircle className="w-4 h-4" /> FAQ
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">คำถามที่พบบ่อย</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              รวบรวมคำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด หากไม่พบคำตอบที่ต้องการ ติดต่อทีมงานได้เลย
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-16">
          {faqs.length > 0 ? (
            <div className="space-y-3">
              <FaqAccordion faqs={faqs} />
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="font-bold text-slate-700 text-lg">ยังไม่มี FAQ</h3>
              <p className="text-slate-400 mt-2 text-sm">ทีมงานกำลังรวบรวมคำถามที่พบบ่อย โปรดติดต่อเราหากมีข้อสงสัย</p>
            </div>
          )}

          <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-200 p-8 text-center">
            <h3 className="font-black text-blue-900 text-lg mb-2">ไม่พบคำตอบที่ต้องการ?</h3>
            <p className="text-blue-700 text-sm mb-6">ทีมงานพร้อมตอบทุกคำถามของคุณ</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/support/contact"
                className="inline-flex items-center gap-2 border border-blue-300 text-blue-700 font-bold px-6 py-2.5 rounded-full hover:bg-blue-100 transition-colors text-sm"
              >
                ติดต่อเรา
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
