"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingSidebar() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <div className="fixed right-4 bottom-6 z-50 flex flex-col items-center gap-3">

            {/* Contact Sales pill */}
            <button
                className="group relative flex flex-col items-center gap-1.5 rounded-full px-2 py-3 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                    background: "linear-gradient(180deg, #2563EB 0%, #06B6D4 100%)",
                    minHeight: 110,
                }}
                aria-label="Contact Sales"
            >
                {/* Avatar */}
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-md bg-white">
                    <Image
                        src="/logo/PDM_Logo_Icon_40x40px.svg"
                        alt="PDM Sales"
                        fill
                        className="object-contain p-[2px]"
                    />
                </div>

                {/* Vertical text */}
                <span
                    className="select-none text-[9px] font-bold text-white"
                    style={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        letterSpacing: "0.18em",
                    }}
                >
                    CONTACT SALES
                </span>
            </button>

            {/* Chat button — วงกลมฟ้า */}
            <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-200 transition-all hover:scale-110 hover:bg-blue-500 hover:shadow-xl"
                aria-label="Chat"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="h-6 w-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Scroll to top — แสดงเมื่อ scroll ลงมาแล้ว */}
            <button
                onClick={scrollToTop}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:scale-110 hover:shadow-xl hover:ring-blue-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    } transition-all duration-300`}
                aria-label="Scroll to top"
            >
                <ArrowUp size={20} className="text-slate-500" />
            </button>
        </div>
    );
}
