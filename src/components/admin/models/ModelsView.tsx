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
  ChevronDown,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
  ImageIcon,
  HardDrive,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ModelsViewProps {
  initialModels: any[];
}

export default function ModelsView({ initialModels }: ModelsViewProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState("all");
  const itemsPerPage = 20;

  // Derive stats
  const totalModels = initialModels.length;
  const totalSizeMb = useMemo(() => initialModels.reduce((acc, m) => acc + ((m.volumeCm3 || 0) * 0.45), 0), [initialModels]);
  
  const userStats = useMemo(() => {
    const stats: Record<string, { id: string; count: number; sizeMb: number; name: string; email: string }> = {};
    initialModels.forEach(m => {
      const uId = m.userId?._id?.toString() || m.userId?.toString() || 'guest';
      if (!stats[uId]) {
         stats[uId] = { id: uId, count: 0, sizeMb: 0, name: m.userId?.name || 'ไม่ระบุ (Guest)', email: m.userId?.email || '' };
      }
      stats[uId].count += 1;
      stats[uId].sizeMb += (m.volumeCm3 || 0) * 0.45;
    });
    return Object.values(stats).sort((a, b) => b.sizeMb - a.sizeMb).slice(0, 20);
  }, [initialModels]);

  // Unique users list for dropdown filter
  const uniqueUsersList = useMemo(() => {
    const uMap = new Map();
    initialModels.forEach(m => {
        if (m.userId) {
            uMap.set(m.userId._id?.toString() || m.userId.toString(), m.userId.name || 'ไม่ระบุ');
        }
    });
    return Array.from(uMap.entries()).map(([id, name]) => ({ id, name }));
  }, [initialModels]);

  const filteredModels = useMemo(() => {
    return initialModels.filter(m => {
      const matchSearch = m.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) || m.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchUser = selectedUserFilter === "all" || (m.userId?._id?.toString() || m.userId?.toString()) === selectedUserFilter;
      return matchSearch && matchUser;
    });
  }, [initialModels, searchTerm, selectedUserFilter]);

  const totalItems = filteredModels.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedModels = filteredModels.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedModels.length && paginatedModels.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedModels.map(m => m._id));
    }
  };

  const handleDelete = async (idsToDelete: string[]) => {
    if (!confirm(`ต้องการลบไฟล์โมเดลทั้ง ${idsToDelete.length} รายการใช่หรือไม่? (การกระทำนี้จะลบใบเสนอราคาที่เกี่ยวข้องด้วย)`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/models", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`ลบไฟล์เรียบร้อยแล้ว จำนวน ${data.deletedCount} รายการ`);
      setSelectedIds([]);
      router.refresh();
      window.location.reload(); 
    } catch (e: any) {
      toast.error(e.message || "ลบไฟล์ไม่สำเร็จ");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">คลังโมเดล 3D</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium italic">
             จัดการไฟล์งานและตรวจสอบโมเดลล่วงหน้าทั้งหมดในระบบ
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Total Models */}
         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl border border-blue-400 p-6 flex flex-col justify-center shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            <div className="flex items-center gap-3 text-blue-100 mb-2 relative z-10">
                <Box size={20} className="text-white" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-blue-50">Total Models</h3>
            </div>
            <p className="text-5xl font-black text-white relative z-10">{totalModels.toLocaleString()}</p>
         </div>

         {/* Total Size */}
         <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl border border-purple-400 p-6 flex flex-col justify-center shadow-lg shadow-purple-500/20 text-white relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            <div className="flex items-center gap-3 text-purple-100 mb-2 relative z-10">
                <HardDrive size={20} className="text-white" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-purple-50">Estimated Storage</h3>
            </div>
            <p className="text-5xl font-black text-white relative z-10">{(totalSizeMb / 1024).toFixed(2)} <span className="text-base text-purple-200 font-bold ml-1">GB</span></p>
         </div>

         {/* Total Users uploaded */}
         <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl border border-emerald-400 p-6 flex flex-col justify-center shadow-lg shadow-emerald-500/20 text-white sm:col-span-2 lg:col-span-1 relative overflow-hidden group">
            <div className="absolute -right-2 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            <div className="flex items-center gap-3 text-emerald-100 mb-2 relative z-10">
                <Users size={20} className="text-white" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-50">Users</h3>
            </div>
            <p className="text-5xl font-black text-white relative z-10">{uniqueUsersList.length}</p>
         </div>
      </div>

      {/* Top 20 Users Consuming Storage Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center bg-slate-50/50">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><HardDrive size={16} /> ผู้ใช้งานที่ใช้พื้นที่จัดเก็บมากที่สุด (Top 20)</h3>
          </div>
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto w-full">
              <table className="w-full text-left min-w-[700px]">
                  <thead className="sticky top-0 bg-white z-10 shadow-sm">
                      <tr>
                          <th className="px-6 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16 text-center">อันดับ</th>
                          <th className="px-6 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ผู้ใช้งาน</th>
                          <th className="px-6 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">จำนวนไฟล์</th>
                          <th className="px-6 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">ปริมาณข้อมูล (MB)</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {userStats.length === 0 && (
                          <tr><td colSpan={4} className="py-6 text-center text-slate-400 text-sm">ไม่มีข้อมูลผู้ใช้งาน</td></tr>
                      )}
                      {userStats.map((stat, idx) => (
                          <tr key={stat.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-3 text-center text-slate-400 font-bold text-xs">{idx + 1}</td>
                              <td className="px-6 py-3">
                                  <div className="font-semibold text-slate-800 text-sm whitespace-nowrap">{stat.name}</div>
                                  <div className="text-xs text-slate-400 truncate max-w-[200px]">{stat.email}</div>
                              </td>
                              <td className="px-6 py-3 text-center text-slate-700 font-bold">{stat.count}</td>
                              <td className="px-6 py-3 text-right">
                                  <div className="flex items-center justify-end gap-3">
                                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((stat.sizeMb / totalSizeMb) * 100, 100)}%` }} />
                                      </div>
                                      <span className="font-bold text-slate-800 text-sm min-w-[70px]">{stat.sizeMb.toFixed(2)} MB</span>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      <hr className="border-slate-200" />

      {/* Model Explorer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="relative flex w-full sm:w-auto items-center gap-3">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
               value={selectedUserFilter} 
               onChange={(e) => { setSelectedUserFilter(e.target.value); setCurrentPage(1); }}
               className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[200px] appearance-none"
            >
               <option value="all">ผู้ใช้ทั้งหมด (All Users)</option>
               {uniqueUsersList.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
               ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative group flex-1 sm:flex-none sm:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อไฟล์..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-11 pr-6 py-2.5 bg-slate-50 w-full border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 self-stretch shrink-0">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`} title="Grid View">
               <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400"}`} title="Table View">
               <List size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="animate-in slide-in-from-top-4 flex items-center justify-between p-4 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 mb-6">
           <div className="text-white text-sm font-medium px-4">
              เลือกแล้ว <span className="font-bold text-blue-400 mr-1">{selectedIds.length}</span> รายการ
           </div>
           <div className="flex items-center gap-2">
              <button 
                 onClick={() => setSelectedIds([])}
                 className="px-4 py-2 text-white/70 hover:text-white text-xs font-bold uppercase transition-colors"
              >
                  ยกเลิก
              </button>
              <button 
                 onClick={() => handleDelete(selectedIds)}
                 disabled={isDeleting}
                 className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              >
                 {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                 ลบรายการที่เลือก
              </button>
           </div>
        </div>
      )}

      {paginatedModels.length === 0 ? (
        <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-sm px-6">
           <Box size={40} className="text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-black uppercase tracking-widest text-xs">ไม่พบข้อมูลไฟล์ที่ระบุ</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedModels.map((m: any) => {
            const isSelected = selectedIds.includes(m._id);
            return (
              <div key={m._id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden group ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300'}`}>
                {/* Selection Overlay */}
                <div 
                   onClick={() => toggleSelect(m._id)}
                   className="absolute top-3 left-3 z-20 cursor-pointer"
                >
                   {isSelected ? <CheckSquare size={20} className="text-blue-600 bg-white rounded-md" /> : <Square size={20} className="text-slate-300 hover:text-blue-400 bg-white/50 rounded-md opacity-0 group-hover:opacity-100 transition-all" />}
                </div>

                {/* File format Pill */}
                <div className="absolute top-3 right-3 z-20">
                   <div className="px-2 py-0.5 rounded-lg bg-blue-50/90 backdrop-blur-sm text-blue-600 text-[8px] font-black uppercase tracking-wider border border-blue-100">
                      {m.originalName?.toLowerCase().endsWith('.3mf') ? '3MF' : 'STL'}
                   </div>
                </div>

                <div 
                   className="mt-6 aspect-square w-full rounded-xl bg-slate-50 border border-slate-100 mb-5 overflow-hidden flex flex-col items-center justify-center relative cursor-pointer"
                   onClick={() => toggleSelect(m._id)}
                >
                   <ImageIcon size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-500 group-hover:text-blue-300" strokeWidth={1} />
                </div>
                
                <div className="space-y-3">
                   <h3 className="text-slate-900 font-bold text-xs truncate" title={m.originalName}>{m.originalName || 'ไม่ระบุชื่อ'}</h3>
                   <p className="text-slate-500 text-[10px] font-medium truncate">{m.userId?.name || 'Guest'}</p>
                 <div className="grid grid-cols-2 gap-2 text-[10px] font-black bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>
                       <p className="text-slate-400 text-[7px] uppercase tracking-widest leading-none">น้ำหนัก</p>
                       <p className="text-slate-900 mt-1">{m.weightGrams}g</p>
                    </div>
                    <div>
                       <p className="text-slate-400 text-[7px] uppercase tracking-widest leading-none text-right">ปริมาตร</p>
                       <p className="text-slate-900 mt-1 text-right">{m.volumeCm3?.toFixed(1)} cm³</p>
                    </div>
                 </div>
                 <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                       {m.fileUrl && <a href={m.fileUrl} target="_blank" className="p-2 border border-slate-200 rounded-lg hover:border-blue-300 text-slate-500 hover:text-blue-600 transition-all bg-white"><Download size={14} /></a>}
                       <button onClick={() => handleDelete([m._id])} className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all bg-white"><Trash2 size={14} /></button>
                    </div>
                 </div>
               </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
           <div className="overflow-x-auto w-full">
              <table className="w-full text-left min-w-[800px]">
                 <thead>
                     <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-4 w-12 text-center">
                           <div onClick={toggleSelectAll} className="cursor-pointer inline-block">
                              {selectedIds.length === paginatedModels.length && paginatedModels.length > 0 ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} className="text-slate-300 hover:text-blue-400" />}
                           </div>
                        </th>
                        <th className="px-6 py-4">โมเดล</th>
                        <th className="px-6 py-4 w-1/3">ชื่อไฟล์ / เจ้าของ</th>
                        <th className="px-6 py-4 text-center">น้ำหนัก</th>
                        <th className="px-6 py-4 text-center">ปริมาตร (HDD Size)</th>
                        <th className="px-6 py-4 text-center">วันที่อัพโหลด</th>
                        <th className="px-6 py-4 text-right">จัดการ</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {paginatedModels.map((m: any) => {
                        const isSelected = selectedIds.includes(m._id);
                        return (
                        <tr key={m._id} className={`${isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                           <td className="px-6 py-3 text-center">
                              <div onClick={() => toggleSelect(m._id)} className="cursor-pointer inline-block mt-1">
                                 {isSelected ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} className="text-slate-300 hover:text-blue-400" />}
                              </div>
                           </td>
                           <td className="px-6 py-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                 <ImageIcon size={18} className="text-slate-400" />
                              </div>
                           </td>
                           <td className="px-6 py-3">
                              <p className="text-slate-900 font-medium text-sm truncate max-w-[300px]" title={m.originalName}>{m.originalName}</p>
                              <p className="text-slate-500 text-[11px] mt-0.5">{m.userId?.name || 'Guest'}</p>
                           </td>
                           <td className="px-6 py-3 text-center text-slate-700 text-xs font-bold w-24">
                              {m.weightGrams}g
                           </td>
                           <td className="px-6 py-3 text-center text-slate-700 text-xs w-32">
                              {m.volumeCm3?.toFixed(1)} cm³ <br/><span className="text-[9px] text-slate-400">~{((m.volumeCm3 || 0) * 0.45).toFixed(2)} MB</span>
                           </td>
                           <td className="px-6 py-3 text-center text-slate-500 text-xs w-28 whitespace-nowrap">
                              {new Date(m.createdAt).toLocaleDateString('th-TH')}
                           </td>
                           <td className="px-6 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 {m.fileUrl && <a href={m.fileUrl} target="_blank" className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Download size={15} /></a>}
                                 <button onClick={() => handleDelete([m._id])} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                              </div>
                           </td>
                        </tr>
                        );
                     })}
                  </tbody>
              </table>
           </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-[11px] font-semibold tracking-wider mb-4 md:mb-0">หน้า <span className="text-slate-900">{currentPage}</span> / {totalPages} <span className="ml-2">({totalItems} รายการ)</span></p>
          <div className="flex items-center gap-2">
             <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 transition-all">
                <ChevronLeft size={18} />
             </button>
             <div className="flex gap-1.5">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
                  if (p > totalPages) p = totalPages - (4 - i);
                  if (p < 1) p = 1;

                  return (
                    <button key={p} onClick={() => handlePageChange(p)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-[12px] font-black transition-all ${currentPage === p ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                       {p}
                    </button>
                  );
                })}
             </div>
             <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 disabled:opacity-30 transition-all">
                <ChevronRight size={18} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
