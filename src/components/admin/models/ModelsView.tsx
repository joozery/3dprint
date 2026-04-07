"use client";

import { useState, useMemo } from "react";
import { 
  Box, 
  FileCode, 
  Download, 
  ExternalLink, 
  LayoutGrid, 
  List,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ModelPreview from "./ModelPreview";

interface ModelsViewProps {
  initialModels: any[];
}

export default function ModelsView({ initialModels }: ModelsViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredModels = useMemo(() => {
    return initialModels.filter(m => 
      m.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialModels, searchTerm]);

  const totalItems = filteredModels.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedModels = filteredModels.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">คลังโมเดล 3D (Asset Storage)</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium italic">
             จัดการไฟล์งานและตรวจสอบโมเดลล่วงหน้า ({totalItems} รายการ)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อไฟล์ หรือชื่อผู้ส่ง..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-11 pr-6 py-2.5 bg-white border border-blue-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm w-full md:w-64"
            />
          </div>

          <div className="bg-blue-50/50 p-1 rounded-xl flex items-center border border-blue-50 shadow-inner">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm border border-blue-100" : "text-slate-400 whitespace-nowrap hidden md:block"}`} title="Grid View">
               <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white text-blue-600 shadow-sm border border-blue-100" : "text-slate-400 whitespace-nowrap hidden md:block"}`} title="Table View">
               <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {paginatedModels.length === 0 ? (
        <div className="py-24 text-center bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 px-6">
           <Box size={40} className="text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-black uppercase tracking-widest text-xs">ไม่พบข้อมูลไฟล์ที่ระบุ</p>
           <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-tight">ลองตรวจสอบคำค้นหา หรืออัปโหลดไฟล์ใหม่ในความต้องการสั่งซื้อ</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedModels.map((m: any) => (
            <div key={m._id} className="bg-white border border-blue-100 rounded-2xl p-5 shadow-xl shadow-blue-900/5 group hover:border-blue-300 transition-all relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                 <div className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider border border-blue-100">
                    {m.originalName?.toLowerCase().endsWith('.3mf') ? '3MF' : 'STL'}
                 </div>
                 <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="aspect-square w-full rounded-xl bg-slate-50 border border-slate-100 mb-5 overflow-hidden">
                 {m.fileUrl ? <ModelPreview url={m.fileUrl} name={m.originalName} /> : <Box size={32} className="text-slate-200 mx-auto mt-12" />}
              </div>
              <div className="space-y-3">
                 <h3 className="text-slate-900 font-black text-[11px] truncate uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{m.originalName || 'ไม่ระบุชื่อ'}</h3>
                 <div className="grid grid-cols-2 gap-2 text-[10px] font-black bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div>
                       <p className="text-slate-400 text-[7px] uppercase tracking-widest leading-none">น้ำหนัก</p>
                       <p className="text-slate-900 mt-1">{m.weightGrams}g</p>
                    </div>
                    <div>
                       <p className="text-slate-400 text-[7px] uppercase tracking-widest leading-none text-right">ปริมาตร</p>
                       <p className="text-slate-900 mt-1 text-right">{m.volumeCm3?.toFixed(1)} cm³</p>
                    </div>
                 </div>
                 <div className="flex items-center justify-between gap-2">
                    <div>
                       <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">ราคาต้นทุน</p>
                       <span className="text-blue-600 font-black text-xs leading-none">฿{m.priceDetail.totalPrice?.toLocaleString()}</span>
                    </div>
                    {m.fileUrl && <a href={m.fileUrl} target="_blank" className="p-2 rounded-lg bg-slate-900 text-white hover:bg-blue-600 transition-all scale-90 shadow-md active:scale-75"><Download size={12} /></a>}
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 border-b border-blue-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="px-6 py-4">โมเดล</th>
                       <th className="px-6 py-4">ชื่อไฟล์งาน</th>
                       <th className="px-6 py-4">ข้อมูลเทคนิค</th>
                       <th className="px-6 py-4">ราคาประเมิน</th>
                       <th className="px-6 py-4 text-center">ดาวน์โหลด</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-blue-50">
                    {paginatedModels.map((m: any) => (
                       <tr key={m._id} className="hover:bg-blue-50/30 transition-all group">
                          <td className="px-6 py-3">
                             <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-50 overflow-hidden shadow-inner relative group-hover:scale-105 transition-transform">
                                {m.fileUrl ? <ModelPreview url={m.fileUrl} name={m.originalName} /> : <Box size={20} className="text-slate-200" />}
                             </div>
                          </td>
                          <td className="px-6 py-3">
                             <p className="text-slate-900 font-black text-xs uppercase tracking-tight truncate max-w-[200px]">{m.originalName}</p>
                             <p className="text-slate-400 text-[9px] font-bold mt-1 uppercase tracking-widest italic">{m.userId?.name || 'ทั่วไป'}</p>
                          </td>
                          <td className="px-6 py-3">
                             <div className="flex items-center gap-3">
                                <div>
                                   <p className="text-slate-400 text-[8px] uppercase tracking-widest leading-none mb-1 text-center">WGT</p>
                                   <span className="text-slate-900 font-black text-[11px]">{m.weightGrams}g</span>
                                </div>
                                <div className="w-px h-6 bg-slate-100 mx-1" />
                                <div>
                                   <p className="text-slate-400 text-[8px] uppercase tracking-widest leading-none mb-1 text-center">VOL</p>
                                   <span className="text-slate-900 font-black text-[11px]">{m.volumeCm3?.toFixed(1)} cm³</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-3">
                             <p className="text-slate-400 text-[8px] uppercase tracking-widest leading-none mb-1">Base Price</p>
                             <span className="text-blue-600 font-black text-sm">฿{m.priceDetail.totalPrice?.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-3 text-center">
                             {m.fileUrl && <a href={m.fileUrl} target="_blank" className="inline-flex p-2 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-md active:scale-90"><Download size={12} /></a>}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-0">หน้า <span className="text-slate-900">{currentPage}</span> จาก <span className="text-slate-900">{totalPages}</span> (ทั้งหมด {totalItems} รายการ)</p>
          <div className="flex items-center gap-3">
             <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="p-3 rounded-xl bg-white border border-blue-50 text-slate-400 hover:text-blue-600 shadow-sm disabled:opacity-30 transition-all">
                <ChevronLeft size={18} />
             </button>
             <div className="flex gap-2">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 3 && currentPage > 2) p = currentPage - 2 + i + 1;
                  if (p > totalPages) p = totalPages - (2 - i);
                  if (p < 1) p = 1;

                  return (
                    <button key={p} onClick={() => handlePageChange(p)} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === p ? "bg-blue-600 text-white shadow-md scale-110" : "text-slate-400 hover:text-blue-600 bg-blue-50/50"}`}>
                       {p}
                    </button>
                  );
                })}
             </div>
             <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="p-3 rounded-xl bg-white border border-blue-50 text-slate-400 hover:text-blue-600 shadow-sm disabled:opacity-30 transition-all">
                <ChevronRight size={18} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
