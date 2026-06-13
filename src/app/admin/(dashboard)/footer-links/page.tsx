"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Link2,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Save,
  X,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FooterLink = {
  _id: string;
  label: string;
  url: string;
  category: "services" | "materials" | "resources" | "company";
  openInNewTab: boolean;
  isActive: boolean;
  order: number;
};

const CATEGORIES = [
  { value: "services", label: "บริการ (Services)" },
  { value: "materials", label: "วัสดุ (Materials)" },
  { value: "resources", label: "แหล่งเรียนรู้ (Resources)" },
  { value: "company", label: "เกี่ยวกับองค์กร (Company)" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  services: "bg-blue-100 text-blue-700 border-blue-200",
  materials: "bg-emerald-100 text-emerald-700 border-emerald-200",
  resources: "bg-violet-100 text-violet-700 border-violet-200",
  company: "bg-amber-100 text-amber-700 border-amber-200",
};

const emptyForm = {
  label: "",
  url: "",
  category: "company" as FooterLink["category"],
  openInNewTab: true,
  isActive: true,
  order: 0,
};

export default function AdminFooterLinksPage() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FooterLink | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/admin/footer-links");
      const data = await res.json();
      if (data.success) setLinks(data.links);
    } catch {
      toast.error("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (link: FooterLink) => {
    setEditing(link);
    setForm({
      label: link.label,
      url: link.url,
      category: link.category,
      openInNewTab: link.openInNewTab,
      isActive: link.isActive,
      order: link.order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.label.trim() || !form.url.trim()) {
      toast.error("กรุณากรอก ชื่อ และ URL");
      return;
    }
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/admin/footer-links/${editing._id}`
        : "/api/admin/footer-links";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      toast.success(editing ? "อัปเดตลิ้งค์แล้ว" : "เพิ่มลิ้งค์แล้ว");
      setShowForm(false);
      fetchLinks();
    } catch {
      toast.error("บันทึกล้มเหลว");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/footer-links/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error();
      toast.success("ลบลิ้งค์แล้ว");
      fetchLinks();
    } catch {
      toast.error("ลบล้มเหลว");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (link: FooterLink) => {
    try {
      const res = await fetch(`/api/admin/footer-links/${link._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) =>
          prev.map((l) => (l._id === link._id ? { ...l, isActive: !l.isActive } : l))
        );
        toast.success(link.isActive ? "ซ่อนลิ้งค์แล้ว" : "แสดงลิ้งค์แล้ว");
      }
    } catch {
      toast.error("เปลี่ยนสถานะล้มเหลว");
    }
  };

  const filtered = filterCat === "all" ? links : links.filter((l) => l.category === filterCat);
  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = filtered.filter((l) => l.category === cat.value);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">จัดการลิ้งค์ Footer</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              เพิ่ม / แก้ไข / ลบลิ้งค์ที่แสดงใน Footer ของเว็บไซต์
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" />
          เพิ่มลิ้งค์ใหม่
        </Button>
      </div>

      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const count = links.filter((l) => l.category === cat.value).length;
            const active = links.filter((l) => l.category === cat.value && l.isActive).length;
            return (
              <div
                key={cat.value}
                onClick={() => setFilterCat(filterCat === cat.value ? "all" : cat.value)}
                className={cn(
                  "bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md",
                  filterCat === cat.value ? "border-blue-300 shadow-md bg-blue-50/50" : "border-slate-200"
                )}
              >
                <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full inline-block border", CATEGORY_COLORS[cat.value])}>
                  {cat.label.split(" ")[0]}
                </p>
                <p className="text-2xl font-black text-slate-800 mt-2">{count}</p>
                <p className="text-xs text-slate-400 mt-0.5">{active} แสดงอยู่</p>
              </div>
            );
          })}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCat("all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold border transition-all",
              filterCat === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
            )}
          >
            ทั้งหมด ({links.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCat(filterCat === cat.value ? "all" : cat.value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold border transition-all",
                filterCat === cat.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Links Table by Category */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <Link2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">ยังไม่มีลิ้งค์ใน Footer</p>
            <p className="text-sm text-slate-400 mt-1 mb-6">กดปุ่ม "เพิ่มลิ้งค์ใหม่" เพื่อเริ่มต้น</p>
            <Button onClick={openCreate} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2">
              <Plus className="w-4 h-4" /> เพิ่มลิ้งค์แรก
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map((cat) => {
              const catLinks = grouped[cat.value];
              if (catLinks.length === 0) return null;
              return (
                <div key={cat.value} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <span className={cn("text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border", CATEGORY_COLORS[cat.value])}>
                      {cat.label}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{catLinks.length} ลิ้งค์</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {catLinks.map((link) => (
                      <div
                        key={link._id}
                        className={cn(
                          "flex items-center gap-4 px-5 py-4 group hover:bg-slate-50/50 transition-colors",
                          !link.isActive && "opacity-50"
                        )}
                      >
                        <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-800 truncate">{link.label}</span>
                            {!link.isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-bold border border-slate-200">ซ่อนอยู่</span>
                            )}
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1 mt-0.5 max-w-[360px] truncate"
                          >
                            <Globe className="w-3 h-3 shrink-0" />
                            <span className="truncate">{link.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Toggle Active */}
                          <button
                            onClick={() => toggleActive(link)}
                            title={link.isActive ? "ซ่อน" : "แสดง"}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                          >
                            {link.isActive
                              ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                              : <ToggleLeft className="w-5 h-5" />
                            }
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => openEdit(link)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(link._id)}
                            disabled={deletingId === link._id}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  {editing ? "แก้ไขลิ้งค์" : "เพิ่มลิ้งค์ใหม่"}
                </h2>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  ชื่อที่แสดง *
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="เช่น ติดต่อเรา, About Us"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  URL ปลายทาง *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://example.com หรือ /about"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
                {form.url && (
                  <a
                    href={form.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> ทดสอบเปิดลิ้งค์
                  </a>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  หมวดหมู่
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as FooterLink["category"] })}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white appearance-none transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  ลำดับ (น้อย = อยู่บน)
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-3">
                <button
                  onClick={() => setForm({ ...form, openInNewTab: !form.openInNewTab })}
                  className={cn(
                    "flex-1 flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all",
                    form.openInNewTab
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    เปิดแท็บใหม่
                  </span>
                  {form.openInNewTab
                    ? <ToggleRight className="w-5 h-5 text-blue-600" />
                    : <ToggleLeft className="w-5 h-5 text-slate-400" />
                  }
                </button>

                <button
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={cn(
                    "flex-1 flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all",
                    form.isActive
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  )}
                >
                  <span>แสดงใน Footer</span>
                  {form.isActive
                    ? <ToggleRight className="w-5 h-5 text-emerald-600" />
                    : <ToggleLeft className="w-5 h-5 text-slate-400" />
                  }
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border-slate-200 text-slate-600"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-md shadow-blue-200"
              >
                {saving ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />กำลังบันทึก...</span>
                ) : (
                  <><Save className="w-4 h-4" />{editing ? "อัปเดต" : "เพิ่มลิ้งค์"}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
