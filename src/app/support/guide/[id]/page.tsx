import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import dbConnect from "@/lib/mongoose";
import Article from "@/models/Article";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Calendar } from "lucide-react";

// แยกเนื้อหาเป็น block ข้อความ / รูปภาพ — รูปใช้รูปแบบ ![alt](url) บรรทัดเดี่ยว
type ContentBlock = { kind: "text"; text: string } | { kind: "image"; src: string; alt: string };

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const imgRe = /^!\[([^\]]*)\]\((\S+)\)$/;
  let buf: string[] = [];
  for (const line of content.split("\n")) {
    const m = line.trim().match(imgRe);
    if (m) {
      if (buf.length) { blocks.push({ kind: "text", text: buf.join("\n") }); buf = []; }
      blocks.push({ kind: "image", src: m[2], alt: m[1] || "รูปประกอบ" });
    } else {
      buf.push(line);
    }
  }
  if (buf.length) blocks.push({ kind: "text", text: buf.join("\n") });
  return blocks;
}

export default async function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  await dbConnect();
  const guide: any = await Article.findOne({ _id: id, type: "guide", isActive: true }).lean();
  if (!guide) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex-1">
        {/* Hero — ใช้รูปหน้าปกเป็น cover เต็มพื้นหลัง */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white pt-28 pb-16 px-4">
          {guide.thumbnail && (
            <>
              <Image
                src={guide.thumbnail}
                alt={guide.title}
                fill
                className="object-cover"
                priority
              />
              {/* overlay ให้ตัวหนังสืออ่านชัดบนรูป */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </>
          )}
          <div className="max-w-3xl mx-auto relative z-10">
            <Link
              href="/support/guide"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> คู่มือทั้งหมด
            </Link>
            <span className="flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
              <BookOpen className="w-3.5 h-3.5" /> คู่มือการใช้งาน
            </span>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">{guide.title}</h1>
            {guide.description && (
              <p className="text-slate-400 text-base leading-relaxed">{guide.description}</p>
            )}
            {guide.createdAt && (
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-5">
                <Calendar className="w-3.5 h-3.5" />
                อัพเดทล่าสุด {new Date(guide.updatedAt || guide.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-12">
          {guide.content ? (
            <div className="text-slate-700 leading-loose text-[15px]">
              {parseContent(guide.content).map((block, i) =>
                block.kind === "image" ? (
                  <div key={i} className="relative w-full my-8 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.src} alt={block.alt} className="w-full h-auto" />
                  </div>
                ) : (
                  <div key={i} className="whitespace-pre-line">{block.text}</div>
                )
              )}
            </div>
          ) : (
            <p className="text-slate-400 italic text-sm">เนื้อหากำลังจัดทำ โปรดกลับมาดูใหม่เร็วๆ นี้</p>
          )}

          {/* CTA จาก linkUrl ของคู่มือ */}
          {guide.linkUrl && (
            <div className="mt-12">
              <Link
                href={guide.linkUrl}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-blue-600/20"
              >
                ลองใช้งานเลย <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Bottom link */}
          <div className="mt-14 pt-8 border-t border-slate-100">
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
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
