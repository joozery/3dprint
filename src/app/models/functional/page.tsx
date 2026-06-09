"use client";

import Navbar from "@/components/layout/Navbar";
import { Wrench, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = ["ทั้งหมด", "เฟือง", "ตัวยึด", "คลิป", "อุปกรณ์บ้าน", "เครื่องมือ"];

const models = [
    { name: "M3 Bolt Insert Hex", cat: "ตัวยึด", color: "bg-blue-100" },
    { name: "Gear 20T Module 1", cat: "เฟือง", color: "bg-purple-100" },
    { name: "Wall Bracket 100mm", cat: "ตัวยึด", color: "bg-green-100" },
    { name: "Universal Phone Stand", cat: "อุปกรณ์บ้าน", color: "bg-yellow-100" },
    { name: "Cable Clip Organizer", cat: "คลิป", color: "bg-pink-100" },
    { name: "Tool Holder Rail", cat: "เครื่องมือ", color: "bg-orange-100" },
    { name: "Door Stopper Wedge", cat: "อุปกรณ์บ้าน", color: "bg-teal-100" },
    { name: "Fan Duct 40x40mm", cat: "อุปกรณ์บ้าน", color: "bg-cyan-100" },
    { name: "Adjustable Shelf Bracket", cat: "ตัวยึด", color: "bg-indigo-100" },
];

export default function FunctionalModelsPage() {
    const [active, setActive] = useState("ทั้งหมด");
    const filtered = active === "ทั้งหมด" ? models : models.filter((m) => m.cat === active);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex-1">
                <div className="bg-slate-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">
                            <Wrench className="w-4 h-4" /> โมเดล 3D ฟรี
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">ชิ้นส่วนใช้งาน</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            โมเดล Functional พร้อมพิมพ์ เฟือง ตัวยึด คลิป และอุปกรณ์ที่ใช้งานได้จริง
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    {/* Filter tabs */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                    active === cat ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {filtered.map((m) => (
                            <div key={m.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                <div className={`${m.color} h-48 flex items-center justify-center`}>
                                    <Wrench className="w-16 h-16 text-white/50" />
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{m.cat}</span>
                                    <h3 className="font-bold text-slate-900 mt-2 mb-3">{m.name}</h3>
                                    <div className="flex gap-2">
                                        <Link href="/quote" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg text-center flex items-center justify-center gap-1 transition-colors">
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
