"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const showcaseItems = [
    {
        image: "/showcase/metal.png",
        label: "BJ - 316L Stainless Steel",
    },
    {
        image: "/showcase/resin.png",
        label: "WJP - Full Color Resin",
    },
    {
        image: "/showcase/black.png",
        label: "SLA - Black Resin",
    },
    {
        image: "/showcase/clear.png",
        label: "SLA - 8001 Resin",
    },
    {
        image: "/showcase/sls.png",
        label: "SLS - Nylon 11/12",
    },
];

export function ShowcaseSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

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
                    3D Printed Parts Made by 3DEV
                </h2>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <p className="mt-6 text-lg leading-8 text-slate-600 max-w-3xl">
                        We manufacture rapid cost-effective prototypes and low-volume production orders for a variety of industries and applications.
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
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                    .showcase-container::-webkit-scrollbar {
                        display: none; /* Chrome, Safari and Opera */
                    }
                `}</style>

                <div className="mt-10">
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-105"
                        asChild
                    >
                        <Link href="/quote">Get Instant Quote</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
