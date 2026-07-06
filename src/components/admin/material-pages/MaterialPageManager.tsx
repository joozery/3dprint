"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Save, Plus, Trash2, Eye, EyeOff, GripVertical, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Property = { label: string; subLabel: string; value: number };
type MaterialItem = {
    _id: string;
    slug: string;
    name: string;
    fullName: string;
    shortDesc: string;
    features: string[];
    properties: Property[];
    nozzleTemp: string;
    bedTemp: string;
    cooling: string;
    iconName: string;
    iconColor: string;
    iconBg: string;
    coverImage: string;
    thumbnails: string[];
    detailUrl: string;
    badge: string;
    isActive: boolean;
    order: number;
};

const ICON_OPTIONS = ["Leaf", "Shield", "Box", "Droplets", "Layers", "Zap", "Settings", "Sparkles", "Cpu", "Flame"];
const COLOR_OPTIONS = [
    { label: "Green", color: "text-green-500", bg: "bg-green-50" },
    { label: "Orange", color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Blue", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Cyan", color: "text-cyan-500", bg: "bg-cyan-50" },
    { label: "Slate", color: "text-slate-500", bg: "bg-slate-50" },
    { label: "Purple", color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Zinc", color: "text-zinc-800", bg: "bg-zinc-100" },
    { label: "Red", color: "text-red-500", bg: "bg-red-50" },
    { label: "Yellow", color: "text-yellow-500", bg: "bg-yellow-50" },
];

export function ImageUploadBox({
    value, onChange, label, uploading, onUpload,
}: {
    value: string; onChange: (url: string) => void; label: string;
    uploading: boolean; onUpload: (file: File) => Promise<string>;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleFile = async (file: File) => {
        setLoading(true);
        try {
            const url = await onUpload(file);
            onChange(url);
        } finally { setLoading(false); }
    };

    return (
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
            <div
                onClick={() => !loading && inputRef.current?.click()}
                className="relative w-full h-36 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-slate-400 transition-colors bg-slate-50 flex items-center justify-center group"
            >
                {value ? (
                    <>
                        <img src={value} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="text-white text-xs font-bold flex items-center gap-1"><Upload className="w-3.5 h-3.5" /> เปลี่ยนรูป</span>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); onChange(""); }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <div className="text-center text-slate-400 pointer-events-none">
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-500 mx-auto" />
                        ) : (
                            <>
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p className="text-xs font-bold">คลิกเพื่ออัพโหลดรูป</p>
                                <p className="text-[10px] text-slate-300 mt-0.5">JPG, PNG, WEBP</p>
                            </>
                        )}
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            />
            {value && (
                <input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="หรือวาง URL รูปภาพ"
                    className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-900 bg-white"
                />
            )}
        </div>
    );
}

function ThumbnailGallery({
    thumbnails, onChange, onUpload,
}: {
    thumbnails: string[]; onChange: (arr: string[]) => void;
    onUpload: (file: File) => Promise<string>;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleFile = async (file: File) => {
        if (thumbnails.length >= 4) return;
        setLoading(true);
        try {
            const url = await onUpload(file);
            onChange([...thumbnails, url]);
        } finally { setLoading(false); }
    };

    const remove = (i: number) => onChange(thumbnails.filter((_, idx) => idx !== i));

    return (
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Gallery / Thumbnails <span className="text-slate-300 font-normal">(สูงสุด 4 รูป)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
                {thumbnails.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                            onClick={() => remove(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {thumbnails.length < 4 && (
                    <button
                        onClick={() => inputRef.current?.click()}
                        disabled={loading}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 transition-colors flex items-center justify-center bg-slate-50"
                    >
                        {loading
                            ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400" />
                            : <Plus className="w-5 h-5 text-slate-400" />}
                    </button>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            />
        </div>
    );
}

function PropertyRow({ prop, onChange, onDelete }: { prop: Property; onChange: (p: Property) => void; onDelete: () => void }) {
    return (
        <div className="flex items-center gap-2 py-2 border-b border-slate-100">
            <div className="flex-1 grid grid-cols-5 gap-2">
                <input
                    value={prop.label}
                    onChange={e => onChange({ ...prop, label: e.target.value })}
                    placeholder="ชื่อ"
                    className="col-span-2 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
                />
                <input
                    value={prop.subLabel}
                    onChange={e => onChange({ ...prop, subLabel: e.target.value })}
                    placeholder="(English)"
                    className="col-span-2 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
                />
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        min={0} max={5}
                        value={prop.value}
                        onChange={e => onChange({ ...prop, value: Number(e.target.value) })}
                        className="w-12 border border-slate-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-slate-500"
                    />
                    <span className="text-xs text-slate-400">/5</span>
                </div>
            </div>
            <button onClick={onDelete} className="text-red-400 hover:text-red-600 p-1 rounded">
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

export async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Upload failed");
    return data.url;
}

function MaterialEditor({ item, onSave, onClose }: { item: MaterialItem; onSave: (updated: MaterialItem) => void; onClose: () => void }) {
    const [form, setForm] = useState<MaterialItem>({ ...item, thumbnails: item.thumbnails || [] });
    const [saving, setSaving] = useState(false);

    const set = (k: keyof MaterialItem, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/material-pages/${form._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) { onSave(data.data); onClose(); }
            else alert("บันทึกไม่สำเร็จ: " + data.error);
        } finally { setSaving(false); }
    };

    const addFeature = () => set("features", [...form.features, ""]);
    const updateFeature = (i: number, v: string) => set("features", form.features.map((f, idx) => idx === i ? v : f));
    const removeFeature = (i: number) => set("features", form.features.filter((_, idx) => idx !== i));

    const addProperty = () => set("properties", [...form.properties, { label: "", subLabel: "", value: 3 }]);
    const updateProperty = (i: number, p: Property) => set("properties", form.properties.map((x, idx) => idx === i ? p : x));
    const removeProperty = (i: number) => set("properties", form.properties.filter((_, idx) => idx !== i));

    return (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Slug</label>
                    <input value={form.slug} onChange={e => set("slug", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">ชื่อ (Name)</label>
                    <input value={form.name} onChange={e => set("name", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                    <input value={form.fullName} onChange={e => set("fullName", e.target.value)}
                        placeholder="e.g. Polylactic Acid"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">คำอธิบายสั้น</label>
                    <textarea value={form.shortDesc} onChange={e => set("shortDesc", e.target.value)} rows={2}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white resize-none" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Badge</label>
                    <input value={form.badge} onChange={e => set("badge", e.target.value)}
                        placeholder="เช่น ยอดนิยม"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Detail URL</label>
                    <input value={form.detailUrl} onChange={e => set("detailUrl", e.target.value)}
                        placeholder="/materials/pla"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Icon</label>
                    <select value={form.iconName} onChange={e => set("iconName", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white">
                        {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">สี</label>
                    <select
                        value={form.iconColor}
                        onChange={e => {
                            const opt = COLOR_OPTIONS.find(c => c.color === e.target.value);
                            if (opt) { set("iconColor", opt.color); set("iconBg", opt.bg); }
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white"
                    >
                        {COLOR_OPTIONS.map(c => <option key={c.color} value={c.color}>{c.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">ลำดับ (Order)</label>
                    <input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">รูปภาพ</h4>
                <div className="grid grid-cols-2 gap-4">
                    <ImageUploadBox
                        label="Cover Image (รูปหลัก)"
                        value={form.coverImage || ""}
                        onChange={v => set("coverImage", v)}
                        uploading={false}
                        onUpload={uploadImage}
                    />
                    <div className="flex flex-col justify-end">
                        <p className="text-xs text-slate-400 mb-2">รูป Cover จะแสดงเป็น background ของ material card</p>
                        <p className="text-xs text-slate-400">แนะนำขนาด: 800×500px, ไม่เกิน 2MB</p>
                    </div>
                </div>
                <ThumbnailGallery
                    thumbnails={form.thumbnails}
                    onChange={v => set("thumbnails", v)}
                    onUpload={uploadImage}
                />
            </div>

            {/* Print Params */}
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Print Parameters</h4>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Nozzle Temp", key: "nozzleTemp" as const },
                        { label: "Bed Temp", key: "bedTemp" as const },
                        { label: "Cooling", key: "cooling" as const },
                    ].map(p => (
                        <div key={p.key}>
                            <label className="text-xs text-slate-500 block mb-1">{p.label}</label>
                            <input value={form[p.key]} onChange={e => set(p.key, e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Features (Bullet Points)</h4>
                    <button onClick={addFeature} className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline">
                        <Plus className="w-3.5 h-3.5" /> เพิ่ม
                    </button>
                </div>
                <div className="space-y-2">
                    {form.features.map((f, i) => (
                        <div key={i} className="flex gap-2">
                            <input value={f} onChange={e => updateFeature(i, e.target.value)}
                                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white" />
                            <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 px-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Properties */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Material Properties (0–5)</h4>
                    <button onClick={addProperty} className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline">
                        <Plus className="w-3.5 h-3.5" /> เพิ่ม
                    </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 px-4 py-2">
                    <div className="grid grid-cols-5 gap-2 py-1 border-b border-slate-100 mb-1">
                        <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase">ชื่อ (TH)</span>
                        <span className="col-span-2 text-[10px] font-bold text-slate-400 uppercase">(EN)</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase text-center">คะแนน</span>
                    </div>
                    {form.properties.map((p, i) => (
                        <PropertyRow key={i} prop={p} onChange={v => updateProperty(i, v)} onDelete={() => removeProperty(i)} />
                    ))}
                </div>
            </div>

            {/* Actions */}
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

export default function MaterialPageManager({ initialData }: { initialData: MaterialItem[] }) {
    const [items, setItems] = useState<MaterialItem[]>(initialData);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [saving, setSaving] = useState<string | null>(null);

    const toggleExpand = (id: string) => setExpanded(e => e === id ? null : id);

    const handleSave = (updated: MaterialItem) => {
        setItems(items.map(item => item._id === updated._id ? updated : item));
    };

    const toggleActive = async (item: MaterialItem) => {
        setSaving(item._id);
        try {
            const res = await fetch(`/api/admin/material-pages/${item._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !item.isActive }),
            });
            const data = await res.json();
            if (data.success) setItems(items.map(i => i._id === item._id ? { ...i, isActive: !i.isActive } : i));
        } finally { setSaving(null); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("ลบวัสดุนี้?")) return;
        await fetch(`/api/admin/material-pages/${id}`, { method: "DELETE" });
        setItems(items.filter(i => i._id !== id));
    };

    return (
        <div className="space-y-3">
            {items.map(item => (
                <div key={item._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Header row */}
                    <div className="flex items-center gap-4 px-5 py-4">
                        <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />

                        {/* Color swatch */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconBg} shrink-0`}>
                            <span className={`text-xs font-black ${item.iconColor}`}>{item.name.slice(0, 2)}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                                {item.fullName && <span className="text-xs text-slate-400">{item.fullName}</span>}
                                {item.badge && (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{item.shortDesc}</p>
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

                    {/* Properties preview */}
                    {expanded !== item._id && (
                        <div className="px-5 pb-4 flex flex-wrap gap-2">
                            {item.properties.map((p, i) => (
                                <span key={i} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                                    {p.label} <strong className="text-slate-700">{p.value}/5</strong>
                                </span>
                            ))}
                            <span className="text-[10px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                                🌡 {item.nozzleTemp}
                            </span>
                        </div>
                    )}

                    {/* Editor */}
                    {expanded === item._id && (
                        <MaterialEditor
                            item={item}
                            onSave={handleSave}
                            onClose={() => setExpanded(null)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
