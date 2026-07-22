import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/mongoose";
import ArticleModel from "@/models/Article";

interface Article {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  linkUrl?: string;
  content?: string;
  type: string;
  order: number;
}

async function getGuides(): Promise<Article[]> {
  try {
    await dbConnect();
    const guides = await ArticleModel.find({ type: "guide", isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(guides));
  } catch {
    return [];
  }
}

// มี content → เปิดหน้าอ่านในเว็บ, ไม่มีก็ไปตาม linkUrl เดิม
function guideHref(guide: Article): string | null {
  if (guide.content) return `/support/guide/${guide._id}`;
  return guide.linkUrl || null;
}

export default async function GuidePage() {
  const guides = await getGuides();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#080c14] text-white pt-32 pb-24 px-4">
          {/* glow orbs */}
          <div className="absolute -top-24 -right-16 w-96 h-96 bg-[#2563eb] rounded-full blur-[120px] opacity-25 pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-[#0ea5e9] rounded-full blur-[110px] opacity-15 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#1d4ed8] rounded-full blur-[150px] opacity-10 pointer-events-none" />

          {/* subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          {/* fade grid ให้จางลงด้านล่าง */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080c14] to-transparent pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-[0.2em] uppercase text-[11px] mb-6 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-400/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <BookOpen className="w-3.5 h-3.5" /> คู่มือการใช้งาน
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight tracking-tight">
              คู่มือและบทแนะนำ<br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">3D Printing</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              รวบรวมคู่มือการใช้งานสำหรับลูกค้าใหม่และผู้ที่ต้องการเรียนรู้เพิ่มเติม
              ตั้งแต่การเตรียมไฟล์ไปจนถึงการรับชิ้นงาน
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16">
          {guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guides.map((guide) => {
                const href = guideHref(guide);
                const Wrapper = href ? Link : "div";
                const isExternal = !!href && href.startsWith("http");
                const wrapperProps = href
                  ? { href, target: isExternal ? "_blank" : undefined, rel: isExternal ? "noopener noreferrer" : undefined }
                  : {};

                return (
                  <Wrapper
                    key={guide._id}
                    {...(wrapperProps as any)}
                    className={`group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 ${href ? "hover:shadow-lg hover:border-blue-200 cursor-pointer" : ""}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {guide.thumbnail ? (
                        <Image
                          src={guide.thumbnail}
                          alt={guide.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                      {/* overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      {/* badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-600 text-white rounded-full shadow">
                          คู่มือการใช้งาน
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      {guide.description && (
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                          {guide.description}
                        </p>
                      )}
                      {href && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                          {isExternal ? (
                            <><ExternalLink className="w-3.5 h-3.5" /> เปิดอ่าน</>
                          ) : (
                            <><ArrowRight className="w-3.5 h-3.5" /> อ่านต่อ</>
                          )}
                        </span>
                      )}
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-10 h-10 text-blue-300" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-2">ยังไม่มีคู่มือ</h3>
              <p className="text-slate-400 text-sm">ทีมงานกำลังจัดทำคู่มือการใช้งาน โปรดกลับมาดูใหม่เร็วๆ นี้</p>
            </div>
          )}

          {/* Bottom links */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/support" className="group flex items-center gap-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 rounded-2xl p-5 transition-all">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-blue-900 text-sm">ยังมีคำถาม?</p>
                <p className="text-xs text-blue-600 mt-0.5">ดูคำถามที่พบบ่อยของเรา</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/support/contact" className="group flex items-center gap-4 bg-green-50 hover:bg-green-100 border border-green-100 hover:border-green-200 rounded-2xl p-5 transition-all">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0 shadow">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-900 text-sm">ต้องการความช่วยเหลือ?</p>
                <p className="text-xs text-green-600 mt-0.5">ทีมงานพร้อมช่วยคุณ</p>
              </div>
              <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
