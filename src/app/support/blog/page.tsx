import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { FileText, ArrowRight, ExternalLink, Calendar } from "lucide-react";
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
  createdAt?: string;
}

async function getBlogPosts(): Promise<Article[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/public/articles?type=blog`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-400/20">
              <FileText className="w-3.5 h-3.5" /> บทความ
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              บทความและเทคนิค<br />
              <span className="text-blue-400">3D Printing</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              เรียนรู้เทคนิค 3D Printing เทรนด์ล่าสุด และ Case Study จากทีมวิศวกรของเรา
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const Wrapper = post.linkUrl ? Link : "div";
                const wrapperProps = post.linkUrl
                  ? { href: post.linkUrl, target: post.linkUrl.startsWith("http") ? "_blank" : undefined, rel: post.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined }
                  : {};

                return (
                  <Wrapper
                    key={post._id}
                    {...(wrapperProps as any)}
                    className={`group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 ${post.linkUrl ? "hover:shadow-lg hover:border-blue-200 cursor-pointer" : ""}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {post.thumbnail ? (
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                          บทความ
                        </span>
                        {post.createdAt && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h2 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                          {post.description}
                        </p>
                      )}
                      {post.linkUrl && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                          {post.linkUrl.startsWith("http") ? (
                            <><ExternalLink className="w-3 h-3" /> เปิดอ่าน</>
                          ) : (
                            <><ArrowRight className="w-3 h-3" /> อ่านต่อ</>
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
              <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FileText className="w-10 h-10 text-purple-300" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-2">ยังไม่มีบทความ</h3>
              <p className="text-slate-400 text-sm">ทีมงานกำลังจัดทำบทความ โปรดกลับมาดูใหม่เร็วๆ นี้</p>
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 md:p-10 text-white text-center shadow-xl shadow-blue-200">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black mb-2">รับบทความใหม่ก่อนใคร</h3>
            <p className="text-blue-100 text-sm mb-6 max-w-sm mx-auto">สมัครรับ Newsletter รับเทคนิคและโปรโมชั่นพิเศษทุกสัปดาห์</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="flex-1 px-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap shadow-sm">
                ติดตาม
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
