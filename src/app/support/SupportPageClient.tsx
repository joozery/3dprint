"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, UploadCloud, Calculator, Box, Clock, Truck, ShieldCheck,
  ArrowRight, MessageCircle, Mail, Phone, Headset, Info, Lock, HeartHandshake
} from "lucide-react";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface GuideItem {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

interface SupportSettings {
  businessHours?: string;
  lineUrl?: string;
  chatEnabled?: boolean;
}

interface Props {
  faqs: FaqItem[];
  guides: GuideItem[];
  settings: SupportSettings;
}

// Default FAQ categories derived from FAQ data categories, or fallback icons
const defaultCategoryIcons: Record<string, any> = {
  "การอัปโหลดไฟล์": UploadCloud,
  "การประเมินราคา": Calculator,
  "วัสดุและสี": Box,
  "ระยะเวลาในการผลิต": Clock,
  "การจัดส่ง": Truck,
  "การรับประกันและเคลม": ShieldCheck,
  "ทั่วไป": Info,
};

function getCategoryIcon(category: string) {
  return defaultCategoryIcons[category] || Info;
}

function groupFaqsByCategory(faqs: FaqItem[]) {
  const map: Record<string, { title: string; items: FaqItem[] }> = {};
  for (const faq of faqs) {
    if (!map[faq.category]) {
      map[faq.category] = { title: faq.category, items: [] };
    }
    map[faq.category].items.push(faq);
  }
  return Object.values(map);
}

export default function SupportPageClient({ faqs, guides, settings }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = groupFaqsByCategory(faqs);

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.items.some(
      (f) =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredGuides = guides.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#0a192f] pt-28 pb-20 lg:pt-36 lg:pb-28">
        <Image
          src="/cover/cpverfdm.png"
          alt="Support Background"
          fill
          className="object-cover object-right"
          priority
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="w-full max-w-2xl">
            <div className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-4">
              HELP & SUPPORT
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] mb-6">
              เราพร้อมช่วยเหลือ<br />
              ให้คุณได้งานพิมพ์ 3D ที่ดีที่สุด
            </h1>
            <p className="text-blue-100/70 text-base md:text-lg mb-8 max-w-xl font-light">
              ศูนย์ช่วยเหลือรวบรวมทุกคำถามที่พบบ่อย คู่มือการใช้งาน
              และช่องทางติดต่อกับเรา เพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด
            </p>

            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาคำถาม หรือปัญหาที่คุณต้องการ..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-lg text-slate-900 outline-none shadow-xl focus:ring-4 focus:ring-blue-500/30 transition-all text-base border-0"
              />
            </div>

            {/* Tags */}
            <div>
              <span className="text-sm text-slate-400 mr-3">แนะนำสำหรับคุณ:</span>
              <div className="inline-flex flex-wrap gap-2 mt-2">
                {["วิธีอัปโหลดไฟล์ STL", "ระยะเวลาในการผลิต", "ประเภทวัสดุ", "การชำระเงิน", "การจัดส่ง"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-4 py-1.5 rounded-full border border-blue-400/30 text-blue-300 text-xs hover:bg-blue-500/20 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FAQ Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">หัวข้อที่พบบ่อย</h2>
            <Link href="/support/faq" className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700">
              ดูคำถามทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((cat) => {
                const Icon = getCategoryIcon(cat.title);
                return (
                  <Link
                    href="/support/faq"
                    key={cat.title}
                    className="bg-white border border-slate-100 rounded-lg p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-blue-100 transition-all group cursor-pointer"
                  >
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">{cat.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                          {cat.items[0]?.question || `${cat.items.length} คำถาม`}
                        </p>
                        <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                          ดูเพิ่มเติม <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">ไม่พบหัวข้อที่ตรงกับ "{searchQuery}"</h3>
              <p className="text-slate-500 mt-2">ลองค้นหาด้วยคำอื่น หรือติดต่อทีมงานด้านล่างได้เลยครับ</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Guides & Contact */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left: Guides */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">คู่มือการใช้งาน</h2>
                <Link href="/support/guide" className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700">
                  ดูทั้งหมด <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {filteredGuides.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {filteredGuides.map((guide) => (
                    <div
                      key={guide._id}
                      className="bg-white rounded-lg p-4 flex gap-5 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100 group"
                    >
                      <div className="w-32 h-24 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative">
                        {guide.thumbnail ? (
                          <Image src={guide.thumbnail} alt={guide.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Box className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{guide.title}</h3>
                        {guide.description && (
                          <p className="text-sm text-slate-500 mb-3">{guide.description}</p>
                        )}
                        <div className="inline-flex text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                          คู่มือการใช้งาน
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                  <p className="text-slate-500">
                    {searchQuery
                      ? "ไม่พบคู่มือที่ตรงกับคำค้นหาของคุณ"
                      : "ยังไม่มีคู่มือการใช้งาน"}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Contact Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">ยังหาคำตอบไม่ได้?</h2>
              <div className="bg-white rounded-xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <Headset className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">ติดต่อทีมงานของเรา</h3>
                <p className="text-sm text-slate-500 mb-8 max-w-[250px] mx-auto leading-relaxed">
                  ทีมงานพร้อมให้คำแนะนำและช่วยเหลือปัญหาอย่างรวดเร็ว
                </p>

                <div className="flex flex-col gap-3">
                  {settings.chatEnabled !== false ? (
                    settings.lineUrl ? (
                      <a
                        href={settings.lineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        ติดต่อผ่านแชท (LINE)
                      </a>
                    ) : (
                      <Link
                        href="/support/chat"
                        className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        ติดต่อผ่านแชท (LINE)
                      </Link>
                    )
                  ) : null}

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/support/contact"
                      className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-lg transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4 text-slate-500" /> ส่งอีเมลถึงเรา
                    </Link>
                    <Link
                      href="/support/contact"
                      className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-lg transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4 text-slate-500" /> โทรหาเรา
                    </Link>
                  </div>
                </div>

                <div className="mt-6 text-xs text-slate-400">
                  เวลาทำการ: {settings.businessHours || "จันทร์ - เสาร์ 9:00 - 18:00 น."}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Bottom Features Banner */}
      <section className="bg-[#eff6ff] py-8 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "ให้คำปรึกษาฟรี", desc: "โดยทีมผู้เชี่ยวชาญ", icon: Info },
              { title: "ตอบกลับรวดเร็ว", desc: "ภายใน 5 นาที", icon: Clock },
              { title: "ปลอดภัย 100%", desc: "ข้อมูลของคุณได้รับการคุ้มครอง", icon: Lock },
              { title: "บริการด้วยใจ", desc: "เราใส่ใจทุกโปรเจกต์", icon: HeartHandshake },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-blue-600 shrink-0">
                  <feat.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{feat.title}</div>
                  <div className="text-xs text-slate-500">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
