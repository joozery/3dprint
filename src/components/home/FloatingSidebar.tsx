"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingSidebar() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        // Toggle Scroll to top button
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <>
            {/* Shifted up to bottom-28 (112px) to prevent overlap with the Tawk.to widget that generally sits around bottom-6 */}
            <div className="fixed right-6 bottom-28 z-40 flex flex-col items-center gap-3">
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
        </>
    );
}
