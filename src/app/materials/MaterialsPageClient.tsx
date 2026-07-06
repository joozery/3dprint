"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight, CheckCircle2, ShieldCheck, Layers, Cpu, Settings, Thermometer,
    Zap, Droplets, Leaf, Shield, Box, Sparkles, AlertCircle, ArrowRight, Truck,
    CreditCard, HeartHandshake, HeadphonesIcon, Home, type LucideProps,
} from "lucide-react";

export interface MaterialProperty {
    label: string;
    subLabel?: string;
    value: number;
}

export interface MaterialItem {
    _id: string;
    slug: string;
    name: string;
    fullName?: string;
    shortDesc?: string;
    features?: string[];
    properties?: MaterialProperty[];
    nozzleTemp?: string;
    bedTemp?: string;
    cooling?: string;
    iconName?: string;
    iconColor?: string;
    iconBg?: string;
    coverImage?: string;
    thumbnails?: string[];
    detailUrl?: string;
    badge?: string;
}

export interface FaqItem {
    _id: string;
    question: string;
}

export interface UseCaseItem {
    _id: string;
    title: string;
    desc?: string;
    image?: string;
    materials?: string[]; // slug วัสดุที่จะแสดง (ว่าง = ทุกวัสดุ)
}

// Lucide icon lookup for iconName values stored in the database
const ICON_MAP: Record<string, React.FC<LucideProps>> = {
    Leaf, Shield, Box, Droplets, Layers, Zap, Settings, Cpu, Sparkles, Thermometer,
};

// iconColor/iconBg มาจาก DB เป็น string — ระบุ class ที่ใช้ไว้ให้ Tailwind generate
// text-green-500 bg-green-50 text-orange-500 bg-orange-50 text-blue-500 bg-blue-50
// text-cyan-500 bg-cyan-50 text-slate-500 bg-slate-50 text-purple-500 bg-purple-50
// text-zinc-800 bg-zinc-100

const PROPERTY_ICONS: React.FC<LucideProps>[] = [Shield, Thermometer, Sparkles, AlertCircle, Home, Settings];

function materialIcon(item: MaterialItem): React.FC<LucideProps> {
    return ICON_MAP[item.iconName || ""] || Box;
}

function detailHref(item: MaterialItem): string {
    return item.detailUrl || `/materials/${item.slug}`;
}

export default function MaterialsPageClient({ materials, useCases, faqs }: { materials: MaterialItem[]; useCases: UseCaseItem[]; faqs: FaqItem[] }) {
    const [activeSlug, setActiveSlug] = useState(materials[0]?.slug ?? "");
    const active = materials.find((m) => m.slug === activeSlug) ?? materials[0];

    // property labels ของวัสดุแรกใช้เป็นแถวของตารางเปรียบเทียบ
    const compareLabels = materials[0]?.properties?.map((p) => p.label) ?? [];

    // ไอเดียการใช้งานของวัสดุที่เลือกอยู่ (ไม่ระบุวัสดุ = แสดงทุกแท็บ)
    const visibleUseCases = useCases.filter(
        (uc) => !uc.materials?.length || (active && uc.materials.includes(active.slug))
    );

    return (
        <>
            {/* 1. Hero Section */}
            <section className="relative overflow-hidden bg-[#0a0f25] pt-24 pb-16 lg:pt-32 lg:pb-16">
                <Image
                    src="/covermat.png"
                    alt="Materials Background"
                    fill
                    className="object-cover object-center"
                    priority
                />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-[55%]">
                            <div className="text-blue-400 text-xs font-black tracking-widest uppercase mb-4">
                                MATERIAL LIBRARY
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-6 tracking-tight">
                                เลือกวัสดุที่ใช่<br />
                                <span className="text-blue-500">สำหรับทุกโปรเจกต์</span>
                            </h1>
                            <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed font-light">
                                รวบรวมวัสดุคุณภาพสูงสำหรับงานพิมพ์ 3D ครบทุกประเภท เลือกง่าย ได้งานสวย ตอบโจทย์ทุกความต้องการ
                            </p>

                            <a href="#compare" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-lg transition-colors shadow-lg shadow-blue-600/30 mb-10 inline-flex items-center gap-2 w-fit">
                                Compare Materials <ChevronRight className="w-4 h-4" />
                            </a>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Premium Quality</div>
                                        <div className="text-slate-400 text-xs">วัสดุคุณภาพสูง</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                        <Layers className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Wide Selection</div>
                                        <div className="text-slate-400 text-xs">เลือกได้หลากหลาย</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                        <HeadphonesIcon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Technical Support</div>
                                        <div className="text-slate-400 text-xs">ทีมงานพร้อมให้คำแนะนำ</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {materials.length === 0 ? (
                <section className="py-24 text-center text-slate-500">
                    ยังไม่มีข้อมูลวัสดุ กรุณาเพิ่มข้อมูลที่หน้าแอดมิน &quot;หน้า Materials (Content)&quot;
                </section>
            ) : (
                <>
                    {/* 2. Tabs */}
                    <section className="py-3 border-b border-slate-100 bg-white sticky top-[72px] z-40 shadow-sm">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-1">
                                {materials.map((mat) => {
                                    const Icon = materialIcon(mat);
                                    return (
                                        <button
                                            key={mat.slug}
                                            onClick={() => setActiveSlug(mat.slug)}
                                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-lg whitespace-nowrap transition-all border ${
                                                active?.slug === mat.slug
                                                    ? `bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm`
                                                    : `bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300`
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${mat.iconBg || "bg-slate-50"}`}>
                                                <Icon className={`w-3.5 h-3.5 ${mat.iconColor || "text-slate-500"}`} />
                                            </div>
                                            {mat.name}
                                        </button>
                                    );
                                })}
                                <a href="#compare" className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg whitespace-nowrap transition-all border bg-slate-50 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 ml-auto">
                                    <Layers className="w-4 h-4" /> เปรียบเทียบ
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* 3. Material Detail Card */}
                    {active && (
                        <section className="py-12 bg-white">
                            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                                <div className="bg-[#f0f4f8] rounded-2xl border border-white p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                                    {active.coverImage ? (
                                        <Image
                                            src={active.coverImage}
                                            alt={active.name}
                                            fill
                                            className="object-cover object-center pointer-events-none"
                                        />
                                    ) : (
                                        <Image
                                            src="/pla.png"
                                            alt={active.name}
                                            fill
                                            className="object-cover object-center pointer-events-none"
                                        />
                                    )}

                                    <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                                        {/* Left Content */}
                                        <div className="w-full lg:w-[60%] flex flex-col justify-between">
                                            <div className="max-w-md">
                                                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-50`}>
                                                    {(() => {
                                                        const Icon = materialIcon(active);
                                                        return <Icon className={`w-6 h-6 ${active.iconColor || "text-slate-500"}`} />;
                                                    })()}
                                                </div>
                                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight flex items-center gap-3 flex-wrap">
                                                    {active.name}
                                                    {active.fullName && <span className="text-lg font-bold text-slate-500">({active.fullName})</span>}
                                                    {active.badge && (
                                                        <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full">{active.badge}</span>
                                                    )}
                                                </h2>
                                                <p className="text-slate-600 mb-6 leading-relaxed font-medium">
                                                    {active.shortDesc}
                                                </p>

                                                <ul className="space-y-3 mb-8">
                                                    {(active.features || []).map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3">
                                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                                            <span className="text-sm font-bold text-slate-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <Link href={detailHref(active)} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-lg transition-all w-fit flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5">
                                                    ดูรายละเอียด <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>

                                            {/* Thumbnails */}
                                            {(active.thumbnails?.length ?? 0) > 0 && (
                                                <div className="flex gap-4 mt-12 lg:mt-16 z-20">
                                                    {active.thumbnails!.slice(0, 4).map((src, i) => (
                                                        <div key={i} className="w-24 h-24 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-white overflow-hidden relative hover:scale-105 transition-transform">
                                                            <Image src={src} alt={`${active.name} ${i + 1}`} fill className="object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Content: Properties Card */}
                                        <div className="w-full lg:w-[40%] flex justify-end relative z-20">
                                            <div className="w-full max-w-sm bg-white rounded-xl p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                                                <h3 className="text-xl font-black text-slate-900 mb-8">Material Properties</h3>

                                                <div className="space-y-6 mb-10">
                                                    {(active.properties || []).map((prop, i) => {
                                                        const Icon = PROPERTY_ICONS[i % PROPERTY_ICONS.length];
                                                        return (
                                                            <div key={i}>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <Icon className="w-4 h-4 text-slate-500" />
                                                                        <span className="text-xs font-bold text-slate-900">
                                                                            {prop.label}{" "}
                                                                            {prop.subLabel && <span className="text-slate-400 font-medium">{prop.subLabel}</span>}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs font-bold text-slate-900">{prop.value}/5</span>
                                                                </div>
                                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full" style={{ width: `${(prop.value / 5) * 100}%` }}></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 text-center">
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 mb-1 font-semibold">Nozzle Temp.</div>
                                                        <div className="text-sm font-black text-slate-900">{active.nozzleTemp || "–"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 mb-1 font-semibold">Bed Temp.</div>
                                                        <div className="text-sm font-black text-slate-900">{active.bedTemp || "–"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 mb-1 font-semibold">Cooling</div>
                                                        <div className="text-sm font-black text-slate-900">{active.cooling || "–"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 4. Comparison Table */}
                    <section id="compare" className="py-12 bg-white scroll-mt-24">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-8">เปรียบเทียบวัสดุ</h2>

                            <div className="overflow-x-auto hide-scrollbar rounded-xl border border-slate-200">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-5">คุณสมบัติ</th>
                                            {materials.map((mat) => {
                                                const Icon = materialIcon(mat);
                                                return (
                                                    <th key={mat.slug} className="px-6 py-5 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Icon className={`w-4 h-4 ${mat.iconColor || "text-slate-500"}`} /> {mat.name}
                                                        </div>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white text-center font-medium">
                                        {compareLabels.map((label) => (
                                            <tr key={label}>
                                                <td className="px-6 py-4 text-left text-slate-500 font-semibold">{label}</td>
                                                {materials.map((mat) => {
                                                    const prop = mat.properties?.find((p) => p.label === label);
                                                    return (
                                                        <td key={mat.slug} className="px-6 py-4 text-amber-400">
                                                            {prop ? "★".repeat(prop.value) + "☆".repeat(Math.max(0, 5 - prop.value)) : "–"}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50">
                                            <td className="px-6 py-4 text-left text-slate-500 font-semibold">Nozzle Temp.</td>
                                            {materials.map((mat) => (
                                                <td key={mat.slug} className="px-6 py-4 text-slate-700">{mat.nozzleTemp || "–"}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 text-left text-slate-500 font-semibold">Bed Temp.</td>
                                            {materials.map((mat) => (
                                                <td key={mat.slug} className="px-6 py-4 text-slate-700">{mat.bedTemp || "–"}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* 5. Use Cases */}
                    {visibleUseCases.length > 0 && (
                        <section className="py-16 bg-white border-t border-slate-100">
                            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                                <h2 className="text-2xl font-black text-slate-900 mb-8">
                                    ไอเดียการใช้งาน{active && <span className="text-blue-600"> {active.name}</span>}
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {visibleUseCases.map((uc) => (
                                        <div key={uc._id} className="bg-[#f8fafc] rounded-xl p-6 border border-slate-100 text-center flex flex-col">
                                            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative mb-6 bg-slate-100">
                                                {uc.image && (
                                                    <Image src={uc.image} alt={uc.title} fill className="object-cover" />
                                                )}
                                            </div>
                                            <h3 className="font-black text-lg text-slate-900 mb-1">{uc.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium">{uc.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* 6. FAQ / Consultation */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-16">
                    <div className="w-full lg:w-1/3">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                            ยังไม่แน่ใจ<br />ควรเลือกวัสดุอะไร?
                        </h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            ทีมงานผู้เชี่ยวชาญพร้อมให้คำแนะนำ เพื่อช่วยให้คุณเลือกวัสดุที่เหมาะสมกับงานของคุณที่สุด
                        </p>
                        <Link href="/support" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-colors shadow-lg shadow-blue-600/30">
                            ปรึกษาผู้เชี่ยวชาญฟรี <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {faqs.length > 0 && (
                        <div className="w-full lg:w-2/3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-900">คำถามที่พบบ่อย</h3>
                                <Link href="/support/faq" className="text-sm font-bold text-blue-600 hover:underline">ดูทั้งหมด</Link>
                            </div>
                            <div className="space-y-3">
                                {faqs.map((faq) => (
                                    <Link key={faq._id} href="/support/faq" className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors">
                                        <span className="font-bold text-slate-700 text-sm">{faq.question}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 7. Footer Features */}
            <section className="py-10 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex items-center gap-4">
                            <Truck className="w-6 h-6 text-slate-400" />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">Fast Delivery</div>
                                <div className="text-xs text-slate-500">จัดส่งรวดเร็ว</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <CreditCard className="w-6 h-6 text-slate-400" />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">Secure Payment</div>
                                <div className="text-xs text-slate-500">ชำระเงินปลอดภัย</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <HeartHandshake className="w-6 h-6 text-slate-400" />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">Satisfaction Guarantee</div>
                                <div className="text-xs text-slate-500">รับประกันความพึงพอใจ</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <HeadphonesIcon className="w-6 h-6 text-slate-400" />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">24/7 Support</div>
                                <div className="text-xs text-slate-500">บริการช่วยเหลือ 24 ชม.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
