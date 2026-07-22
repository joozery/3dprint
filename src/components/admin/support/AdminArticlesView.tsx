"use client";

import { useState, useRef } from "react";
import { Plus, Edit2, Trash2, BookOpen, FileText, Upload, Loader2, Link2, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface Article {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  content?: string;
  linkUrl?: string;
  type: "guide" | "blog";
  isActive: boolean;
  order: number;
}

const emptyForm = {
  title: "",
  description: "",
  thumbnail: "",
  content: "",
  linkUrl: "",
  type: "guide" as "guide" | "blog",
  isActive: true,
  order: 0,
};

export default function AdminArticlesView({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [activeTab, setActiveTab] = useState<"guide" | "blog">("guide");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingContentImg, setIsUploadingContentImg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImgInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const filtered = articles.filter((a) => a.type === activeTab);

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingId(article._id);
      setFormData({
        title: article.title,
        description: article.description || "",
        thumbnail: article.thumbnail || "",
        content: article.content || "",
        linkUrl: article.linkUrl || "",
        type: article.type,
        isActive: article.isActive,
        order: article.order,
      });
    } else {
      setEditingId(null);
      setFormData({ ...emptyForm, type: activeTab, order: filtered.length });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
      setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      toast.success("อัปโหลดรูปภาพสำเร็จ");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // อัพโหลดรูปแล้วแทรก ![รูป](url) ลงในเนื้อหา ตรงตำแหน่ง cursor
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingContentImg(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "อัปโหลดไม่สำเร็จ");

      const tag = `\n![รูปประกอบ](${data.url})\n`;
      const ta = contentTextareaRef.current;
      const pos = ta ? ta.selectionStart : formData.content.length;
      const newContent = formData.content.slice(0, pos) + tag + formData.content.slice(pos);
      setFormData((prev) => ({ ...prev, content: newContent }));
      toast.success("แทรกรูปในเนื้อหาแล้ว");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploadingContentImg(false);
      if (contentImgInputRef.current) contentImgInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/articles/${editingId}` : `/api/admin/articles`;
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      if (editingId) {
        setArticles((prev) => prev.map((a) => (a._id === editingId ? data.article : a)));
        toast.success("อัปเดตบทความสำเร็จ");
      } else {
        setArticles((prev) => [...prev, data.article]);
        toast.success("เพิ่มบทความสำเร็จ");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบบทความนี้ออกหรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ไม่สามารถลบได้");
      setArticles((prev) => prev.filter((a) => a._id !== id));
      toast.success("ลบสำเร็จ");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleActive = async (article: Article) => {
    try {
      const res = await fetch(`/api/admin/articles/${article._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !article.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setArticles((prev) => prev.map((a) => (a._id === article._id ? data.article : a)));
      }
    } catch {
      toast.error("อัปเดตล้มเหลว");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "guide" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            <BookOpen size={14} /> คู่มือ (Guide)
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "blog" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            <FileText size={14} /> บทความ (Blog)
          </button>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
        >
          <Plus size={16} /> เพิ่ม{activeTab === "guide" ? "คู่มือ" : "บทความ"}ใหม่
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            {activeTab === "guide" ? <BookOpen size={40} className="mx-auto mb-3 opacity-30" /> : <FileText size={40} className="mx-auto mb-3 opacity-30" />}
            <p className="font-semibold">ยังไม่มี{activeTab === "guide" ? "คู่มือ" : "บทความ"}</p>
            <p className="text-sm mt-1">คลิก "เพิ่ม{activeTab === "guide" ? "คู่มือ" : "บทความ"}ใหม่" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">บทความ</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">ประเภท</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">ลำดับ</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((article) => (
                <tr key={article._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {article.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {article.type === "guide" ? (
                            <BookOpen size={16} className="text-slate-400" />
                          ) : (
                            <FileText size={16} className="text-slate-400" />
                          )}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{article.title}</p>
                        {article.description && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{article.description}</p>
                        )}
                        {article.linkUrl && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-500 mt-1">
                            <Link2 size={10} /> {article.linkUrl.length > 40 ? article.linkUrl.slice(0, 40) + "…" : article.linkUrl}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center hidden md:table-cell">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${article.type === "guide" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                      {article.type === "guide" ? "คู่มือ" : "บทความ"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className="text-slate-500 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                      {article.order}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(article)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${article.isActive ? "bg-blue-500" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${article.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(article)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              {editingId ? "แก้ไขบทความ" : `เพิ่ม${formData.type === "guide" ? "คู่มือ" : "บทความ"}ใหม่`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    ชื่อบทความ <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="ชื่อบทความ..."
                    className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">ประเภท</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "guide" | "blog" })}
                    className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
                  >
                    <option value="guide">คู่มือการใช้งาน (Guide)</option>
                    <option value="blog">บทความ (Blog)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">คำอธิบายย่อ</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="คำอธิบายสั้นๆ..."
                  className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">รูป Thumbnail</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="URL รูปภาพ..."
                    className="flex-1 p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-3 py-2.5 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold disabled:opacity-60 transition shrink-0"
                  >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    อัปโหลด
                  </button>
                </div>
                {formData.thumbnail && (
                  <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.thumbnail} alt="thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">
                  ลิงก์ปลายทาง <span className="text-slate-400 font-normal">(คลิกการ์ดแล้วไปหน้าไหน)</span>
                </label>
                <div className="flex items-center gap-2 p-2.5 border rounded-xl border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <Link2 size={15} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="เช่น /support/guide/how-to หรือ https://..."
                    className="flex-1 outline-none text-sm bg-transparent"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">ปล่อยว่างถ้าไม่ต้องการให้การ์ดคลิกได้</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-500 block">เนื้อหา (Content)</label>
                  <input ref={contentImgInputRef} type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => contentImgInputRef.current?.click()}
                    disabled={isUploadingContentImg}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold disabled:opacity-60 transition"
                  >
                    {isUploadingContentImg ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
                    แทรกรูปในเนื้อหา
                  </button>
                </div>
                <textarea
                  ref={contentTextareaRef}
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder={"เนื้อหาบทความ — พิมพ์ข้อความปกติ ขึ้นบรรทัดใหม่ได้เลย\nแทรกรูปด้วยปุ่มด้านบน หรือพิมพ์ ![คำอธิบายรูป](URL รูป) เอง"}
                  className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-y font-mono leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">รูปจะแสดงเต็มความกว้างตรงตำแหน่งที่แทรกในหน้าอ่านคู่มือ</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">ลำดับ</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-blue-500" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${formData.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-sm font-semibold text-slate-600">
                      {formData.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
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
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
