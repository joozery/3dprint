"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight, Upload } from "lucide-react";

// ============================================================
// กำหนด Slides ที่นี่ — เปลี่ยน src และ type ได้เลย
// type: "image" | "video" | "youtube"
// ============================================================
type Slide = {
    id: number;
    type: "image" | "video" | "youtube";
    src: string;
    overlay: string;
    badge: string;
    title: string;
    titleHighlight: string;
    titleEnd: string;
    bullets: string[];
    cta: { label: string; href: string };
    cta2: { label: string; href: string };
};

const defaultSlides: Slide[] = [
    {
        id: 1,
        type: "image" as const,
        src: "/bghero/cover1.png",
        overlay: "from-slate-900/70 via-slate-900/40 to-transparent",
        badge: "🚀 บริการพิมพ์ 3D อัตโนมัติ",
        title: "ออกแบบ. พิมพ์.",
        titleHighlight: "สร้างต้นแบบ 3D",
        titleEnd: "ได้ทันที",
        bullets: [
            "อัปโหลดไฟล์ STL/OBJ และรับราคาทันที",
            "รองรับ FDM, SLA — วัสดุกว่า 50 ชนิด",
        ],
        cta: { label: "เริ่มสั่งพิมพ์เลย", href: "/quote" },
        cta2: { label: "อัปโหลดไฟล์", href: "/quote" },
    },
    {
        id: 2,
        type: "image" as const,
        src: "/bghero/cover1.png", // 👈 เปลี่ยนเป็น cover2.png เมื่อมีไฟล์
        overlay: "from-blue-900/70 via-blue-900/30 to-transparent",
        badge: "⚡ Instant Quote Engine",
        title: "รับราคา",
        titleHighlight: "อัตโนมัติแม่นยำ",
        titleEnd: "ภายใน 30 วินาที",
        bullets: [
            "คำนวณผ่าน PrusaSlicer CLI จริง",
            "น้ำหนัก + เวลาพิมพ์ แม่นยำ 100%",
        ],
        cta: { label: "ทดลองคำนวณราคา", href: "/quote" },
        cta2: { label: "เรียนรู้เพิ่มเติม", href: "/about" },
    },
    {
        id: 3,
        type: "youtube" as const,
        src: "f94CnlQ0eq4", // YouTube video ID
        overlay: "from-slate-950/70 via-slate-900/30 to-transparent",
        badge: "🏢 รองรับลูกค้าองค์กร B2B",
        title: "ใบเสนอราคา",
        titleHighlight: "PDF อัตโนมัติ",
        titleEnd: "พร้อมรับ PO",
        bullets: [
            "สร้างใบเสนอราคา PDF ได้ทันที",
            "รองรับ Purchase Order จากองค์กร",
        ],
        cta: { label: "ลงทะเบียนองค์กร", href: "/register" },
        cta2: { label: "ดูรายละเอียด", href: "/services" },
    },
];

const AUTOPLAY_INTERVAL = 5000;

export default function HeroSection() {
    const [slides, setSlides] = useState<any[]>(defaultSlides);
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        fetch("/api/public/banners")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.banners && data.banners.length > 0) {
                    // Map _id to id to avoid breaking old component keys if needed
                    const fetchedSlides = data.banners.map((b: any) => ({ ...b, id: b._id }));
                    setSlides(fetchedSlides);
                }
            })
            .catch(console.error);
    }, []);

    const goTo = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setProgress(0);
        setTimeout(() => {
            setCurrent(index);
            setIsTransitioning(false);
        }, 400);
    }, [isTransitioning]);

    const next = useCallback(() => {
        goTo((current + 1) % slides.length);
    }, [current, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + slides.length) % slides.length);
    }, [current, goTo]);

    // Auto-play
    const startAutoplay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    }, [next]);

    // Progress bar
    const startProgress = useCallback(() => {
        if (progressRef.current) clearInterval(progressRef.current);
        setProgress(0);
        const step = 100 / (AUTOPLAY_INTERVAL / 50);
        progressRef.current = setInterval(() => {
            setProgress((p) => Math.min(p + step, 100));
        }, 50);
    }, []);

    useEffect(() => {
        startAutoplay();
        startProgress();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
        };
    }, [current, startAutoplay, startProgress]);

    // Play/pause video on slide change
    useEffect(() => {
        videoRefs.current.forEach((vid, i) => {
            if (!vid) return;
            if (i === current) {
                vid.currentTime = 0;
                vid.play().catch(() => { });
            } else {
                vid.pause();
            }
        });
    }, [current]);

    const slide = slides[current];

    return (
        <section className="relative overflow-hidden w-full min-h-[520px] lg:min-h-[620px] bg-slate-900">

            {/* ── Slides ── */}
            {slides.map((s, i) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${i === current && !isTransitioning ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {s.type === "image" ? (
                        <Image
                            src={s.src}
                            alt={`Slide ${s.id}`}
                            fill
                            priority={i === 0}
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                    ) : s.type === "youtube" ? (
                        // YouTube iframe เป็นพื้นหลัง
                        <div className="absolute inset-0 overflow-hidden">
                            <iframe
                                src={`https://www.youtube.com/embed/${s.src}?autoplay=1&mute=1&loop=1&playlist=${s.src}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                                className="absolute"
                                style={{
                                    top: "50%",
                                    left: "50%",
                                    width: "177.78vh",   /* 16:9 ratio */
                                    height: "56.25vw",  /* 16:9 ratio */
                                    minWidth: "100%",
                                    minHeight: "100%",
                                    transform: "translate(-50%, -50%)",
                                    pointerEvents: "none",
                                    border: "none",
                                }}
                                allow="autoplay; encrypted-media"
                                allowFullScreen={false}
                                title={`YouTube Slide ${s.id}`}
                            />
                        </div>
                    ) : (
                        <video
                            ref={(el) => { videoRefs.current[i] = el; }}
                            src={s.src}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                            autoPlay={i === 0}
                            muted
                            loop
                            playsInline
                        />
                    )}
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
                </div>
            ))}

            {/* ── Content ── */}
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center min-h-[520px] lg:min-h-[620px] px-6 lg:px-8">
                <div
                    key={current}
                    className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
                >


                    <h1 className="text-4xl font-extrabold leading-tight text-white lg:text-5xl xl:text-[3.5rem] drop-shadow-md">
                        {slide.title}{" "}
                        <span className="text-blue-400">{slide.titleHighlight}</span>{" "}
                        {slide.titleEnd}
                    </h1>

                    <ul className="mt-4 flex flex-col gap-2">
                        {slide.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-2 text-slate-200 text-sm lg:text-base">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                {b}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 rounded-full px-8 font-semibold transition-all hover:scale-105"
                            asChild
                        >
                            <Link href={slide.cta.href}>
                                {slide.cta.label}
                                <ArrowRight size={18} className="ml-2" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-transparent hover:bg-white/10 text-white border-white/40 rounded-full px-8 font-semibold backdrop-blur-sm transition-all hover:scale-105"
                            asChild
                        >
                            <Link href={slide.cta2.href}>
                                <Upload size={16} className="mr-2" />
                                {slide.cta2.label}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Prev / Next Arrows ── */}
            <button
                onClick={() => { prev(); startAutoplay(); }}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 backdrop-blur-sm transition-all"
                aria-label="Previous"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={() => { next(); startAutoplay(); }}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 backdrop-blur-sm transition-all"
                aria-label="Next"
            >
                <ChevronRight size={20} />
            </button>

            {/* ── Indicators (JLC3DP style) ── */}
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => { goTo(i); startAutoplay(); }}
                        className="group relative h-1 overflow-hidden rounded-full bg-white/30 transition-all duration-300"
                        style={{ width: i === current ? 48 : 24 }}
                        aria-label={`Go to slide ${i + 1}`}
                    >
                        {i === current && (
                            <span
                                className="absolute inset-y-0 left-0 rounded-full bg-white transition-none"
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
