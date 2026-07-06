"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Save, Plus, Trash2, Eye, EyeOff, GripVertical, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploadBox, uploadImage } from "./MaterialPageManager";

type UseCaseItem = {
    _id: string;
    title: string;
    desc: string;
    image: string;
    materials: string[];
    isActive: boolean;
    order: number;
};

export type MaterialOption = { slug: string; name: string };

function UseCaseEditor({ item, materialOptions, onSave, onClose }: { item: UseCaseItem; materialOptions: MaterialOption[]; onSave: (updated: UseCaseItem) => void; onClose: () => void }) {
    const [form, setForm] = useState<UseCaseItem>({ ...item, materials: item.materials || [] });
    const [saving, setSaving] = useState(false);

    const set = (k: keyof UseCaseItem, v: any) => setForm(f => ({ ...f, [k]: v }));

    const toggleMaterial = (slug: string) => {
        set("materials", form.materials.includes(slug)
            ? form.materials.filter(s => s !== slug)
            : [...form.materials, slug]);
    };

    const handleSave = async () => {
        if (!form.title.trim()) { alert("กรุณากรอกชื่อ"); return; }
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/material-use-cases/${form._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) { onSave(data.data); onClose(); }
            else alert("บันทึกไม่สำเร็จ: " + data.error);
        } finally { setSaving(false); }
    };

    return (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">ชื่อ (Title)</label>
                    <input value={form.title} onChange={e => set("title", e.target.value)}
                        placeholder="e.g. Home Decor"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">ลำดับ (Order)</label>
                    <input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">คำอธิบาย</label>
                    <input value={form.desc} onChange={e => set("desc", e.target.value)}
                        placeholder="e.g. ของตกแต่งบ้าน"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        แสดงในวัสดุ <span className="text-slate-300 font-normal normal-case">(ไม่เลือก = แสดงทุกวัสดุ)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {materialOptions.map(opt => {
                            const selected = form.materials.includes(opt.slug);
                            return (
                                <button
                                    key={opt.slug}
                                    type="button"
                                    onClick={() => toggleMaterial(opt.slug)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                        selected
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                                    }`}
                                >
                                    {opt.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ImageUploadBox
                    label="รูปภาพ"
                    value={form.image || ""}
                    onChange={v => set("image", v)}
                    uploading={false}
                    onUpload={uploadImage}
                />
                <div className="flex flex-col justify-end">
                    <p className="text-xs text-slate-400 mb-2">รูปจะแสดงในการ์ด &quot;ไอเดียการใช้งาน&quot; หน้า Materials</p>
                    <p className="text-xs text-slate-400">แนะนำอัตราส่วน 4:3, ไม่เกิน 2MB</p>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 h-9 text-sm font-bold">
                    <Save className="w-4 h-4 mr-1.5" /> {saving ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
                <Button variant="outline" onClick={onClose} className="rounded-full px-6 h-9 text-sm border-slate-200">
                    ยกเลิก
                </Button>
            </div>
        </div>
    );
}

export default function UseCaseManager({ initialData, materialOptions }: { initialData: UseCaseItem[]; materialOptions: MaterialOption[] }) {
    const [items, setItems] = useState<UseCaseItem[]>(initialData);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [saving, setSaving] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);

    const toggleExpand = (id: string) => setExpanded(e => e === id ? null : id);

    const handleSave = (updated: UseCaseItem) => {
        setItems(prev => prev.map(item => item._id === updated._id ? updated : item));
    };

    const toggleActive = async (item: UseCaseItem) => {
        setSaving(item._id);
        try {
            const res = await fetch(`/api/admin/material-use-cases/${item._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !item.isActive }),
            });
            const data = await res.json();
            if (data.success) setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: !i.isActive } : i));
        } finally { setSaving(null); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("ลบไอเดียการใช้งานนี้?")) return;
        await fetch(`/api/admin/material-use-cases/${id}`, { method: "DELETE" });
        setItems(prev => prev.filter(i => i._id !== id));
    };

    const handleAdd = async () => {
        setAdding(true);
        try {
            const res = await fetch("/api/admin/material-use-cases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "ไอเดียใหม่", desc: "", image: "", materials: [], order: items.length + 1 }),
            });
            const data = await res.json();
            if (data.success) {
                setItems(prev => [...prev, data.data]);
                setExpanded(data.data._id);
            }
        } finally { setAdding(false); }
    };

    return (
        <div className="space-y-3">
            {items.map(item => (
                <div key={item._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-4 px-5 py-4">
                        <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />

                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                            {item.image
                                ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                                : <ImageIcon className="w-4 h-4 text-slate-300" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                                <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0">
                                    {item.materials?.length
                                        ? item.materials.map(s => materialOptions.find(o => o.slug === s)?.name || s).join(", ")
                                        : "ทุกวัสดุ"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{item.desc}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => toggleActive(item)}
                                disabled={saving === item._id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                    item.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                            >
                                {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                {item.isActive ? "แสดง" : "ซ่อน"}
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => toggleExpand(item._id)}
                                className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                {expanded === item._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {expanded === item._id && (
                        <UseCaseEditor
                            item={item}
                            materialOptions={materialOptions}
                            onSave={handleSave}
                            onClose={() => setExpanded(null)}
                        />
                    )}
                </div>
            ))}

            <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
                <Plus className="w-4 h-4" /> {adding ? "กำลังเพิ่ม..." : "เพิ่มไอเดียการใช้งาน"}
            </button>
        </div>
    );
}
