"use client";

import { useState, useRef } from "react";
import { Plus, Edit2, Trash2, Upload, Loader2, Download, Box, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface FreeModel {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  fileUrl?: string;
  fileFormat: string;
  fileSize?: string;
  category: string;
  tags: string[];
  downloads: number;
  isActive: boolean;
  order: number;
}

const CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "functional", label: "ชิ้นส่วนใช้งาน" },
  { value: "decorative", label: "ของตกแต่ง" },
  { value: "art", label: "งานศิลปะ" },
  { value: "toys", label: "ของเล่น" },
  { value: "other", label: "อื่นๆ" },
];

const CATEGORY_COLORS: Record<string, string> = {
  functional: "bg-blue-100 text-blue-700",
  decorative: "bg-pink-100 text-pink-700",
  art: "bg-purple-100 text-purple-700",
  toys: "bg-amber-100 text-amber-700",
  other: "bg-slate-100 text-slate-600",
};

const defaultForm = {
  name: "",
  description: "",
  thumbnail: "",
  fileUrl: "",
  fileFormat: "STL",
  fileSize: "",
  category: "other",
  tags: "",
  order: 0,
  isActive: true,
};

export default function AdminFreeModelsView({ initialModels }: { initialModels: FreeModel[] }) {
  const [models, setModels] = useState<FreeModel[]>(initialModels);
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ ...defaultForm });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const filteredModels = activeTab === "all"
    ? models
    : models.filter(m => m.category === activeTab);

  const handleOpenModal = (m?: FreeModel) => {
    if (m) {
      setEditingId(m._id);
      setFormData({
        name: m.name,
        description: m.description || "",
        thumbnail: m.thumbnail || "",
        fileUrl: m.fileUrl || "",
        fileFormat: m.fileFormat,
        fileSize: m.fileSize || "",
        category: m.category,
        tags: m.tags.join(", "),
        order: m.order,
        isActive: m.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({ ...defaultForm, order: models.length });
    }
    setIsModalOpen(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
      setFormData(prev => ({ ...prev, thumbnail: data.url }));
      toast.success("อัปโหลดรูปภาพสำเร็จ");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
      };

      const url = editingId
        ? `/api/admin/free-models/${editingId}`
        : `/api/admin/free-models`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      if (editingId) {
        setModels(prev => prev.map(m => m._id === editingId ? data.model : m));
        toast.success("อัปเดตโมเดลสำเร็จ");
      } else {
        setModels(prev => [...prev, data.model]);
        toast.success("เพิ่มโมเดลสำเร็จ");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบโมเดลนี้ออกจากคลังหรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/free-models/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ไม่สามารถลบได้");
      setModels(prev => prev.filter(m => m._id !== id));
      toast.success("ลบสำเร็จ");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleActive = async (m: FreeModel) => {
    try {
      const res = await fetch(`/api/admin/free-models/${m._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !m.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setModels(prev => prev.map(item => item._id === m._id ? data.model : item));
      }
    } catch {
      toast.error("อัปเดตล้มเหลว");
    }
  };

  const handleResetDownloads = async (m: FreeModel) => {
    if (!confirm(`รีเซ็ตยอดดาวน์โหลดของ "${m.name}" เป็น 0 หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/admin/free-models/${m._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloads: 0 }),
      });
      if (res.ok) {
        const data = await res.json();
        setModels(prev => prev.map(item => item._id === m._id ? data.model : item));
        toast.success("รีเซ็ตยอดดาวน์โหลดสำเร็จ");
      }
    } catch {
      toast.error("รีเซ็ตล้มเหลว");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Category Tabs */}
        <div className="flex items-center flex-wrap gap-2 flex-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === cat.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
              <span className="ml-1.5 opacity-70">
                ({cat.value === "all"
                  ? models.length
                  : models.filter(m => m.category === cat.value).length})
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shrink-0"
        >
          <Plus size={16} /> เพิ่มโมเดลใหม่
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">รูป</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อ / คำอธิบาย</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">หมวดหมู่</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ไฟล์</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">ดาวน์โหลด</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400 text-sm">
                    <Box size={32} className="mx-auto mb-3 opacity-30" />
                    ยังไม่มีโมเดลในหมวดหมู่นี้
                  </td>
                </tr>
              ) : (
                filteredModels.map(m => (
                  <tr key={m._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                        {m.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.thumbnail} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <Box size={18} className="text-slate-300" />
                        )}
                      </div>
                    </td>

                    {/* Name / description / tags */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-bold text-slate-800 truncate">{m.name}</p>
                      {m.description && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{m.description}</p>
                      )}
                      {m.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${CATEGORY_COLORS[m.category] || CATEGORY_COLORS.other}`}>
                        {CATEGORIES.find(c => c.value === m.category)?.label || m.category}
                      </span>
                    </td>

                    {/* File info */}
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                        {m.fileFormat}
                      </span>
                      {m.fileSize && (
                        <p className="text-[10px] text-slate-400 mt-1">{m.fileSize}</p>
                      )}
                    </td>

                    {/* Downloads */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Download size={13} className="text-slate-400" />
                        <span className="font-bold text-slate-700">{m.downloads.toLocaleString()}</span>
                        <button
                          onClick={() => handleResetDownloads(m)}
                          title="รีเซ็ตยอดดาวน์โหลด"
                          className="ml-1 p-1 rounded text-slate-300 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                        >
                          <RotateCcw size={11} />
                        </button>
                      </div>
                    </td>

                    {/* Active toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(m)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${m.isActive ? "bg-blue-500" : "bg-slate-300"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${m.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(m)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg mb-6">
              {editingId ? "แก้ไขโมเดล" : "เพิ่มโมเดลใหม่"}
            </h3>

            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1 block">
                  ชื่อโมเดล <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น Twisted Vase, Spur Gear 20T"
                  className="w-full p-2.5 border rounded-lg border-slate-200 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1 block">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="อธิบายโมเดลนี้สั้นๆ"
                  className="w-full p-2.5 border rounded-lg border-slate-200 focus:border-blue-500 focus:outline-none text-sm resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">หมวดหมู่</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="functional">ชิ้นส่วนใช้งาน (Functional)</option>
                  <option value="decorative">ของตกแต่ง (Decorative)</option>
                  <option value="art">งานศิลปะ (Art)</option>
                  <option value="toys">ของเล่น (Toys)</option>
                  <option value="other">อื่นๆ (Other)</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">แท็ก</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="gear, mechanical, tools"
                  className="w-full p-2.5 border rounded-lg border-slate-200 focus:border-blue-500 focus:outline-none text-sm"
                />
                <p className="text-[10px] text-slate-400 mt-1">คั่นด้วยจุลภาค เช่น gear, mechanical, tools</p>
              </div>

              {/* Thumbnail Upload */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1 block">รูปภาพตัวอย่าง (Thumbnail)</label>
                <div className="space-y-2">
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold disabled:opacity-60 transition"
                  >
                    {isUploading ? (
                      <><Loader2 size={15} className="animate-spin" /> กำลังอัปโหลด...</>
                    ) : (
                      <><Upload size={15} /> อัปโหลดรูปภาพ</>
                    )}
                  </button>
                  {formData.thumbnail && (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.thumbnail} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="หรือพิมพ์ URL รูปตรงนี้"
                    className="w-full p-2 border rounded-lg border-slate-200 focus:border-blue-500 focus:outline-none text-xs text-slate-500"
                  />
                </div>
              </div>

              {/* File URL (manual only, no upload for 3D files) */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1 block">URL ไฟล์ 3D (สำหรับดาวน์โหลด)</label>
                <input
                  type="text"
                  value={formData.fileUrl}
                  onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://example.com/models/file.stl"
                  className="w-full p-2.5 border rounded-lg border-slate-200 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              {/* File Format + File Size */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">รูปแบบไฟล์</label>
                <select
                  value={formData.fileFormat}
                  onChange={e => setFormData({ ...formData, fileFormat: e.target.value })}
                  className="w-full p-2.5 border rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="STL">STL</option>
                  <option value="OBJ">OBJ</option>
                  <option value="STEP">STEP</option>
                  <option value="3MF">3MF</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">ขนาดไฟล์</label>
                <input
                  type="text"
                  value={formData.fileSize}
                  onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                  placeholder="เช่น 2.4 MB"
                  className="w-full p-2.5 border rounded-lg border-slate-200 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              {/* Order + isActive */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">ลำดับการแสดง (Order)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border rounded-lg border-slate-200 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="text-xs font-bold text-slate-500 mb-2 block">แสดงในเว็บไซต์</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${formData.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-sm font-bold text-slate-600">
                    {formData.isActive ? "แสดงอยู่" : "ซ่อนอยู่"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2 mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มโมเดล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
