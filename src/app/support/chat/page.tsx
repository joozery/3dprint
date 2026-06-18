import Navbar from "@/components/layout/Navbar";
import { MessageCircle } from "lucide-react";
import ChatContent from "./ChatContent";

interface SupportSettings {
  lineId?: string;
  lineUrl?: string;
  email?: string;
  businessHours?: string;
  chatEnabled?: boolean;
  facebookUrl?: string;
}

async function getSupportSettings(): Promise<SupportSettings> {
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

export default async function ChatPage() {
  const settings = await getSupportSettings();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1">
        <div className="bg-slate-900 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
              <MessageCircle className="w-4 h-4" /> Live Chat
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">ติดต่อผ่าน Live Chat</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              คุยกับทีมงานผู้เชี่ยวชาญแบบ Real-time รับคำตอบทันที ไม่ต้องรอนาน
            </p>
          </div>
        </div>

        <ChatContent settings={settings} />
      </div>
    </div>
  );
}
