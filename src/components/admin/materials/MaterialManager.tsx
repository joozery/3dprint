"use client";

import { useState } from "react";
import { Box, Plus, Edit, Trash2, Settings, Save, X, ExternalLink, Link as LinkIcon, DollarSign, Palette, Settings2, FolderOpen, Ruler, Coins, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_TECHS = ["SLA", "FDM", "MJF", "SLS", "DLP"];

export default function MaterialManager({ initialMaterials }: { initialMaterials: any[] }) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCustomTech, setShowCustomTech] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    technology: "SLA",
    name: "",
    description: "",
    tdsLink: "",
    sdsLink: "",
    maxPrintSize: { width: 0, length: 0, height: 0 },
    pricing: { costPerGram: 0, sellPerGram: 0, costPerMinute: 0, sellPerMinute: 0 },
    supportSettings: { density: 15, angle: 45 },
    colors: "",
    colorOptions: [] as { name: string, hex: string }[],
    postProcessing: [] as { name: string, costPrice: number, sellPrice: number }[]
  });

  const uniqueTechs = Array.from(new Set([...DEFAULT_TECHS, ...materials.map(m => (m.technology || "").toUpperCase())])).filter(Boolean).sort();

  const resetForm = () => {
    setFormData({
      technology: "SLA", name: "", description: "", tdsLink: "", sdsLink: "",
      maxPrintSize: { width: 0, length: 0, height: 0 },
      pricing: { costPerGram: 0, sellPerGram: 0, costPerMinute: 0, sellPerMinute: 0 },
      supportSettings: { density: 15, angle: 45 },
      colors: "", colorOptions: [], postProcessing: []
    });
    setEditingId(null);
    setShowCustomTech(false);
  };

  const handleEdit = (m: any) => {
    setFormData({
      technology: m.technology || "SLA",
      name: m.name || "",
      description: m.description || "",
      tdsLink: m.tdsLink || "",
      sdsLink: m.sdsLink || "",
      maxPrintSize: m.maxPrintSize || { width: 0, length: 0, height: 0 },
      pricing: m.pricing || { costPerGram: 0, sellPerGram: 0, costPerMinute: 0, sellPerMinute: 0 },
      supportSettings: m.supportSettings || { density: 15, angle: 45 },
      colors: m.colors ? m.colors.join(", ") : "",
      colorOptions: m.colorOptions && m.colorOptions.length > 0 ? m.colorOptions : (m.colors || []).map((c: string) => ({ name: c, hex: "#ffffff" })),
      postProcessing: m.postProcessing || []
    });
    setEditingId(m._id);
    setIsModalOpen(true);
    setShowCustomTech(!uniqueTechs.includes((m.technology || "").toUpperCase()));
  };

  const handleDelete = async (id: string) => {
    if(!confirm("ต้องการลบวัสดุเทคโนโลยีนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
      if(!res.ok) throw new Error("Delete failed");
      setMaterials(mats => mats.filter(m => m._id !== id));
      toast.success("ลบข้อมูลสำเร็จ");
    } catch (e) {
      toast.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const handleSave = async () => {
    try {
      if(!formData.name || !formData.technology) return toast.error("กรุณาระบุเทคโนโลยีและชื่อวัสดุ");
      
      const payload = {
        ...formData,
        technology: formData.technology.toUpperCase(),
        colors: formData.colorOptions.map(c => c.name), // sync names for backwards compatibility
        colorOptions: formData.colorOptions
      };

      if (editingId) {
         // UPDATE
         const res = await fetch(`/api/admin/materials/${editingId}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
         });
         const data = await res.json();
         if(!res.ok) throw new Error(data.error);
         setMaterials(mats => mats.map(m => m._id === editingId ? data : m));
         toast.success("อัปเดตเรียบร้อย");
      } else {
         // CREATE
         const res = await fetch("/api/admin/materials", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
         });
         const data = await res.json();
         if(!res.ok) throw new Error(data.error);
         setMaterials([...materials, data]);
         toast.success("เพิ่มข้อมูลเรียบร้อย");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (e: any) {
      toast.error(e.message || "เกิดข้อผิดพลาด");
    }
  };

  const handlePostProcChange = (idx: number, key: string, val: string | number) => {
    const newItems = [...formData.postProcessing];
    (newItems[idx] as any)[key] = val;
    setFormData({...formData, postProcessing: newItems});
  };

  const handleColorOptionChange = (idx: number, key: string, val: string) => {
    const newOptions = [...formData.colorOptions];
    (newOptions[idx] as any)[key] = val;
    setFormData({...formData, colorOptions: newOptions});
  };

  // Group materials by technology
  const groupedMaterials = materials.reduce((acc: any, m) => {
    const tech = (m.technology || "OTHER").toUpperCase();
    if (!acc[tech]) acc[tech] = [];
    acc[tech].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">ตั้งค่าวัสดุและราคาพริ้นท์</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการสูตรราคา ค่าเวลาจัดทำ และ Datasheets (TDS/SDS)</p>
         </div>
         <button 
           onClick={() => { resetForm(); setIsModalOpen(true); }}
           className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
         >
            <Plus size={18} /> เพิ่มวัสดุใหม่
         </button>
      </div>

      {materials.length === 0 ? (
         <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-sm px-6">
            <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <Box size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">ยังไม่มีข้อมูลวัสดุในระบบ</h3>
            <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">เริ่มต้นใช้งานโดยการคลิกปุ่ม &quot;เพิ่มวัสดุใหม่&quot; ที่มุมขวาบน เพื่อกำหนดโครงสร้างราคาพริ้นท์ตามเทคโนโลยีต่างๆ ของคุณ</p>
            <button 
               onClick={() => { resetForm(); setIsModalOpen(true); }}
               className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-xl font-bold hover:bg-blue-100 transition-colors"
            >
               <Plus size={16} /> เพิ่มวัสดุแรก
            </button>
         </div>
      ) : (
         <div className="space-y-12">
            {Object.keys(groupedMaterials).sort().map(tech => (
               <div key={tech} className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                     <div className="w-2 h-6 bg-blue-600 rounded-full" />
                     <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{tech} <span className="ml-2 text-sm font-bold text-slate-400">({groupedMaterials[tech].length} วัสดุ)</span></h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                     {groupedMaterials[tech].map((m: any) => (
                       <div key={m._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
                          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">{m.name}</h3>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => handleEdit(m)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(m._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                             </div>
                          </div>
                          <div className="p-6 space-y-6">
                             {/* Docs */}
                             {(m.tdsLink || m.sdsLink) && (
                                 <div className="flex flex-wrap gap-2">
                                    {m.tdsLink && <a href={m.tdsLink} target="_blank" className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:underline"><LinkIcon size={12}/> TDS</a>}
                                    {m.sdsLink && <a href={m.sdsLink} target="_blank" className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full hover:underline"><LinkIcon size={12}/> SDS</a>}
                                 </div>
                             )}
                             
                             {/* Configuration Overview */}
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Max Size</p>
                                    <p className="font-semibold text-slate-800 text-xs">{m.maxPrintSize?.width}x{m.maxPrintSize?.length}x{m.maxPrintSize?.height} mm</p>
                                 </div>
                                 <div className="space-y-1 text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Colors</p>
                                    <p className="font-semibold text-slate-800 text-xs truncate">{m.colors?.join(", ") || '-'}</p>
                                 </div>
                             </div>
        
                             {/* Pricing Info */}
                             <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                                <div className="bg-white p-3">
                                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><DollarSign size={10}/> ต่อกรัม</p>
                                   <div className="flex justify-between items-end border-b border-slate-50 pb-1 mb-1">
                                      <span className="text-[10px] text-slate-500 font-medium tracking-wide">ทุน</span>
                                      <span className="text-[11px] font-black text-rose-600">฿{m.pricing?.costPerGram}</span>
                                   </div>
                                   <div className="flex justify-between items-end">
                                      <span className="text-[10px] text-slate-500 font-medium tracking-wide">ขาย</span>
                                      <span className="text-sm font-black text-emerald-600 leading-none">฿{m.pricing?.sellPerGram}</span>
                                   </div>
                                </div>
                                <div className="bg-white p-3">
                                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><Settings size={10}/> ต่อนาที</p>
                                   <div className="flex justify-between items-end border-b border-slate-50 pb-1 mb-1">
                                      <span className="text-[10px] text-slate-500 font-medium tracking-wide">ทุน</span>
                                      <span className="text-[11px] font-black text-rose-600">฿{m.pricing?.costPerMinute}</span>
                                   </div>
                                   <div className="flex justify-between items-end">
                                      <span className="text-[10px] text-slate-500 font-medium tracking-wide">ขาย</span>
                                      <span className="text-sm font-black text-emerald-600 leading-none">฿{m.pricing?.sellPerMinute}</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl h-full shadow-2xl animate-in slide-in-from-right overflow-y-auto flex flex-col">
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-xl font-black text-slate-900">{editingId ? 'แก้ไขข้อมูลวัสดุ' : 'เพิ่มวัสดุใหม่'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
              </div>

              <div className="flex-1 p-8 space-y-8">
                 {/* Basic Info */}
                 <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                       <FolderOpen size={16} className="text-slate-400" /> ข้อมูลทั่วไป
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">เทคโนโลยี (Technology)</label>
                           <div className="relative">
                              <select 
                                value={showCustomTech ? "CUSTOM" : formData.technology.toUpperCase()} 
                                onChange={e => {
                                  if (e.target.value === "CUSTOM") {
                                    setShowCustomTech(true);
                                    setFormData({...formData, technology: ""});
                                  } else {
                                    setShowCustomTech(false);
                                    setFormData({...formData, technology: e.target.value});
                                  }
                                }}
                                className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl uppercase appearance-none focus:border-blue-500 outline-none"
                              >
                                {uniqueTechs.map(t => <option key={t} value={t}>{t}</option>)}
                                <option value="CUSTOM">+ เพิ่มเทคโนโลยีใหม่...</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <ChevronDown size={16} />
                              </div>
                           </div>
                           {showCustomTech && (
                              <input 
                                type="text" 
                                value={formData.technology} 
                                onChange={e => setFormData({...formData, technology: e.target.value.toUpperCase()})} 
                                className="w-full text-sm font-semibold text-slate-800 bg-white border border-blue-200 mt-2 px-4 py-2.5 rounded-xl uppercase focus:border-blue-500 outline-none animate-in slide-in-from-top-2" 
                                placeholder="ระบุชื่อเทคโนโลยีใหม่..." 
                                autoFocus
                              />
                           )}
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">ชื่อวัสดุ (Material Name)</label>
                           <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl" placeholder="e.g. 9600, ABS" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">รายละเอียดเพิ่มเติม</label>
                       <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl min-h-20" placeholder="อธิบายคุณสมบัติ..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TDS Link (Technical)</label>
                           <input type="url" value={formData.tdsLink} onChange={e => setFormData({...formData, tdsLink: e.target.value})} className="w-full text-xs font-medium bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg" placeholder="https://" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SDS Link (Safety)</label>
                           <input type="url" value={formData.sdsLink} onChange={e => setFormData({...formData, sdsLink: e.target.value})} className="w-full text-xs font-medium bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg" placeholder="https://" />
                        </div>
                    </div>
                 </section>

                 {/* Physical Specifications */}
                 <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                       <Ruler size={16} className="text-slate-400" /> ขีดจำกัดมิติภาพและพื้นผิว
                    </h3>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ขนาดสูงสุดที่พิมพ์ได้ (กว้าง x ยาว x สูง) หน่วย mm</label>
                       <div className="grid grid-cols-3 gap-2">
                           <input type="number" value={formData.maxPrintSize.width} onChange={e => setFormData({...formData, maxPrintSize: {...formData.maxPrintSize, width: Number(e.target.value)}})} className="w-full text-sm font-medium bg-white border border-slate-200 px-4 py-2 rounded-xl text-center" placeholder="กว้าง" />
                           <input type="number" value={formData.maxPrintSize.length} onChange={e => setFormData({...formData, maxPrintSize: {...formData.maxPrintSize, length: Number(e.target.value)}})} className="w-full text-sm font-medium bg-white border border-slate-200 px-4 py-2 rounded-xl text-center" placeholder="ยาว" />
                           <input type="number" value={formData.maxPrintSize.height} onChange={e => setFormData({...formData, maxPrintSize: {...formData.maxPrintSize, height: Number(e.target.value)}})} className="w-full text-sm font-medium bg-white border border-slate-200 px-4 py-2 rounded-xl text-center" placeholder="สูง" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">สีที่รองรับการพิมพ์ (Colors)</label>
                          <button onClick={() => setFormData({...formData, colorOptions: [...formData.colorOptions, { name: "ใหม่", hex: "#ffffff" }]})} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-2 py-1 rounded transition-colors">+ เพิ่มสี</button>
                       </div>
                       {formData.colorOptions.length === 0 ? (
                           <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-slate-100">ยังไม่มีสี (สามารถกดปุ่มเพิ่มสีได้)</p>
                       ) : (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {formData.colorOptions.map((co, idx) => (
                                <div key={idx} className="flex gap-2 items-center bg-white border border-slate-200 p-2 rounded-xl relative group">
                                   <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                      <input type="color" value={co.hex} onChange={e => handleColorOptionChange(idx, "hex", e.target.value)} className="w-16 h-16 -ml-3 -mt-3 cursor-pointer" />
                                   </div>
                                   <div className="flex-1">
                                      <input type="text" value={co.name} onChange={e => handleColorOptionChange(idx, "name", e.target.value)} className="w-full text-xs font-semibold border-b border-slate-200 px-1 py-1 focus:outline-none focus:border-blue-500" placeholder="ชื่อสี (เช่น สีขาว)" />
                                   </div>
                                   <button onClick={() => setFormData({...formData, colorOptions: formData.colorOptions.filter((_, i) => i !== idx)})} className="w-6 h-6 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 shrink-0 hover:bg-red-100"><X size={12}/></button>
                                </div>
                              ))}
                           </div>
                       )}
                    </div>
                 </section>

                 {/* Pricing Setup */}
                 <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                       <Coins size={16} className="text-slate-400" /> การตั้งราคา และต้นทุน
                    </h3>
                    <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                       <div className="bg-slate-50 p-4 space-y-3">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">ราคาต่อกรัม (น้ำหนัก)</p>
                           <div>
                              <span className="text-[10px] font-bold text-slate-500">ต้นทุน (Cost)</span>
                              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">฿</span><input type="number" value={formData.pricing.costPerGram} onChange={e => setFormData({...formData, pricing: {...formData.pricing, costPerGram: Number(e.target.value)}})} className="w-full pl-8 pr-3 py-1.5 text-sm font-bold text-rose-600 rounded-lg border border-slate-200" /></div>
                           </div>
                           <div>
                              <span className="text-[10px] font-bold text-slate-500">ขาย (Sell)</span>
                              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">฿</span><input type="number" value={formData.pricing.sellPerGram} onChange={e => setFormData({...formData, pricing: {...formData.pricing, sellPerGram: Number(e.target.value)}})} className="w-full pl-8 pr-3 py-1.5 text-sm font-black text-emerald-600 rounded-lg border border-slate-200 focus:border-emerald-500 outline-none" /></div>
                           </div>
                       </div>
                       <div className="bg-slate-50 p-4 space-y-3">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">ค่าเวลาต่อนาที (เครื่อง/ค่าไฟ)</p>
                           <div>
                              <span className="text-[10px] font-bold text-slate-500">ต้นทุน (Cost)</span>
                              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">฿</span><input type="number" value={formData.pricing.costPerMinute} onChange={e => setFormData({...formData, pricing: {...formData.pricing, costPerMinute: Number(e.target.value)}})} className="w-full pl-8 pr-3 py-1.5 text-sm font-bold text-rose-600 rounded-lg border border-slate-200" /></div>
                           </div>
                           <div>
                              <span className="text-[10px] font-bold text-slate-500">ขาย (Sell)</span>
                              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">฿</span><input type="number" value={formData.pricing.sellPerMinute} onChange={e => setFormData({...formData, pricing: {...formData.pricing, sellPerMinute: Number(e.target.value)}})} className="w-full pl-8 pr-3 py-1.5 text-sm font-black text-emerald-600 rounded-lg border border-slate-200 focus:border-emerald-500 outline-none" /></div>
                           </div>
                       </div>
                    </div>
                 </section>

                 {/* Support Settings */}
                 <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                       <span className="text-slate-400">⚙</span> ตั้งค่า Support (PrusaSlicer)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                             Support Density (%)
                          </label>
                          <div className="flex items-center gap-2">
                             <input
                                type="range" min="5" max="100" step="5"
                                value={formData.supportSettings.density}
                                onChange={e => setFormData({...formData, supportSettings: {...formData.supportSettings, density: Number(e.target.value)}})}
                                className="flex-1 accent-blue-600"
                             />
                             <span className="text-sm font-black text-blue-600 w-10 text-right">{formData.supportSettings.density}%</span>
                          </div>
                          <p className="text-[10px] text-slate-400">ความหนาแน่นของ support (ค่ามาก = แน่น = ใช้วัสดุมากขึ้น)</p>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                             Support Angle (°)
                          </label>
                          <div className="flex items-center gap-2">
                             <input
                                type="range" min="0" max="90" step="5"
                                value={formData.supportSettings.angle}
                                onChange={e => setFormData({...formData, supportSettings: {...formData.supportSettings, angle: Number(e.target.value)}})}
                                className="flex-1 accent-blue-600"
                             />
                             <span className="text-sm font-black text-blue-600 w-10 text-right">{formData.supportSettings.angle}°</span>
                          </div>
                          <p className="text-[10px] text-slate-400">มุมชิ้นงานที่ต้องการ support (น้อย = support เยอะ)</p>
                       </div>
                    </div>
                 </section>

                 {/* Post Processing Arrays */}
                 <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                       <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <Sparkles size={16} className="text-slate-400" /> การเก็บงานพิเศษ (Post Processing)
                       </h3>
                       <button onClick={() => setFormData({...formData, postProcessing: [...formData.postProcessing, { name: "Vapor Smooth", costPrice: 0, sellPrice: 0 }]})} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-2 py-1 rounded transition-colors">+ เพิ่มค่าบริการ</button>
                    </div>
                    <div className="space-y-3">
                        {formData.postProcessing.length === 0 ? (
                           <p className="text-xs text-slate-400 italic text-center py-4">ไม่มีกระบวนการเสริมสำหรับวัสดุนี้</p>
                        ) : (
                           formData.postProcessing.map((pp, idx) => (
                             <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-white border border-slate-200 p-3 rounded-xl relative group">
                                <div className="flex-1">
                                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">รูปแบบบริการ</label>
                                   <input type="text" value={pp.name} onChange={e => handlePostProcChange(idx, "name", e.target.value)} className="w-full text-xs font-semibold border-b border-slate-200 px-1 py-1 focus:outline-none focus:border-blue-500" placeholder="e.g. ขัดมัน, Vapor Smooth" />
                                </div>
                                <div className="w-full sm:w-24">
                                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">ต้นทุน (฿)</label>
                                   <input type="number" value={pp.costPrice} onChange={e => handlePostProcChange(idx, "costPrice", Number(e.target.value))} className="w-full text-xs font-bold text-rose-600 border-b border-slate-200 px-1 py-1 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="w-full sm:w-24">
                                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">ราคาขาย (฿)</label>
                                   <input type="number" value={pp.sellPrice} onChange={e => handlePostProcChange(idx, "sellPrice", Number(e.target.value))} className="w-full text-xs font-black text-emerald-600 border-b border-slate-200 px-1 py-1 focus:outline-none focus:border-emerald-500" />
                                </div>
                                <button onClick={() => setFormData({...formData, postProcessing: formData.postProcessing.filter((_, i) => i !== idx)})} className="absolute -right-2 -top-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"><X size={12}/></button>
                             </div>
                           ))
                        )}
                    </div>
                 </section>

              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end gap-3 sticky bottom-0">
                 <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200/50 transition-colors">ยกเลิก</button>
                 <button onClick={handleSave} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"><Save size={16}/> บันทึกการตั้งค่า</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
