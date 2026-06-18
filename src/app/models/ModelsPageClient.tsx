"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Search, Sparkles, Download, Layers } from "lucide-react";
import ModelCard, { FreeModelItem } from "@/components/models/ModelCard";

const CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "functional", label: "ชิ้นส่วนใช้งาน" },
  { value: "decorative", label: "ของตกแต่ง" },
  { value: "art", label: "งานศิลปะ" },
  { value: "toys", label: "ของเล่น" },
  { value: "other", label: "อื่นๆ" },
];

const POPULAR_TAGS = ["Vase", "Gear", "Robot", "Toy", "Bracket"];

interface Props {
  initialModels: FreeModelItem[];
}

export default function ModelsPageClient({ initialModels }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [models, setModels] = useState<FreeModelItem[]>(initialModels);

  const filteredModels = models.filter(m => {
    const matchesCategory = activeCategory === "all" || m.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.description || "").toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleDownload = useCallback(async (id: string) => {
    try {
      await fetch(`/api/public/free-models/${id}/download`, { method: "POST" });
      setModels(prev =>
        prev.map(m => m._id === id ? { ...m, downloads: m.downloads + 1 } : m)
      );
    } catch {
      // silent fail — user still gets the file
    }
  }, []);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag.toLowerCase());
    setActiveCategory("all");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-16 lg:pt-32 lg:pb-16">
        <Image
          src="/coverfremodel.png"
          alt="Models Background"
          fill
          className="object-cover object-right"
          priority
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-blue-100 text-blue-600 text-xs font-black tracking-widest uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> FREE 3D LIBRARY
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight">
              คลังโมเดล 3D คุณภาพสูง<br />
              ดาวน์โหลด<span className="text-blue-600">ฟรี</span>
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-lg leading-relaxed font-light">
              ดาวน์โหลดไฟล์ 3D (STL, OBJ) ฟรี เพื่อนำไปพิมพ์ หรือใช้เป็นไอเดียสร้างสรรค์ผลงานของคุณ
            </p>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex items-center mb-6 max-w-xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ค้นหาโมเดล เช่น vase, gear, robot..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-slate-900 placeholder:text-slate-400 text-sm md:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 mr-2 text-lg leading-none"
                >
                  ×
                </button>
              )}
              <button
                onClick={() => {/* search is reactive */}}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/30"
              >
                ค้นหา
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex items-center flex-wrap gap-3">
              <span className="text-sm font-semibold text-slate-500">ยอดนิยม:</span>
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg text-xs font-medium text-slate-600 transition-colors shadow-sm"
                >
                  <Download className="w-3 h-3" /> {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Tabs */}
      <section className="py-6 border-b border-slate-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeCategory === cat.value
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600"
                }`}
              >
                {cat.value === "all" && <Layers className="w-4 h-4" />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Models Grid */}
      <section className="py-10 flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              พบ <span className="font-bold text-slate-800">{filteredModels.length}</span> โมเดล
              {searchQuery && (
                <span> สำหรับ "<span className="text-blue-600 font-bold">{searchQuery}</span>"</span>
              )}
            </p>
            {(searchQuery || activeCategory !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold"
              >
                ล้างการกรอง
              </button>
            )}
          </div>

          {filteredModels.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">ไม่พบโมเดลที่ตรงกัน</h3>
              <p className="text-slate-400 text-sm">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map(model => (
                <ModelCard key={model._id} model={model} onDownload={handleDownload} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
