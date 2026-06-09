"use client";

import Navbar from "@/components/layout/Navbar";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const posts = [
    { slug: "1", category: "Design Tips", categoryColor: "bg-blue-100 text-blue-700", title: "วิธีออกแบบไฟล์ 3D ให้พิมพ์ได้ไม่มีปัญหา", excerpt: "ปัญหาที่พบบ่อยที่สุดในงานพิมพ์ 3D คือไฟล์ที่ออกแบบมาไม่รองรับกระบวนการผลิต บทความนี้จะแนะนำ 10 สิ่งที่ต้องเช็คก่อนส่งไฟล์", date: "5 มิ.ย. 2568", readTime: "8 นาที" },
    { slug: "2", category: "เทคโนโลยี", categoryColor: "bg-purple-100 text-purple-700", title: "เปรียบเทียบ FDM vs SLA เลือกอะไรดีสำหรับงานคุณ?", excerpt: "FDM กับ SLA ต่างกันอย่างไร? เมื่อไรควรใช้แบบไหน? บทความนี้เปรียบเทียบแบบละเอียดพร้อมตัวอย่างงานจริง", date: "1 มิ.ย. 2568", readTime: "6 นาที" },
    { slug: "3", category: "วัสดุ", categoryColor: "bg-green-100 text-green-700", title: "10 วัสดุที่นิยมพิมพ์ 3D มากที่สุดในปี 2025", excerpt: "PLA, ABS, PETG, TPU, Resin, Nylon... มีให้เลือกมากมาย แต่ละตัวเหมาะกับงานแบบไหน? สรุปให้ครบในบทความเดียว", date: "28 พ.ค. 2568", readTime: "10 นาที" },
    { slug: "4", category: "DIY Tips", categoryColor: "bg-amber-100 text-amber-700", title: "Post-Processing ทำได้เองที่บ้านง่ายๆ ไม่ต้องเป็นช่าง", excerpt: "ขัดเรียบ ทาสี และทำให้ชิ้นงาน 3D ดูสวยงามมืออาชีพได้ง่ายๆ ด้วยวัสดุที่หาได้ตามร้านทั่วไป", date: "20 พ.ค. 2568", readTime: "5 นาที" },
    { slug: "5", category: "Case Study", categoryColor: "bg-red-100 text-red-700", title: "3D Printing กับอุตสาหกรรมยานยนต์ไทย — เปลี่ยนเกมการผลิต", excerpt: "ค้นพบว่าบริษัทยานยนต์ไทยชั้นนำใช้ 3D Printing ลดต้นทุนการผลิต Prototype ลง 80% และเร่งเวลา Time-to-Market อย่างไร", date: "15 พ.ค. 2568", readTime: "12 นาที" },
    { slug: "6", category: "Getting Started", categoryColor: "bg-teal-100 text-teal-700", title: "Guide ฉบับสมบูรณ์: ส่งออร์เดอร์แรกกับ PDM ให้สำเร็จ", excerpt: "ตั้งแต่เปิดบัญชีจนถึงรับชิ้นงานที่บ้าน ทำตามขั้นตอนนี้ได้เลย ไม่ต้องมีความรู้ 3D มาก่อน", date: "10 พ.ค. 2568", readTime: "7 นาที" },
];

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <FileText className="w-4 h-4" /> บทความ
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">บทความและเทคนิค</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            เรียนรู้เทคนิค 3D Printing เทรนด์ล่าสุด และ Case Study จากทีมวิศวกรของเรา
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post) => (
                            <article key={post.slug} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="bg-slate-200 h-48 w-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-slate-400" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>{post.category}</span>
                                        <span className="text-xs text-slate-400">{post.date}</span>
                                        <span className="text-xs text-slate-400">· {post.readTime}</span>
                                    </div>
                                    <h2 className="font-black text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                                        อ่านต่อ <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white text-center">
                        <h3 className="text-xl font-black mb-2">รับบทความใหม่ก่อนใคร</h3>
                        <p className="text-blue-100 text-sm mb-6">สมัครรับ Newsletter รับเทคนิคและโปรโมชั่นพิเศษทุกสัปดาห์</p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input type="email" placeholder="อีเมลของคุณ" className="flex-1 px-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none" />
                            <button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap">
                                ติดตาม
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
