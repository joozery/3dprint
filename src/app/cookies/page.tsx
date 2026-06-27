"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { Cookie, Loader2 } from "lucide-react";

type Section = { title: string; content: string };
type PageData = { lastUpdated: string; sections: Section[] };

export default function CookiePolicyPage() {
    const [data, setData] = useState<PageData | null>(null);

    useEffect(() => {
        fetch("/api/public/legal-pages")
            .then(r => r.json())
            .then(d => setData(d.cookies))
            .catch(() => {});
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-20 w-full">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-bl-[100%] z-0"></div>
                    <div className="relative z-10 flex items-center gap-4 mb-3">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                            <Cookie size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">นโยบายคุกกี้</h1>
                    </div>
                    <p className="text-slate-500 font-medium mb-10 pb-6 border-b border-slate-100 relative z-10">
                        อัปเดตล่าสุด: {data?.lastUpdated || "—"}
                    </p>
                    <div className="space-y-8 text-slate-600 leading-relaxed font-medium relative z-10">
                        {!data ? (
                            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                        ) : (
                            data.sections.map((s, i) => (
                                <section key={i}>
                                    <h2 className="text-lg font-black text-slate-800 mb-3">{s.title}</h2>
                                    <p>{s.content}</p>
                                </section>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
