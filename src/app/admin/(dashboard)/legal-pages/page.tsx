"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, ShieldCheck, FileSignature, Cookie } from "lucide-react";
import { toast } from "sonner";

type Section = { title: string; content: string };
type PageData = { lastUpdated: string; sections: Section[] };
type LegalData = { privacy: PageData; terms: PageData; cookies: PageData };

const pageConfig = [
  { key: "privacy", label: "นโยบายความเป็นส่วนตัว", icon: ShieldCheck, color: "blue", path: "/privacy" },
  { key: "terms", label: "ข้อกำหนดการให้บริการ", icon: FileSignature, color: "indigo", path: "/terms" },
  { key: "cookies", label: "นโยบายคุกกี้", icon: Cookie, color: "amber", path: "/cookies" },
] as const;

type PageKey = "privacy" | "terms" | "cookies";

const emptyPage = (): PageData => ({ lastUpdated: "", sections: [] });

export default function LegalPagesAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<PageKey>("privacy");
  const [data, setData] = useState<LegalData>({
    privacy: emptyPage(),
    terms: emptyPage(),
    cookies: emptyPage(),
  });

  useEffect(() => {
    fetch("/api/admin/legal-pages")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => toast.error("โหลดข้อมูลไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/legal-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) toast.success("บันทึกสำเร็จ");
      else toast.error("ไม่สามารถบันทึกได้");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: PageKey, field: keyof PageData, value: any) => {
    setData(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const updateSection = (key: PageKey, idx: number, field: keyof Section, value: string) => {
    const sections = [...data[key].sections];
    sections[idx] = { ...sections[idx], [field]: value };
    updateField(key, "sections", sections);
  };

  const addSection = (key: PageKey) => {
    updateField(key, "sections", [...data[key].sections, { title: "", content: "" }]);
  };

  const removeSection = (key: PageKey, idx: number) => {
    const sections = [...data[key].sections];
    sections.splice(idx, 1);
    updateField(key, "sections", sections);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const currentPage = data[activeTab];
  const config = pageConfig.find(p => p.key === activeTab)!;
  const Icon = config.icon;

  const colorMap: Record<string, string> = {
    blue: "border-blue-600 text-blue-600",
    indigo: "border-indigo-600 text-indigo-600",
    amber: "border-amber-600 text-amber-600",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการนโยบายและข้อกำหนด</h1>
          <p className="text-slate-500 text-sm mt-1">แก้ไขเนื้อหา Privacy, Terms, Cookies</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          บันทึกทั้งหมด
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {pageConfig.map(({ key, label, icon: TabIcon, color }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? `${colorMap[color]} bg-slate-50`
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <TabIcon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Meta */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className={`p-2 rounded-xl bg-${config.color}-50`}>
            <Icon className={`w-5 h-5 text-${config.color}-600`} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium mb-1">วันที่อัปเดต (แสดงบนหน้า)</p>
            <input
              type="text"
              value={currentPage.lastUpdated}
              onChange={e => updateField(activeTab, "lastUpdated", e.target.value)}
              placeholder="เช่น มิถุนายน 2026"
              className="w-full max-w-xs px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <a
            href={config.path}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline font-medium"
          >
            ดูหน้าจริง →
          </a>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {currentPage.sections.map((section, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 group relative">
              <button
                onClick={() => removeSection(activeTab, idx)}
                className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-3 pr-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                    หัวข้อ (หมวด {idx + 1})
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={e => updateSection(activeTab, idx, "title", e.target.value)}
                    placeholder="เช่น 1. ข้อมูลที่เรารวบรวม"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                    เนื้อหา
                  </label>
                  <textarea
                    rows={4}
                    value={section.content}
                    onChange={e => updateSection(activeTab, idx, "content", e.target.value)}
                    placeholder="รายละเอียดของหมวดนี้..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  />
                </div>
              </div>
            </div>
          ))}

          {currentPage.sections.length === 0 && (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              ยังไม่มีหมวดเนื้อหา กดปุ่มด้านล่างเพื่อเพิ่ม
            </div>
          )}

          <button
            onClick={() => addSection(activeTab)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มหมวดเนื้อหา
          </button>
        </div>
      </div>
    </div>
  );
}
