"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BentoSection() {
    return (
        <section className="bg-white py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Why Choose Us</p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                            ทำไมต้องเลือก<br />
                            <span className="text-blue-600">3DEV</span>
                        </h2>
                    </div>
                    <Link
                        href="/quote"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                    >
                        เริ่มสั่งพิมพ์เลย
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]">

                    {/* Card 1 — Large (md:col-span-2, top-left) */}
                    <div className="md:col-span-2 relative rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                        <div className="absolute bottom-0 right-0 w-[55%] h-[90%] opacity-90 transition-transform duration-500 group-hover:scale-105">
                            <Image src="/showcase/metal.png" alt="Metal Print" fill className="object-contain object-right-bottom drop-shadow-2xl" />
                        </div>
                        <div className="relative z-10 p-7 flex flex-col justify-end h-full">
                            <div>
                                <h3 className="text-xl font-black text-white leading-snug mb-2 max-w-[55%]">
                                    พิมพ์ชิ้นงานด้วย<br />วัสดุระดับอุตสาหกรรม
                                </h3>
                                <p className="text-sm text-slate-400 max-w-[50%] leading-relaxed">
                                    รองรับวัสดุหลากหลาย ทั้งเรซิ่น ไนลอน และโลหะ
                                </p>
                                <Link href="/quote" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    สั่งพิมพ์เลย <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 — Small (top-right) */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-800 group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-bl from-slate-700 to-slate-900" />
                        <div className="absolute top-4 right-4 w-[60%] h-[60%] opacity-85 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <Image src="/showcase/black.png" alt="Black Resin Print" fill className="object-contain drop-shadow-2xl" />
                        </div>
                        <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                            <h3 className="text-base font-black text-white leading-snug mb-1.5 max-w-[70%]">
                                อัปโหลดไฟล์<br />รับราคาทันที
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-[80%]">
                                ระบบวิเคราะห์ไฟล์อัตโนมัติ ไม่ต้องรอราคา
                            </p>
                        </div>
                    </div>

                    {/* Card 3 — Small (bottom-left) */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer">
                        <div className="absolute top-4 right-4 w-[55%] h-[60%] transition-transform duration-500 group-hover:scale-110">
                            <Image src="/showcase/resin.png" alt="Color Resin" fill className="object-contain drop-shadow-xl" />
                        </div>
                        <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                            <h3 className="text-base font-black text-slate-900 leading-snug mb-1.5 max-w-[70%]">
                                สี & พื้นผิว<br />หลากหลาย
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[80%]">
                                Full Color จนถึงผิวด้านระดับ Pro
                            </p>
                        </div>
                    </div>

                    {/* Card 4 — Large (bottom-right, md:col-span-2) */}
                    <div className="md:col-span-2 relative rounded-2xl overflow-hidden bg-slate-700 group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-900" />
                        <div className="absolute -bottom-4 left-[40%] w-[55%] h-[110%] opacity-90 transition-transform duration-500 group-hover:scale-105">
                            <Image src="/showcase/sls.png" alt="SLS Nylon" fill className="object-contain object-bottom drop-shadow-2xl" />
                        </div>
                        <div className="relative z-10 p-7 flex flex-col justify-end h-full">
                            <div className="max-w-[42%]">
                                <h3 className="text-xl font-black text-white leading-snug mb-2">
                                    คุณภาพสูง<br />ผ่านการตรวจสอบทุกชิ้น
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    ทีมงานตรวจสอบคุณภาพก่อนส่งมอบทุกครั้ง รับประกันความพอใจ
                                </p>
                                <Link href="/quote" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    ดูตัวอย่างงาน <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
