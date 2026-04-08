"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Video, Youtube, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Banner {
  _id: string;
  type: string;
  src: string;
  overlay: string;
  badge: string;
  title: string;
  titleHighlight: string;
  titleEnd: string;
  bullets: string[];
  cta: { label: string; href: string };
  cta2: { label: string; href: string };
  order: number;
  isActive: boolean;
}

export default function AdminBannersView({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: "image",
    src: "",
    overlay: "from-slate-900/70 via-slate-900/40 to-transparent",
    badge: "",
    title: "",
    titleHighlight: "",
    titleEnd: "",
    bullets: "",
    cta: { label: "", href: "" },
    cta2: { label: "", href: "" },
    order: 0,
    isActive: true,
  });

  const handleOpenModal = (b?: Banner) => {
    if (b) {
      setEditingId(b._id);
      setFormData({
        type: b.type,
        src: b.src,
        overlay: b.overlay,
        badge: b.badge || "",
        title: b.title,
        titleHighlight: b.titleHighlight || "",
        titleEnd: b.titleEnd || "",
        bullets: b.bullets.join("\n"),
        cta: { label: b.cta?.label || "", href: b.cta?.href || "" },
        cta2: { label: b.cta2?.label || "", href: b.cta2?.href || "" },
        order: b.order || 0,
        isActive: b.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        type: "image",
        src: "",
        overlay: "from-slate-900/70 via-slate-900/40 to-transparent",
        badge: "",
        title: "",
        titleHighlight: "",
        titleEnd: "",
        bullets: "",
        cta: { label: "เริ่มสั่งพิมพ์เลย", href: "/quote" },
        cta2: { label: "", href: "" },
        order: banners.length,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        bullets: formData.bullets.split("\n").filter(b => b.trim()),
      };

      const url = editingId ? `/api/admin/banners/${editingId}` : `/api/admin/banners`;
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      
      if (editingId) {
        setBanners(prev => prev.map(m => m._id === editingId ? data.banner : m));
        toast.success("อัปเดตแบนเนอร์สำเร็จ");
      } else {
        setBanners(prev => [...prev, data.banner]);
        toast.success("เพิ่มแบนเนอร์สำเร็จ");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบแบนเนอร์นี้ออกจากหน้าแรกหรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ไม่สามารถลบได้");
      setBanners(prev => prev.filter(m => m._id !== id));
      toast.success("ลบสำเร็จ");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleActive = async (b: Banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${b._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !b.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(prev => prev.map(m => m._id === b._id ? data.banner : m));
      }
    } catch (e) {
      toast.error("อัปเดตล้มเหลว");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
           <ImageIcon size={18} className="text-blue-500" />
           ระบบจัดการสไลเดอร์แบนเนอร์หน้าแรก
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
        >
          <Plus size={16} /> ครีเอทแบนเนอร์ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => (
          <div key={b._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative group">
            {/* Action Overlay */}
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
               <button onClick={() => handleOpenModal(b)} className="p-2 bg-white/90 shadow text-slate-600 hover:text-blue-600 rounded-lg backdrop-blur-sm">
                  <Edit2 size={14} />
               </button>
               <button onClick={() => handleDelete(b._id)} className="p-2 bg-white/90 shadow text-slate-600 hover:text-red-600 rounded-lg backdrop-blur-sm">
                  <Trash2 size={14} />
               </button>
            </div>
            
            {/* Preview Image/Icon */}
            <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
               {b.type === "image" ? (
                  <div className="relative w-full h-full">
                      {b.src.startsWith("/") || b.src.startsWith("http") ? (
                          <Image src={b.src} alt="Banner" fill className="object-cover opacity-80" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={32} />
                          </div>
                      )}
                  </div>
               ) : b.type === "youtube" ? (
                  <div className="text-red-500 flex flex-col items-center gap-2">
                     <Youtube size={32} />
                     <span className="text-xs font-bold font-mono px-2 py-0.5 bg-red-100 rounded">{b.src}</span>
                  </div>
               ) : (
                  <div className="text-emerald-500 flex flex-col items-center gap-2">
                     <Video size={32} />
                     <span className="text-xs font-bold">Video URL</span>
                  </div>
               )}
               <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-r ${b.overlay}`} />
               <div className="absolute bottom-2 left-3">
                  <h4 className="text-white font-bold text-sm drop-shadow-md">
                    {b.title} <span className="text-blue-400">{b.titleHighlight}</span> {b.titleEnd}
                  </h4>
               </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
               <div className="flex items-center justify-between">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">ลำดับที่: {b.order}</span>
                  <button 
                     onClick={() => handleToggleActive(b)}
                     className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${b.isActive ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${b.isActive ? "translate-x-2" : "-translate-x-2"}`} />
                  </button>
               </div>
               
               {b.bullets.length > 0 && (
                 <ul className="text-xs text-slate-500 space-y-1">
                    {b.bullets.map((txt, i) => (
                      <li key={i} className="truncate">• {txt}</li>
                    ))}
                 </ul>
               )}

               <div className="flex gap-2 pt-2 border-t border-slate-50">
                  {b.cta?.label && (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1">
                       [Btn1] {b.cta.label}
                    </span>
                  )}
                  {b.cta2?.label && (
                    <span className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2 py-1 rounded flex items-center gap-1">
                       [Btn2] {b.cta2.label}
                    </span>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto p-6 animate-in zoom-in-95 duration-200">
               <h3 className="font-bold text-lg mb-6">{editingId ? "แก้ไขแบนเนอร์" : "สร้างแบนเนอร์ใหม่"}</h3>
               
               <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                     <label className="text-xs font-bold text-slate-500 mb-1 block">ประเภท (Type)</label>
                     <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border rounded border-slate-200 bg-slate-50 text-sm">
                        <option value="image">รูปภาพ (Image)</option>
                        <option value="youtube">ยูทูป (YouTube ID)</option>
                        <option value="video">วิดีโอ (Video URL)</option>
                     </select>
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                     <label className="text-xs font-bold text-slate-500 mb-1 block">ซอร์สไฟล์ / ลิงก์ / YouTube ID <span className="text-red-500">*</span></label>
                     <input required type="text" value={formData.src} onChange={e => setFormData({...formData, src: e.target.value})} placeholder="เช่น /bghero/cover1.png หรือ YT_ID" className="w-full p-2 border rounded border-slate-200 focus:border-blue-500 text-sm" />
                  </div>

                  <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 mb-1 block">กล่องข้อความป้ายกำกับ (Badge)</label>
                     <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="เช่น 🚀 บริการพิมพ์ 3D อัตโนมัติ" className="w-full p-2 border rounded border-slate-200 text-sm" />
                  </div>

                  {/* Header Title Editor */}
                  <div className="col-span-2 p-3 bg-slate-50 rounded-lg grid grid-cols-3 gap-2">
                     <div>
                        <label className="text-[10px] font-bold text-slate-500 mb-1 block">หัวเว็บส่วนที่ 1 (Title) <span className="text-red-500">*</span></label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="เช่น ออกแบบ. พิมพ์." className="w-full p-2 border rounded text-xs" />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-blue-500 mb-1 block">ไฮไลท์สึฟ้า (Highlight)</label>
                        <input type="text" value={formData.titleHighlight} onChange={e => setFormData({...formData, titleHighlight: e.target.value})} placeholder="สร้างต้นแบบ 3D" className="w-full p-2 border rounded text-xs text-blue-600 font-bold" />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-500 mb-1 block">ส่วนท้าย (End)</label>
                        <input type="text" value={formData.titleEnd} onChange={e => setFormData({...formData, titleEnd: e.target.value})} placeholder="ได้ทันที" className="w-full p-2 border rounded text-xs" />
                     </div>
                     <p className="col-span-3 text-[10px] text-slate-400">แสดงผล: <span className="text-slate-800 font-bold">{formData.title} <span className="text-blue-500">{formData.titleHighlight}</span> {formData.titleEnd}</span></p>
                  </div>

                  <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 mb-1 block">ลูกน้ำข้อย่อย (Bullets) - ขึ้นบรรทัดใหม่=ขึ้นข้อใหม่</label>
                     <textarea value={formData.bullets} onChange={e => setFormData({...formData, bullets: e.target.value})} rows={3} placeholder={"อัปโหลดไฟล์ STL/OBJ และรับราคาทันที\nรองรับ FDM, SLA — วัสดุกว่า 50 ชนิด"} className="w-full p-2 border rounded border-slate-200 text-sm" />
                  </div>

                  {/* CTA 1 */}
                  <div className="col-span-2 sm:col-span-1 bg-blue-50/50 p-3 rounded-lg">
                     <label className="text-[10px] font-bold text-blue-600 mb-2 block border-b border-blue-100 pb-1">ปุ่มหลัก (CTA 1)</label>
                     <input type="text" value={formData.cta.label} onChange={e => setFormData({...formData, cta: {...formData.cta, label: e.target.value}})} placeholder="แท็กปุ่ม เช่น เริ่มสั่งพิมพ์" className="w-full p-2 border rounded text-xs mb-2" />
                     <input type="text" value={formData.cta.href} onChange={e => setFormData({...formData, cta: {...formData.cta, href: e.target.value}})} placeholder="ลิงก์ไปหน้า เช่น /quote" className="w-full p-2 border rounded text-xs" />
                  </div>

                  {/* CTA 2 */}
                  <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3 rounded-lg">
                     <label className="text-[10px] font-bold text-slate-500 mb-2 block border-b border-slate-200 pb-1">ปุ่มรอง (CTA 2)</label>
                     <input type="text" value={formData.cta2.label} onChange={e => setFormData({...formData, cta2: {...formData.cta2, label: e.target.value}})} placeholder="แท็กปุ่ม เช่น รายละเอียด" className="w-full p-2 border rounded text-xs mb-2" />
                     <input type="text" value={formData.cta2.href} onChange={e => setFormData({...formData, cta2: {...formData.cta2, href: e.target.value}})} placeholder="ลิงก์ไปหน้า เช่น /about" className="w-full p-2 border rounded text-xs" />
                  </div>

                  <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">ลำดับการเรียง (Order น้อยสุดขึ้นก่อน)</label>
                       <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded border-slate-200 text-sm" />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-1 block">โทนสี Gradient (Overlay Tailwind)</label>
                       <input type="text" value={formData.overlay} onChange={e => setFormData({...formData, overlay: e.target.value})} className="w-full p-2 border rounded border-slate-200 text-sm font-mono text-[10px]" />
                    </div>
                  </div>

                  <div className="col-span-2 mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">ยกเลิก</button>
                     <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700">บันทึกสไลด์</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
