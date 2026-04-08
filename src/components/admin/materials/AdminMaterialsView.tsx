"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Box, Activity, Printer, Info } from "lucide-react";
import { toast } from "sonner";

interface Material {
  _id: string;
  name: string;
  systemId: string;
  technology: string;
  color: string;
  density: number;
  pricePerGram: number;
  setupFee: number;
  badge: string;
  isActive: boolean;
}

export default function AdminMaterialsView({ initialMaterials }: { initialMaterials: Material[] }) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    systemId: "",
    technology: "sla",
    color: "ขาวด้าน (Matte White)",
    density: 1.15,
    pricePerGram: 5,
    setupFee: 0,
    badge: "",
    isActive: true,
  });

  const technologies = [
    { id: "sla", label: "SLA (เรซิ่น)" },
    { id: "mjf", label: "MJF (ไนลอน)" },
    { id: "slm", label: "SLM (โลหะ)" },
    { id: "fdm", label: "FDM (พลาสติกเส้น)" },
    { id: "sls", label: "SLS (ไนลอนผง)" },
  ];

  const handleOpenModal = (mat?: Material) => {
    if (mat) {
      setEditingId(mat._id);
      setFormData({
        name: mat.name,
        systemId: mat.systemId,
        technology: mat.technology,
        color: mat.color,
        density: mat.density,
        pricePerGram: mat.pricePerGram,
        setupFee: mat.setupFee,
        badge: mat.badge || "",
        isActive: mat.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        systemId: "",
        technology: "sla",
        color: "ขาวด้าน (Matte White)",
        density: 1.15,
        pricePerGram: 5,
        setupFee: 0,
        badge: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/materials/${editingId}` : `/api/admin/materials`;
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      
      if (editingId) {
        setMaterials(prev => prev.map(m => m._id === editingId ? data.material : m));
        toast.success("อัปเดตข้อมูลวัสดุสำเร็จ");
      } else {
        setMaterials(prev => [...prev, data.material]);
        toast.success("เพิ่มวัสดุใหม่สำเร็จ");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบวัสดุนี้ออกจากระบบหรือไม่? จะส่งผลกระทบต่อรายการที่อ้างอิงรหัสนี้")) return;
    try {
      const res = await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ไม่สามารถลบได้");
      setMaterials(prev => prev.filter(m => m._id !== id));
      toast.success("ลบวัสดุสำเร็จ");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleActive = async (mat: Material) => {
    try {
      const res = await fetch(`/api/admin/materials/${mat._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !mat.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(prev => prev.map(m => m._id === mat._id ? data.material : m));
      }
    } catch (e) {
      toast.error("อัปเดตสถานะล้มเหลว");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
           <Box size={18} className="text-blue-500" />
           จัดการรายการวัสดุและราคาตั้งต้นเพื่อให้หน้าบ้านคำนวณราคาอัตโนมัติ
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all shadow-blue-500/20 active:scale-95"
        >
          <Plus size={16} /> แบบวัสดุใหม่
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest text-[10px] text-slate-400 font-bold">
                   <th className="px-6 py-4 rounded-tl-lg">รหัสจัดเก็บ</th>
                   <th className="px-6 py-4">ชื่อวัสดุ / สี</th>
                   <th className="px-6 py-4 text-center">เทคโนโลยี</th>
                   <th className="px-6 py-4 text-right">เรทราคา (บาท)</th>
                   <th className="px-6 py-4 text-center">สถานะ</th>
                   <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {materials.map(mat => (
                  <tr key={mat._id} className="hover:bg-blue-50/20 transition-colors group">
                     {/* System ID */}
                     <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{mat.systemId}</span>
                     </td>
                     
                     {/* Name & Color */}
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">{mat.name}</span>
                          {mat.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase bg-orange-100 text-orange-600 shrink-0">
                               {mat.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{mat.color}</p>
                     </td>

                     {/* Tech */}
                     <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-slate-200 bg-white text-slate-600 uppercase">
                           <Printer size={12} className="text-blue-500" />
                           {mat.technology}
                        </span>
                     </td>

                     {/* Price */}
                     <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-sm font-black text-slate-700">฿{mat.pricePerGram.toLocaleString()}<span className="text-[10px] font-medium text-slate-400"> / กรัม</span></span>
                           <span className="text-[10px] text-slate-400 font-medium">หนาแน่น: {mat.density}g/cm³</span>
                        </div>
                     </td>

                     {/* Status Toggle */}
                     <td className="px-6 py-4 text-center">
                        <button 
                           onClick={() => handleToggleActive(mat)}
                           className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ${mat.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                        >
                           <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${mat.isActive ? "translate-x-2" : "-translate-x-2"}`} />
                        </button>
                     </td>

                     {/* Actions */}
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => handleOpenModal(mat)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 size={16} />
                           </button>
                           <button onClick={() => handleDelete(mat._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </td>
                  </tr>
                ))}
                {materials.length === 0 && (
                   <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                         <Box size={32} className="mx-auto text-slate-200 mb-3" />
                         <p className="text-slate-500 text-sm font-medium">ยังไม่มีข้อมูลวัสดุในระบบ</p>
                      </td>
                   </tr>
                )}
             </tbody>
           </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                     <Box className="w-5 h-5 text-blue-500" />
                     {editingId ? "แก้ไขวัสดุ" : "เพิ่มวัสดุใหม่"}
                  </h3>
               </div>
               
               <form onSubmit={handleSave} className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">ชื่อวัสดุ <span className="text-red-500">*</span></label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="เช่น เรซิ่น 9600" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 focus:bg-white" />
                     </div>
                     
                     <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">System Id (ตัวย่อ/รหัส) <span className="text-red-500">*</span></label>
                        <input disabled={!!editingId} required type="text" value={formData.systemId} onChange={e => setFormData({...formData, systemId: e.target.value})} placeholder="เช่น 9600, jlc_black" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 font-mono" />
                     </div>
                     
                     <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">เทคโนโลยี (Technology)</label>
                        <select value={formData.technology} onChange={e => setFormData({...formData, technology: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50">
                           {technologies.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                     </div>

                     <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">สีหน้าบ้าน (Color)</label>
                        <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50" />
                     </div>
                     
                     <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">ป้ายกำกับ (Badge)</label>
                        <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="เช่น ยอดนิยม, ใหม่" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50" />
                     </div>
                  </div>

                  <hr className="my-5 border-slate-100 border-dashed" />
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">ราคาต่อกรัม (บาท/g) <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">฿</span>
                           <input required type="number" step="0.01" value={formData.pricePerGram} onChange={e => setFormData({...formData, pricePerGram: parseFloat(e.target.value) || 0})} className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 font-bold" />
                        </div>
                     </div>
                     <div className="col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">ความหนาแน่น (Density) <span title="g/cm³" className="flex items-center text-slate-400"><Info size={12} /></span></label>
                        <div className="relative">
                           <input required type="number" step="0.001" value={formData.density} onChange={e => setFormData({...formData, density: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50" />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">g/cm³</span>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">ยกเลิก</button>
                     <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-colors active:scale-95">บันทึกข้อมูล</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
