"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Info, Trash2, ChevronDown, CheckCircle2, AlertCircle, Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Viewer3D } from "./Viewer3D";

const technologies = [
    { id: "sla", label: "SLA(Resin)" },
    { id: "mjf", label: "MJF(Nylon)" },
    { id: "slm", label: "SLM(Metal)" },
    { id: "fdm", label: "FDM(Plastic)" },
    { id: "sls", label: "SLS(Nylon)" },
    { id: "wjp", label: "WJP(Resin)" },
    { id: "bj", label: "BJ(Metal)" },
];

interface QuoteFormProps {
    quotes: any[];
    onAdd: (quote: any) => void;
    onUpdate: (quote: any) => void;
    onRemove: (id: string) => void;
}

// ─── Individual Quote Card ───────────────────────────────────────────────────
function QuoteCard({ quote, onUpdate, onRemove, rawFile, materials }: {
    quote: any;
    onUpdate: (q: any) => void;
    onRemove: (id: string) => void;
    rawFile?: File | null;
    materials: any[];
}) {
    const [selectedTech, setSelectedTech] = useState(quote.technology || "sla");
    const [selectedMaterial, setSelectedMaterial] = useState(quote.material || "9600");
    const [color, setColor] = useState(quote.color || "ขาวด้าน (Matte White)");
    const [qty, setQty] = useState(quote.quantity || 1);
    const [isExpanded, setIsExpanded] = useState(true);

    const getModelColor = () => {
        if (selectedTech === "mjf") return "#333333";
        if (selectedTech === "slm") return "#a0a0a0";
        if (selectedMaterial === "9600") return "#f8f8f8";
        if (selectedMaterial === "black") return "#222222";
        if (selectedMaterial === "imagine") return "#1a1a1a";
        return "#3b82f6";
    };

    const patchQuote = async (updates: any) => {
        try {
            const res = await fetch(`/api/quote/${quote._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    technology: selectedTech,
                    material: selectedMaterial,
                    color,
                    quantity: qty,
                    ...updates
                }),
            });
            const result = await res.json();
            if (result.success) onUpdate(result.data);
        } catch (err) {
            console.error("Patch failed", err);
        }
    };

    const handleTechChange = (id: string) => { setSelectedTech(id); patchQuote({ technology: id }); };
    const handleMaterialChange = (id: string) => { setSelectedMaterial(id); patchQuote({ material: id }); };
    const handleQtyChange = (n: number) => { setQty(n); patchQuote({ quantity: n }); };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const deleteQuote = async () => {
        try {
            await fetch(`/api/quote/${quote._id}`, { method: "DELETE" });
            onRemove(quote._id);
            setShowDeleteConfirm(false);
        } catch (err) { console.error("Delete failed", err); }
    };

    return (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 relative">
            
            {/* Delete Confirmation Modal Overlay */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">ยืนยันการลบไฟล์</h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ <span className="font-bold text-slate-700">{quote.originalName}</span> ออกจากตะกร้า? การกระทำนี้ไม่สามารถย้อนกลับได้
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button 
                                    onClick={deleteQuote}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-200 transition-colors"
                                >
                                    ยืนยันลบ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <div className="absolute top-4 right-6 z-10">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                    {isExpanded ? "Collapse" : "Expand"}
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", !isExpanded && "rotate-[-90deg]")} />
                </button>
            </div>

            {!isExpanded ? (
                /* ── Compact View ── */
                <div className="p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <Viewer3D file={rawFile} fileUrl={quote.fileUrl} fileName={quote.originalName} color={getModelColor()} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{quote.originalName}</p>
                            <p className="text-xs text-slate-500">{materials.find(m => m.systemId === selectedMaterial)?.name || selectedMaterial} · {color}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">{selectedTech}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 pr-16">
                        <div className="flex items-center gap-2 border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
                            <button onClick={() => handleQtyChange(Math.max(1, qty - 1))} className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-sm font-bold border-r">-</button>
                            <span className="px-3 text-sm font-bold">{qty}</span>
                            <button onClick={() => handleQtyChange(qty + 1)} className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-sm font-bold border-l">+</button>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-orange-500">฿{quote.priceDetail?.totalPrice?.toLocaleString() || "0"}</p>
                            <button onClick={() => setIsExpanded(true)} className="text-[10px] font-bold text-slate-400 hover:text-blue-600 flex items-center justify-end gap-1">
                                Detail <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                            </button>
                        </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                        <button onClick={() => setShowDeleteConfirm(true)} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Expanded View ── */
                <div className="p-6">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left: Preview */}
                        <div className="col-span-12 md:col-span-3 space-y-4">
                            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 relative overflow-hidden shadow-inner">
                                <Viewer3D file={rawFile} fileUrl={quote.fileUrl} fileName={quote.originalName} color={getModelColor()} />
                                {!rawFile && !quote.fileUrl && <Layers className="w-12 h-12 text-slate-300" />}
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-[9px] py-0 px-1 h-4">3D View</Badge>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-sm font-bold text-slate-900 truncate" title={quote.originalName}>{quote.originalName}</h3>
                                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] py-0 px-1.5 h-4 hover:bg-blue-50">
                                        {selectedTech.toUpperCase()} | {materials.find(m => m.systemId === selectedMaterial)?.name || selectedMaterial}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {quote.dimensions?.x?.toFixed(1) || "-"} x {quote.dimensions?.y?.toFixed(1) || "-"} x {quote.dimensions?.z?.toFixed(1) || "-"} mm
                                </p>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                        <Layers className="w-3 h-3" /> {quote.volumeCm3?.toFixed(2) || "-"} cm³
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                        <Info className="w-3 h-3" /> {quote.weightGrams?.toFixed(2) || "-"} g
                                    </p>
                                    <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                                        <ChevronDown className="w-3 h-3 rotate-[-90deg]" /> {quote.printTime || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Options */}
                        <div className="col-span-12 md:col-span-9 space-y-6">
                            {/* Technology */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">เทคโนโลยีการพิมพ์</label>
                                <div className="flex flex-wrap gap-2">
                                    {technologies.map((tech) => (
                                        <button
                                            key={tech.id}
                                            onClick={() => handleTechChange(tech.id)}
                                            className={cn(
                                                "px-4 py-1.5 rounded-md text-sm transition-all border",
                                                selectedTech === tech.id
                                                    ? "border-blue-600 text-blue-600 bg-blue-50 font-bold"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm"
                                            )}
                                        >
                                            {tech.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Material */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">วัสดุ</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {materials.filter(m => m.technology?.toLowerCase() === selectedTech.toLowerCase()).map((mat) => (
                                        <button
                                            key={mat._id}
                                            onClick={() => handleMaterialChange(mat._id)}
                                            className={cn(
                                                "relative px-3 py-2 rounded-md text-sm transition-all border text-left flex items-center justify-between shadow-sm",
                                                selectedMaterial === mat._id
                                                    ? "border-blue-600 text-blue-600 bg-blue-50 font-bold"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                                            )}
                                        >
                                            <span className="truncate mr-2">{mat.name}</span>
                                        </button>
                                    ))}
                                    {materials.filter(m => m.technology?.toLowerCase() === selectedTech.toLowerCase()).length === 0 && (
                                        <div className="col-span-4 p-3 text-xs text-slate-400 bg-slate-50 rounded-md border text-center">
                                            ไม่มีฟิลเตอร์วัสดุสำหรับเทคโนโลยีนี้
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Color & Qty */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">สี</label>
                                    <select 
                                        value={color}
                                        onChange={(e) => { setColor(e.target.value); patchQuote({ color: e.target.value }); }}
                                        className="w-full px-4 py-2 rounded-md text-sm border border-slate-200 text-slate-800 bg-white font-semibold shadow-sm focus:border-blue-500 outline-none"
                                    >
                                        {materials.find(m => m._id === selectedMaterial)?.colors?.map((c: string) => (
                                            <option key={c} value={c}>{c}</option>
                                        )) || <option value={color || "ขาวด้าน (Matte White)"}>{color || "ขาวด้าน (Matte White)"}</option>}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">จำนวน</label>
                                    <div className="flex items-center border rounded-md overflow-hidden max-w-[120px] bg-white shadow-sm">
                                        <button onClick={() => handleQtyChange(Math.max(1, qty - 1))} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border-r font-bold">-</button>
                                        <input
                                            type="number"
                                            value={qty}
                                            onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
                                            className="w-full text-center text-sm focus:outline-none"
                                        />
                                        <button onClick={() => handleQtyChange(qty + 1)} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border-l font-bold">+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Bar */}
                            <div className="pt-4 border-t flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-bold uppercase">ราคาต่อชิ้น</span>
                                    <span className="text-lg font-bold text-orange-600">฿{quote.priceDetail?.pricePerUnit?.toLocaleString() || "0"}</span>
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-bold"
                                >
                                    <Trash2 className="w-4 h-4" /> ลบทิ้ง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main QuoteForm ──────────────────────────────────────────────────────────
export function QuoteForm({ quotes, onAdd, onUpdate, onRemove }: QuoteFormProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "analyzing" | "done">("idle");
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    // Keep track of raw files per quoteId for instant 3D preview
    const [rawFiles, setRawFiles] = useState<Record<string, File>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dbMaterials, setDbMaterials] = useState<any[]>([]);

    useEffect(() => {
        // Fetch materials
        fetch("/api/admin/materials")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDbMaterials(data.filter((m: any) => m.isActive !== false)); // Default to true if not specified
                } else if (data.success && data.materials) {
                    setDbMaterials(data.materials.filter((m: any) => m.isActive !== false));
                }
            })
            .catch(err => console.error("Failed to load materials", err));
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus("uploading");
        setProgress(0);
        setCurrentFile(file.name);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/quote/upload", formData, {
                onUploadProgress: (progressEvent) => {
                    const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setProgress(pct);
                    if (pct === 100) setUploadStatus("analyzing");
                },
            });

            if (response.data.success) {
                const newQuote = response.data.data;
                onAdd(newQuote);
                setRawFiles(prev => ({ ...prev, [newQuote._id]: file }));
                setUploadStatus("done");
                setTimeout(() => {
                    setUploadStatus("idle");
                    setUploading(false);
                    setCurrentFile(null);
                }, 1000);
            }
        } catch (error: any) {
            console.error("Upload failed:", error.response?.data || error.message);
            setUploadStatus("idle");
            setUploading(false);
            setCurrentFile(null);
            const msg = error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
            alert(`อัปโหลดล้มเหลว: ${msg}`);
        }

        // Reset input so same file can be re-uploaded
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900">คำนวณราคาพิมพ์ 3 มิติออนไลน์</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <button className="hover:text-blue-600 transition-colors">คู่มือการพิมพ์ 3D &gt;</button>
                    <button className="hover:text-blue-600 transition-colors">ประวัติการอัปโหลด <ChevronDown className="inline w-4 h-4" /></button>
                </div>
            </div>

            {/* Upload Area */}
            <div className="bg-blue-50/30 border-2 border-dashed border-blue-200 rounded-xl p-12 text-center relative">
                <input
                    ref={fileInputRef}
                    type="file"
                    id="file-upload"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    accept=".stl,.3mf,.obj,.step,.stp"
                />
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 h-12 pointer-events-none" disabled={uploading}>
                    <Upload className="w-5 h-5 mr-2" /> {uploading ? "กำลังวิเคราะห์..." : "เพิ่มไฟล์ 3D"}
                </Button>
                <p className="mt-4 text-xs text-slate-500">
                    ไฟล์ที่รองรับ: STL, STP, STEP, OBJ, 3MF. ความหนาผนัง &ge; 1.2mm, ส่วนที่บางที่สุด &ge; 0.8mm.
                    <span className="text-blue-600 cursor-pointer ml-1">คำแนะนำการอัปโหลด</span>
                </p>
                <p className="mt-2 text-xs text-slate-400 flex items-center justify-center">
                    <Info className="w-3 h-3 mr-1" /> การอัปโหลดทั้งหมดมีความปลอดภัยและเป็นความลับ
                </p>
            </div>

            {/* Warning */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-start gap-3 text-xs text-slate-600">
                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p>
                    การอัปโหลดอาวุธหรือชิ้นส่วนที่ขัดต่อ
                    <span className="text-blue-600 cursor-pointer mx-1 underline">เงื่อนไขการใช้งาน</span>
                    จะทำให้บัญชีถูกระงับการใช้งานทันที
                </p>
            </div>

            {/* Upload Progress */}
            {(uploading || uploadStatus !== "idle") && (
                <div className="bg-white border rounded-lg p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Layers className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 truncate max-w-[300px]">{currentFile}</p>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase",
                                        uploadStatus === "uploading" ? "text-blue-600" :
                                            uploadStatus === "analyzing" ? "text-orange-500" : "text-green-600"
                                    )}>
                                        {uploadStatus === "uploading" ? "กำลังอัปโหลด..." :
                                            uploadStatus === "analyzing" ? "กำลังวิเคราะห์ไฟล์..." : "เสร็จสมบูรณ์"}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">{progress}%</span>
                                </div>
                            </div>
                        </div>
                        {uploadStatus === "done" && (
                            <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
                        )}
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-300 ease-out rounded-full",
                                uploadStatus === "uploading" ? "bg-blue-600" :
                                    uploadStatus === "analyzing" ? "bg-orange-500 animate-pulse" : "bg-green-500"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Quote Cards */}
            {quotes.map((q) => (
                <QuoteCard
                    key={q._id}
                    quote={q}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    rawFile={rawFiles[q._id]}
                    materials={dbMaterials}
                />
            ))}

            {/* Add More File Button (shows after first upload) */}
            {quotes.length > 0 && !uploading && (
                <div className="relative">
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={handleFileUpload}
                        accept=".stl,.3mf,.obj,.step,.stp"
                    />
                    <button className="w-full border-2 border-dashed border-slate-200 rounded-xl py-4 text-sm font-bold text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> เพิ่มไฟล์ 3D อีกชิ้น
                    </button>
                </div>
            )}
        </div>
    );
}
