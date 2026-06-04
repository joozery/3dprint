"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function ShowcaseSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t, lang } = useLanguage();

    const showcaseItems = [
        {
            image: "/showcase/metal.png",
            label: lang === 'th' ? "วัสดุโลหะ" : "Metal Materials",
        },
        {
            image: "/showcase/black.png",
            label: lang === 'th' ? "วัสดุ เรซิ่น ผิวเรียบ" : "Smooth Texture Resin Materials",
        },
        {
            image: "/showcase/clear.png",
            label: lang === 'th' ? "วัสดุ เรซิ่น ใส" : "Transparent Resin Materials",
        },
        {
            image: "/showcase/sls.png",
            label: lang === 'th' ? "วัสดุ ไนลอน 11, 12" : "Nylon 11, 12 Materials",
        },
    ];


    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === "left" ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {t.showcase.heading}
                </h2>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <p className="mt-6 text-lg leading-8 text-slate-600 max-w-3xl">
                        {t.showcase.subheading}
                    </p>

                    {/* Desktop Navigation Arrows */}
                    <div className="hidden md:flex items-center gap-2 mb-2">
                        <button
                            onClick={() => scroll("left")}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="mt-12 flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory showcase-container"
                >
                    {showcaseItems.map((item, index) => (
                        <div key={index} className="flex-none w-64 md:w-72 snap-start">
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:scale-[1.01]">
                                <Image
                                    src={item.image}
                                    alt={item.label}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 256px, 288px"
                                />
                            </div>
                            <p className="mt-4 text-center text-sm font-medium text-slate-500">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>

                <style jsx>{`
                    .showcase-container {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .showcase-container::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                <div className="mt-10">
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-105"
                        asChild
                    >
                        <Link href="/quote">{t.showcase.cta}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
