"use client";

import Navbar from "@/components/layout/Navbar";
import { Gem, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = ["ทั้งหมด", "ของแต่งบ้าน", "ของสะสม", "งานศิลปะ", "เทศกาล"];

const models = [
    { name: "Succulent Planter Pot", cat: "ของแต่งบ้าน", color: "bg-green-100" },
    { name: "Dragon Figurine", cat: "ของสะสม", color: "bg-red-100" },
    { name: "Geometric Vase No.3", cat: "ของแต่งบ้าน", color: "bg-teal-100" },
    { name: "Eiffel Tower Mini 15cm", cat: "ของสะสม", color: "bg-blue-100" },
    { name: "Moon Lamp Base", cat: "ของแต่งบ้าน", color: "bg-indigo-100" },
    { name: "Mandala Wall Art Panel", cat: "งานศิลปะ", color: "bg-purple-100" },
    { name: "Cat Sitting Figurine", cat: "ของสะสม", color: "bg-orange-100" },
    { name: "Torii Gate Japanese", cat: "ของสะสม", color: "bg-pink-100" },
    { name: "Christmas Tree 20cm", cat: "เทศกาล", color: "bg-emerald-100" },
];

export default function DecorativeModelsPage() {
    const [active, setActive] = useState("ทั้งหมด");
    const filtered = active === "ทั้งหมด" ? models : models.filter((m) => m.cat === active);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-pink-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Gem className="w-4 h-4" /> โมเดล 3D ฟรี
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">งานตกแต่ง</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            โมเดลตกแต่งบ้าน ของสะสม และงานศิลปะ พร้อมพิมพ์ทันที
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                    active === cat ? "bg-pink-500 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-pink-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {filtered.map((m) => (
                            <div key={m.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className={`${m.color} h-48 flex items-center justify-center`}>
                                    <Gem className="w-16 h-16 text-white/50" />
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{m.cat}</span>
                                    <h3 className="font-bold text-slate-900 mt-2 mb-3">{m.name}</h3>
                                    <div className="flex gap-2">
                                        <Link href="/quote" className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2.5 rounded-lg text-center flex items-center justify-center gap-1 transition-colors">
                                            <ShoppingCart className="w-3.5 h-3.5" /> พิมพ์เลย
                                        </Link>
                                        <button className="px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                            ดาวน์โหลด
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/models" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700">
                            ← ดูโมเดลทั้งหมด <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
