"use client";

import { MessageCircle } from "lucide-react";

interface SupportSettings {
  lineId?: string;
  lineUrl?: string;
  email?: string;
  businessHours?: string;
  chatEnabled?: boolean;
  facebookUrl?: string;
}

interface Props {
  settings: SupportSettings;
}

export default function ChatContent({ settings }: Props) {
  const chatEnabled = settings.chatEnabled !== false;

  const channels = [
    {
      name: "LINE Official",
      handle: settings.lineId || "@pdmpro",
      color: "bg-green-500",
      desc: "ตอบไวที่สุด",
      href: settings.lineUrl || undefined,
    },
    {
      name: "Facebook Messenger",
      handle: settings.facebookUrl ? "Facebook Page" : "PrintMyDesign.TH",
      color: "bg-blue-600",
      desc: "สำหรับลูกค้า Facebook",
      href: settings.facebookUrl || undefined,
    },
    {
      name: "Email Support",
      handle: settings.email || "hello@pdmpro.co.th",
      color: "bg-slate-600",
      desc: "ตอบภายใน 1 วันทำการ",
      href: settings.email ? `mailto:${settings.email}` : undefined,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Status */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {chatEnabled ? (
          <span className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-5 py-2.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            ออนไลน์ — {settings.businessHours || "วันจันทร์-เสาร์ 9:00–18:00 น."}
          </span>
        ) : (
          <span className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-sm px-5 py-2.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            ขณะนี้ปิดให้บริการ — {settings.businessHours || "วันจันทร์-เสาร์ 9:00–18:00 น."}
          </span>
        )}
      </div>

      {/* Chat UI */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="bg-blue-600 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">PDM Support</p>
            <p className="text-blue-200 text-xs">
              {chatEnabled ? "Online · ตอบใน ~2 นาที" : "ปิดให้บริการชั่วคราว"}
            </p>
          </div>
        </div>
        <div className="p-5 space-y-4 min-h-[180px]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-xs">
              <p className="text-sm text-slate-700">
                {chatEnabled
                  ? "สวัสดีครับ! มีอะไรให้ช่วยได้บ้างครับ? 😊"
                  : "ขณะนี้ระบบปิดให้บริการชั่วคราว กรุณาติดต่อผ่านช่องทางอื่น"}
              </p>
            </div>
          </div>
          {chatEnabled && (
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-xs font-bold text-slate-500">คุณ</div>
              <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-2.5 max-w-xs">
                <p className="text-sm text-white">อยากถามเรื่องราคาพิมพ์ PLA ครับ</p>
              </div>
            </div>
          )}
        </div>
        <div className="px-5 pb-5">
          {chatEnabled && settings.lineUrl ? (
            <a
              href={settings.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> เริ่ม Live Chat (LINE)
            </a>
          ) : (
            <button
              disabled={!chatEnabled}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {chatEnabled ? "เริ่ม Live Chat" : "ปิดให้บริการชั่วคราว"}
            </button>
          )}
        </div>
      </div>

      {/* Hours */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h3 className="font-black text-slate-900 mb-4">เวลาทำการ</h3>
        <p className="text-sm text-slate-700 font-medium">
          {settings.businessHours || "วันจันทร์ - เสาร์ 9:00 - 18:00 น."}
        </p>
      </div>

      {/* Alternative channels */}
      <h3 className="font-black text-slate-900 mb-4">ช่องทางติดต่ออื่นๆ</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mx-auto mb-3`}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-slate-800 text-sm mb-1">{c.name}</p>
            <p className="text-xs text-slate-500 mb-2 break-all">{c.handle}</p>
            <span className="text-xs text-emerald-600 font-semibold">{c.desc}</span>
            {c.href && (
              <div className="mt-3">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
                >
                  ติดต่อ
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
