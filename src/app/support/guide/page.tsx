import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  linkUrl?: string;
  type: string;
  order: number;
}

async function getGuides(): Promise<Article[]> {
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

export default async function GuidePage() {
  const guides = await getGuides();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-400/20">
              <BookOpen className="w-3.5 h-3.5" /> คู่มือการใช้งาน
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              คู่มือและบทแนะนำ<br />
              <span className="text-blue-400">3D Printing</span>
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
                const Wrapper = guide.linkUrl ? Link : "div";
                const wrapperProps = guide.linkUrl
                  ? { href: guide.linkUrl, target: guide.linkUrl.startsWith("http") ? "_blank" : undefined, rel: guide.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined }
                  : {};

                return (
                  <Wrapper
                    key={guide._id}
                    {...(wrapperProps as any)}
                    className={`group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 ${guide.linkUrl ? "hover:shadow-lg hover:border-blue-200 cursor-pointer" : ""}`}
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
                      {guide.linkUrl && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                          {guide.linkUrl.startsWith("http") ? (
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
            <Link href="/support/faq" className="group flex items-center gap-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 rounded-2xl p-5 transition-all">
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
