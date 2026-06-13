"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    UploadCloud,
    Settings2,
    Printer,
    Truck,
    Layers,
    Cpu,
    Zap,
    CheckCircle2,
    Globe,
    Mail,
    Phone,
    ArrowRight,
    Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

// --- Section 1: Technologies ---
export function TechSection() {
    const { t } = useLanguage();

    const techs = [
        {
            title: "FDM Printing",
            subtitle: "Fused Deposition Modeling",
            description: t.tech.fdmDesc,
            features: [t.tech.fdmF1, t.tech.fdmF2, t.tech.fdmF3],
            icon: <Layers className="h-8 w-8 text-blue-500" />,
            color: "blue"
        },
        {
            title: "SLA Resin",
            subtitle: "Stereolithography",
            description: t.tech.slaDesc,
            features: [t.tech.slaF1, t.tech.slaF2, t.tech.slaF3],
            icon: <Cpu className="h-8 w-8 text-purple-500" />,
            color: "purple"
        }
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl mb-4">{t.tech.heading}</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {t.tech.subheading}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {techs.map((tech) => (
                        <Card key={tech.title} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4">
                                    <div className={`p-4 rounded-2xl bg-${tech.color}-50`}>
                                        {tech.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">{tech.title}</h3>
                                        <p className="text-sm text-blue-600 font-medium mb-4">{tech.subtitle}</p>
                                        <p className="text-slate-600 mb-6 leading-relaxed">
                                            {tech.description}
                                        </p>
                                        <ul className="space-y-3">
                                            {tech.features.map((f) => (
                                                <li key={f} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Section 2: How It Works ---
export function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        {
            title: t.howItWorks.step1Title,
            desc: t.howItWorks.step1Desc,
            icon: <UploadCloud className="h-6 w-6 text-blue-600" />,
            color: "blue",
            delay: "0"
        },
        {
            title: t.howItWorks.step2Title,
            desc: t.howItWorks.step2Desc,
            icon: <Settings2 className="h-6 w-6 text-indigo-600" />,
            color: "indigo",
            delay: "100"
        },
        {
            title: t.howItWorks.step3Title,
            desc: t.howItWorks.step3Desc,
            icon: <Printer className="h-6 w-6 text-violet-600" />,
            color: "violet",
            delay: "200"
        },
        {
            title: t.howItWorks.step4Title,
            desc: t.howItWorks.step4Desc,
            icon: <Truck className="h-6 w-6 text-sky-600" />,
            color: "sky",
            delay: "300"
        }
    ];

    return (
        <section className="py-28 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 w-full max-w-7xl -translate-x-1/2 h-full opacity-50 pointer-events-none">
                <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-300/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-indigo-300/20 blur-[120px] rounded-full" />
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100/60 border border-blue-200/60 mb-6 backdrop-blur-sm">
                        <span className="text-[11px] font-black text-blue-700 tracking-[0.2em] uppercase">{t.howItWorks.badge}</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 md:text-5xl mb-6 tracking-tight leading-tight">
                        {t.howItWorks.heading1}<br className="hidden md:block" />
                        <span className="text-blue-600 drop-shadow-sm">{t.howItWorks.heading2}</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        {t.howItWorks.subheading}
                    </p>
                </div>

                <div className="relative mt-10">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden lg:block absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group" style={{ transitionDelay: `${step.delay}ms` }}>
                                {/* Step Content */}
                                <div className="flex flex-col items-center text-center relative z-10">
                                    
                                    {/* Icon Box */}
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-blue-100">
                                            <div className={`w-14 h-14 rounded-2xl bg-${step.color}-50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                                                {step.icon}
                                            </div>
                                        </div>
                                        
                                        {/* Step Number Badge */}
                                        <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-${step.color}-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-${step.color}-300 border-2 border-white transform transition-transform duration-300 group-hover:scale-110`}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div className="bg-white/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-2xl border border-white/50 md:border-none">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-blue-600">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Newsletter Form Component ---
type NewsletterStatus = "idle" | "success" | "error" | "duplicate";

function NewsletterForm({ t }: { t: { footer: { newsletterTitle: string; newsletterDesc: string; newsletterPlaceholder: string; newsletterBtn: string } } }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<NewsletterStatus>("idle");

    const handleSubmit = async () => {
        if (!email.trim()) return;
        try {
            setLoading(true);
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.status === 409) {
                setStatus("duplicate");
            } else if (data.success) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-800/60 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
            <div>
                <h3 className="text-white text-lg font-bold mb-2">{t.footer.newsletterTitle}</h3>
                <p className="text-sm text-slate-400">{t.footer.newsletterDesc}</p>
            </div>
            {status === "success" ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    สมัครสำเร็จแล้ว ขอบคุณ!
                </div>
            ) : (
                <div className="flex flex-col w-full xl:w-auto gap-2">
                    <div className="flex w-full xl:w-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder={t.footer.newsletterPlaceholder}
                            className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-sm w-full xl:w-64"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-6 py-3 rounded-r-lg font-medium transition-colors flex items-center shrink-0"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>{t.footer.newsletterBtn} <ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </button>
                    </div>
                    {status === "duplicate" && (
                        <p className="text-xs text-amber-400 font-medium">อีเมลนี้สมัครไว้แล้ว</p>
                    )}
                    {status === "error" && (
                        <p className="text-xs text-red-400 font-medium">เกิดข้อผิดพลาด กรุณาลองใหม่</p>
                    )}
                </div>
            )}
        </div>
    );
}

type FooterLinkItem = { _id: string; label: string; url: string; openInNewTab: boolean };

// --- Section 3: Footer ---
export function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();
    const [dbLinks, setDbLinks] = useState<Record<string, FooterLinkItem[]>>({});

    useEffect(() => {
        fetch("/api/admin/footer-links")
            .then(r => r.json())
            .then(data => {
                if (data.links) {
                    const grouped: Record<string, FooterLinkItem[]> = {};
                    for (const link of data.links) {
                        if (!link.isActive) continue;
                        if (!grouped[link.category]) grouped[link.category] = [];
                        grouped[link.category].push(link);
                    }
                    setDbLinks(grouped);
                }
            })
            .catch(() => {});
    }, []);

    const categories: Array<{ key: string; headingKey: string }> = [
        { key: "services",  headingKey: "servicesHeading" },
        { key: "materials", headingKey: "materialsHeading" },
        { key: "resources", headingKey: "resourcesHeading" },
        { key: "company",   headingKey: "companyHeading" },
    ];

    return (
        <footer className="bg-[#0f172a] text-slate-300 pt-20 pb-10 border-t border-slate-800">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
                {/* Top Section: Newsletter & Branding */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-slate-800/60">
                    <div className="lg:col-span-5">
                        <div className="mb-6">
                            <Image
                                src="/logo/logo.png"
                                alt="Print My Design Logo"
                                width={180}
                                height={70}
                                className="h-14 w-auto object-contain"
                            />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
                            {t.footer.tagline}
                        </p>
                    </div>

                    <div className="lg:col-span-7">
                        <NewsletterForm t={t} />
                    </div>
                </div>

                {/* Middle Section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                    {/* Contact column */}
                    <div className="col-span-2 lg:col-span-1">
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Global Presence</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 hover:text-white cursor-pointer transition-colors">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span>Thailand (TH/EN)</span>
                        </div>
                        <div className="space-y-3 mt-8">
                            <h4 className="text-white font-bold tracking-wide text-sm uppercase mb-4">Contact</h4>
                            <a href="mailto:services@printmydesign.net" className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                <Mail className="w-4 h-4" /> services@printmydesign.net
                            </a>
                            <a href="tel:+6620287445" className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                <Phone className="w-4 h-4" /> +66 2 028 7445
                            </a>
                        </div>
                    </div>

                    {/* Dynamic link columns from DB */}
                    {categories.map(({ key, headingKey }) => {
                        const links = dbLinks[key] || [];
                        return (
                            <div key={key}>
                                <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">
                                    {(t.footer as any)[headingKey]}
                                </h4>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    {links.map(link => (
                                        <li key={link._id}>
                                            <Link
                                                href={link.url}
                                                target={link.openInNewTab ? "_blank" : undefined}
                                                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                                                className="hover:text-blue-400 transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                    {links.length === 0 && (
                                        <li className="text-slate-600 text-xs italic">ยังไม่มีลิ้งค์</li>
                                    )}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-slate-500">
                        © {currentYear} PrintMyDesign by Septillion Co., Ltd. {t.footer.copyright}
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-bold">
                        <Link href="/privacy" className="hover:text-blue-400 transition-colors">{t.footer.privacy}</Link>
                        <Link href="/terms" className="hover:text-blue-400 transition-colors">{t.footer.terms}</Link>
                        <Link href="/cookies" className="hover:text-blue-400 transition-colors">{t.footer.cookies}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
