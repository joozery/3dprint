"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Upload, Info, Trash2, ChevronDown, CheckCircle2, AlertCircle, Layers, Plus, Lock, History, User, ShoppingCart, ChevronRight, RotateCcw, ZoomIn, ZoomOut, Move, Check, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Viewer3D } from "./Viewer3D";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface QuoteAppProps {
    quotes: any[];
    onAdd: (q: any) => void;
    onUpdate: (q: any) => void;
    onRemove: (id: string) => void;
}

export function QuoteApp({ quotes, onAdd, onUpdate, onRemove }: QuoteAppProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { t } = useLanguage();
    const [activeId, setActiveId] = useState<string | null>(quotes.length > 0 ? quotes[0]._id : null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState("");
    const [rawFiles, setRawFiles] = useState<Record<string, File>>({});
    const [dbMaterials, setDbMaterials] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState("shaded");
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);
    const [userAddresses, setUserAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const viewerRef = useRef<any>(null);

    const activeQuote = quotes.find(q => q._id === activeId);

    // Sync activeId when quotes list changes
    useEffect(() => {
        if (quotes.length > 0 && !activeId) {
            setActiveId(quotes[0]._id);
        }
    }, [quotes, activeId]);

    // Load materials and user addresses
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Materials
                const matRes = await fetch('/api/admin/materials');
                const matData = await matRes.json();
                if (Array.isArray(matData)) setDbMaterials(matData.filter((m: any) => m.isActive !== false));
                else if (matData.success && matData.materials) setDbMaterials(matData.materials.filter((m: any) => m.isActive !== false));

                // Fetch User Addresses if logged in
                if (session) {
                    const profileRes = await fetch('/api/profile/billing');
                    const profileData = await profileRes.json();
                    if (profileData.user?.shippingAddresses) {
                        const addrs = profileData.user.shippingAddresses;
                        setUserAddresses(addrs);
                        const def = addrs.find((a: any) => a.isDefault);
                        if (def) setSelectedAddressId(def._id);
                        else if (addrs.length > 0) setSelectedAddressId(addrs[0]._id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, [session]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setCurrentFile(file.name);
            setProgress(0);

            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await axios.post("/api/quote/upload", formData, {
                    onUploadProgress: (progressEvent) => {
                        const p = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                        setProgress(p);
                    }
                });

                if (res.data.success) {
                    const newQuote = res.data.data;
                    onAdd(newQuote);
                    setRawFiles(prev => ({ ...prev, [newQuote._id]: file }));
                    setActiveId(newQuote._id);
                }
            } catch (err: any) {
                console.error("Upload failed", err);
                alert(err.response?.data?.message || t.quote.uploadError);
            }
        }
        setUploading(false);
        setCurrentFile("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const deleteQuote = (id: string) => {
        onRemove(id);
        if (activeId === id) {
            const remaining = quotes.filter(q => q._id !== id);
            setActiveId(remaining.length > 0 ? remaining[0]._id : null);
        }
    };

    const patchQuote = async (id: string, updates: any) => {
        try {
            // Update local state first for responsiveness
            const current = quotes.find(q => q._id === id);
            if (!current) return;
            const updated = { ...current, ...updates };
            
            // Recalculate price if material or technology or quantity changed
            if (updates.material || updates.technology || updates.quantity || updates.finish) {
                const mat = dbMaterials.find(m => m._id === (updates.material || current.material));
                if (mat) {
                    const qty = updates.quantity || current.quantity || 1;
                    const vol = current.volumeCm3 || 10;
                    const pricePerCm3 = mat.pricePerGram || 1; // Backend uses pricePerGram as pricePerCm3 logic
                    const basePrice = vol * pricePerCm3;
                    const finishPrice = (updates.finish === 'sanded' || (current.finish === 'sanded' && !updates.finish)) ? 80 : 0;
                    const total = (basePrice + finishPrice) * qty;
                    
                    updated.priceDetail = {
                        totalPrice: total,
                        pricePerUnit: basePrice + finishPrice,
                        materialPrice: basePrice
                    };
                }
            }
            
            onUpdate(updated);

            // Persist to server
            await axios.patch(`/api/quote/${id}`, updates);
        } catch (err) {
            console.error("Failed to update quote", err);
        }
    };

    const handlePlaceOrder = async () => {
        if (!isTermsAccepted) return;
        if (quotes.length === 0) {
            alert(t.quote.dropOrSelect);
            return;
        }
        
        const ids = quotes.map(q => q._id).join(',');
        router.push(`/quote/request?ids=${ids}`);
    };

    const handleGetQuotation = () => {
        alert("กำลังสร้างใบเสนอราคา PDF...");
    };

    const handleSaveToCart = () => {
        alert("บันทึกลงตะกร้าเรียบร้อยแล้ว!");
    };

    const getModelColor = (tech: string, matId: string) => {
        if (activeQuote?.color) return activeQuote.color;
        const mat = dbMaterials.find(m => m._id === matId);
        if (mat && mat.colors && mat.colors.length > 0) return mat.colors[0];
        if (tech.toLowerCase() === 'sla') return '#94a3b8';
        return '#3b82f6';
    };

    const technologies = [
        { id: 'fdm', name: 'FDM' },
        { id: 'sla', name: 'SLA' },
        { id: 'mjf', name: 'MJF' },
        { id: 'sls', name: 'SLS' },
        { id: 'slm', name: 'SLM' },
    ];

    const totalPrice = quotes.reduce((sum, q) => sum + (q.priceDetail?.totalPrice || 0), 0);
    const vat = totalPrice * 0.07;

    const deliveryConfig: Record<string, { label: string; days: string; price: number }> = {
        economy:  { label: t.quote.deliveryEconomy,  days: t.quote.deliveryDays710, price: 60 },
        standard: { label: t.quote.deliveryStandard, days: t.quote.deliveryDays45,  price: 85 },
        express:  { label: t.quote.deliveryExpress,  days: t.quote.deliveryDays2,   price: 285 },
    };
    const currentDelivery = deliveryConfig[activeQuote?.deliverySpeed || 'standard'];
    const deliveryCost = currentDelivery.price;

    const finalPrice = totalPrice + vat + deliveryCost;

    const brandPrimary = "#2563eb";
    const brandPrimaryDeep = "#1d4ed8";
    const bgMain = "oklch(0.985 0.004 310)";
    const bgSidebar = "oklch(0.97 0.006 310)";
    const lineBorder = "oklch(0.88 0.012 310)";

    return (
        <div className="h-full w-full flex flex-col text-slate-900 font-sans overflow-hidden" style={{ fontFamily: 'Sarabun, sans-serif', backgroundColor: bgMain }}>

            {/* 3. MAIN GRID */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px_280px] xl:grid-cols-[280px_1fr_340px_300px] overflow-hidden">
                
                {/* 3.1 SIDEBAR: Files */}
                <aside className="flex flex-col overflow-hidden" style={{ backgroundColor: bgSidebar, borderRight: `1px solid ${lineBorder}` }}>
                    <div className="p-4 bg-white" style={{ borderBottom: `1px solid ${lineBorder}` }}>
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{t.quote.filesLabel} · {quotes.length}</div>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-2 py-1 text-[10px] bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-bold transition-all">
                                <Plus className="w-3 h-3" /> {t.quote.addFile}
                            </button>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept=".stl,.3mf,.obj,.step,.stp" />
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="w-full py-8 px-3 border-[1.5px] border-dashed border-slate-200 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 text-slate-400 transition-all hover:border-slate-300">
                            <Upload className="w-7 h-7 opacity-20" />
                            <div className="text-[11px] font-bold text-slate-600">{t.quote.dropOrSelect}</div>
                            <div className="text-[9px] font-mono tracking-wide opacity-50 uppercase">{t.quote.fileFormats}</div>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
                        {quotes.map(q => (
                            <div key={q._id} onClick={() => setActiveId(q._id)} className={cn("flex items-center gap-3 p-3 cursor-pointer rounded-xl border transition-all group relative", activeId === q._id ? "bg-white border-slate-200 shadow-lg shadow-slate-100 ring-1 ring-slate-100" : "border-transparent hover:bg-slate-50")}>
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all", activeId === q._id ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-300")}>
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={cn("text-[13px] font-black truncate", activeId === q._id ? "text-slate-900" : "text-slate-500")}>{q.originalName}</div>
                                    <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1.5 font-bold uppercase">
                                        <span className={cn("w-1.5 h-1.5 rounded-full", activeId === q._id ? "bg-green-500" : "bg-slate-200")}></span>
                                        {q.volumeCm3?.toFixed(1) || "-"} cm³ · ×{q.quantity || 1}
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); deleteQuote(q._id); }} className="p-1.5 text-slate-200 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-tighter" style={{ borderTop: `1px solid ${lineBorder}` }}>
                        <Lock className="w-3.5 h-3.5" /> {t.quote.sslNote}
                    </div>
                </aside>

                {/* 3.2 VIEWER: Center */}
                <main className="flex flex-col overflow-hidden bg-white relative" style={{ borderRight: `1px solid ${lineBorder}` }}>
                    {activeQuote ? (
                        <>
                            <div className="p-2.5 px-4 flex items-center justify-between bg-white z-10 flex-wrap gap-2.5" style={{ borderBottom: `1px solid ${lineBorder}` }}>
                                <div className="flex items-center gap-2 min-w-0">
                                    <Layers className="w-3.5 h-3.5 opacity-40 shrink-0" />
                                    <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[200px] xl:max-w-[300px]">
                                        {activeQuote.originalName}
                                    </span>
                                    <span className="shrink-0 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-[3px] text-[10px] font-mono tracking-wide">
                                        {((activeQuote.volumeCm3 || 10) * 4).toFixed(1)} KB
                                    </span>
                                </div>
                                <div className="flex-1"></div>
                                <div className="flex rounded-md overflow-hidden shrink-0 border" style={{ borderColor: lineBorder }}>
                                    {['Shaded', 'Wireframe', 'ความหนาผนัง', 'ขนาด'].map((mode, index) => (
                                        <button 
                                            key={mode} 
                                            onClick={() => setViewMode(mode.toLowerCase())} 
                                            className={cn(
                                                "px-2.5 py-1.5 text-[11px] transition-colors whitespace-nowrap",
                                                viewMode === mode.toLowerCase() 
                                                    ? "bg-[#8848a8] text-white font-semibold" 
                                                    : "bg-transparent text-slate-700 font-medium hover:bg-slate-50",
                                                index !== 3 ? "border-r" : ""
                                            )}
                                            style={{ borderColor: index !== 3 ? lineBorder : 'transparent', textTransform: 'uppercase' }}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 relative bg-[#f8f9fa] overflow-hidden flex items-center justify-center">
                                {/* SVG Grid Background from HTML */}
                                <svg viewBox="-120 -120 240 240" width="100%" height="100%" className="absolute inset-0 pointer-events-none" style={{ display: 'block' }}>
                                    <defs>
                                        <pattern id="dotgrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                            <circle cx="5" cy="5" r="0.5" fill="rgba(30,36,51,0.15)"></circle>
                                        </pattern>
                                    </defs>
                                    <rect x="-120" y="-120" width="240" height="240" fill="url(#dotgrid)"></rect>
                                    <line x1="-120" y1="0" x2="120" y2="0" stroke="rgba(30,36,51,0.08)" strokeWidth="0.5"></line>
                                    <line x1="0" y1="-120" x2="0" y2="120" stroke="rgba(30,36,51,0.08)" strokeWidth="0.5"></line>
                                    <ellipse cx="0" cy="55" rx="55" ry="8" fill="rgba(30,36,51,0.12)"></ellipse>
                                </svg>
                                
                                <div className="w-full h-full z-10 relative">
                                    <Viewer3D 
                                        ref={viewerRef}
                                        key={activeQuote._id}
                                        file={rawFiles[activeQuote._id]} 
                                        fileUrl={activeQuote.fileUrl} 
                                        fileName={activeQuote.originalName} 
                                        color={getModelColor(activeQuote.technology || 'sla', activeQuote.material || '')}
                                        viewMode={viewMode}
                                    />
                                </div>
                                
                                {/* Viewer Overlays - Left Tool Buttons */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                                    <button 
                                        onClick={() => viewerRef.current?.resetView()}
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => viewerRef.current?.zoomIn()}
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <ZoomIn className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => viewerRef.current?.zoomOut()}
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <ZoomOut className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <Move className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Viewer Overlays - Right Tool Buttons */}
                                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-20">
                                    <div 
                                        onClick={() => viewerRef.current?.setView('ISO')}
                                        className="h-[30px] px-2 bg-white/90 border border-slate-200 rounded-[4px] text-slate-500 flex items-center justify-center text-[10px] font-mono tracking-widest cursor-pointer hover:bg-white"
                                    >
                                        ISO
                                    </div>
                                    <div className="flex gap-1">
                                        {['X', 'Y', 'Z'].map(axis => (
                                            <button 
                                                key={axis} 
                                                onClick={() => viewerRef.current?.setView(axis)}
                                                className="w-[28px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors font-mono text-[10px] font-bold cursor-pointer"
                                            >
                                                {axis}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Viewer Overlays - Bounding Box */}
                                <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded-[4px] p-2.5 px-3 z-20 flex flex-col gap-[3px] text-slate-800 font-mono text-[10px] tracking-[0.5px]">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">Bounding box</div>
                                    <div>X &nbsp; {activeQuote.dimensions?.x?.toFixed(1) || "0.0"} mm</div>
                                    <div>Y &nbsp; {activeQuote.dimensions?.y?.toFixed(1) || "0.0"} mm</div>
                                    <div>Z &nbsp; {activeQuote.dimensions?.z?.toFixed(1) || "0.0"} mm</div>
                                </div>

                                {/* Wall Thickness Legend - only when in thickness mode */}
                                {viewMode === 'ความหนาผนัง' && (
                                    <div className="absolute bottom-3 right-3 bg-white/95 border border-slate-200 rounded-[4px] p-2.5 px-3 z-20 text-[9px] font-mono">
                                        <div className="text-slate-400 uppercase tracking-widest mb-1.5">ความหนาผนัง</div>
                                        <div
                                            style={{
                                                width: 100,
                                                height: 8,
                                                borderRadius: 2,
                                                background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6)'
                                            }}
                                        />
                                        <div className="flex justify-between mt-1 text-slate-500">
                                            <span>&lt;0.8</span>
                                            <span>1.2</span>
                                            <span>&gt;2 mm</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white">
                            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6">
                                <Upload className="w-10 h-10 opacity-10 text-slate-900" />
                            </div>
                            <p className="text-xs font-black text-slate-300 tracking-[0.2em] uppercase">Ready to Print</p>
                        </div>
                    )}
                </main>

                {/* 3.3 CONFIG: Right 1 */}
                <aside className="border-l border-slate-200 overflow-y-auto bg-white flex flex-col no-scrollbar">
                    <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                        <div>
                            <div className="text-[11px] font-black tracking-widest uppercase text-slate-300">CONFIGURATION</div>
                            <div className="text-[14px] font-black mt-0.5">{t.quote.configTitle}</div>
                        </div>
                        <button className="text-[10px] font-black tracking-widest px-3 py-2 border border-slate-200 rounded-lg text-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all uppercase">{t.quote.copyToAll}</button>
                    </div>
                    {activeQuote ? (
                        <div className="p-6 pb-32 space-y-10">
                            {/* Process */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.processLabel}
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {technologies.map(tech => (
                                        <button key={tech.id} onClick={() => patchQuote(activeQuote._id, { technology: tech.id })} className={cn("py-2.5 text-[11px] font-black rounded-lg border transition-all uppercase tracking-tighter", (activeQuote.technology || 'sla') === tech.id ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300")}>{tech.id}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Material */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.materialLabel}
                                </div>
                                <div className="space-y-4">
                                    {dbMaterials.filter(m => m.technology?.toLowerCase() === (activeQuote.technology || 'sla').toLowerCase()).map(mat => (
                                        <div key={mat._id} className="space-y-4">
                                            <div onClick={() => patchQuote(activeQuote._id, { material: mat._id })} className={cn("w-full text-left p-5 rounded-[20px] border transition-all relative overflow-hidden group cursor-pointer", (activeQuote.material || '') === mat._id ? "bg-[#2563eb] text-white border-[#2563eb] shadow-md" : "bg-white border-slate-100 hover:border-slate-200 shadow-sm")}>
                                                <div className="flex justify-between items-start mb-2.5">
                                                    <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em]", (activeQuote.material || '') === mat._id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400")}>{(activeQuote.technology || 'sla')}</span>
                                                    <span className={cn("text-[13px] font-mono font-black", (activeQuote.material || '') === mat._id ? "text-white" : "text-slate-300")}>฿{(mat.pricePerGram || 1).toFixed(2)}/cm³</span>
                                                </div>
                                                <div className="text-[16px] font-black tracking-tight">{mat.name}</div>
                                                <div className={cn("text-[12px] mt-1.5 opacity-80 truncate font-medium leading-relaxed", (activeQuote.material || '') === mat._id ? "text-white" : "text-slate-400")}>{mat.description || 'คุณภาพระดับอุตสาหกรรม'}</div>
                                                
                                                {(activeQuote.material || '') === mat._id && (
                                                    <div className="flex gap-2 mt-5">
                                                        <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-[11px] font-black flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"><Info className="w-3.5 h-3.5" /> TDS</button>
                                                        <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-[11px] font-black flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"><Info className="w-3.5 h-3.5" /> SDS</button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Property Bars */}
                                            {(activeQuote.material || '') === mat._id && (
                                                <div className="p-5 bg-white border border-slate-100 rounded-[20px] space-y-3.5 shadow-xl shadow-slate-100/50">
                                                    {[
                                                        { label: 'ความแข็ง', level: 4 },
                                                        { label: 'ผิวงาน', level: 5 },
                                                        { label: 'ทนร้อน', level: 3 },
                                                    ].map(prop => (
                                                        <div key={prop.label} className="flex items-center justify-between gap-6">
                                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{prop.label}</span>
                                                            <div className="flex gap-1.5">
                                                                {[1,2,3,4,5].map(v => (
                                                                    <div key={v} className={cn("w-5 h-2 rounded-sm transition-all", v <= prop.level ? "bg-slate-900" : "bg-slate-100")}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.colorLabel}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {(dbMaterials.find(m => m._id === (activeQuote.material || ''))?.colors || ['White', 'Black', 'Grey', 'Blue', 'Green', 'Yellow', 'Red']).map((c: string) => (
                                        <button key={c} onClick={() => patchQuote(activeQuote._id, { color: c })} className={cn("w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center relative shadow-md", activeQuote.color === c ? "border-[#2563eb] ring-4 ring-blue-50" : "border-white outline outline-1 outline-slate-100")} style={{ backgroundColor: c.toLowerCase().includes('black') ? '#222' : c.toLowerCase().includes('grey') ? '#888' : c.toLowerCase().includes('blue') ? '#3b82f6' : c.toLowerCase().includes('green') ? '#22c55e' : c.toLowerCase().includes('yellow') ? '#fbbf24' : c.toLowerCase().includes('red') ? '#ef4444' : '#fff' }} title={c}>
                                            {activeQuote.color === c && <Check className={cn("w-5 h-5 drop-shadow-lg", c.toLowerCase().includes('white') ? "text-slate-900" : "text-white")} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Finish */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.finishLabel}
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { id: 'standard', label: t.quote.finishStandard, price: t.quote.finishStandardPrice, active: activeQuote.finish !== 'sanded' },
                                        { id: 'sanded', label: t.quote.finishSanded, price: '฿80', active: activeQuote.finish === 'sanded' },
                                        { id: 'primed', label: t.quote.finishPrimed, price: '฿150', active: false },
                                        { id: 'painted', label: t.quote.finishPainted, price: '฿250', active: false },
                                    ].map(f => (
                                        <button key={f.id} onClick={() => patchQuote(activeQuote._id, { finish: f.id })} className={cn("w-full flex justify-between items-center p-4 text-[13px] font-black rounded-xl border transition-all", f.active ? "bg-[#2563eb] text-white border-[#2563eb] shadow-lg shadow-blue-100" : "bg-white text-slate-700 border-slate-100 hover:border-slate-200")}>
                                            <span>{f.label}</span>
                                            <span className={cn("text-[11px] font-mono font-black uppercase tracking-tight", f.active ? "text-white/60" : "text-slate-300")}>{f.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section 5: Quantity & Delivery */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.qtyDeliveryLabel}
                                </div>

                                {/* Quantity Stepper */}
                                <div className="mb-5">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.quote.qtyLabel}</div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => patchQuote(activeQuote._id, { quantity: Math.max(1, (activeQuote.quantity || 1) - 1) })}
                                            className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 font-black text-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                                        >
                                            &minus;
                                        </button>
                                        <span className="text-[20px] font-black text-slate-900 w-8 text-center tabular-nums">
                                            {activeQuote.quantity || 1}
                                        </span>
                                        <button
                                            onClick={() => patchQuote(activeQuote._id, { quantity: (activeQuote.quantity || 1) + 1 })}
                                            className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 font-black text-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Delivery Speed */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'economy', label: t.quote.deliveryEconomy, days: t.quote.deliveryDays710, extra: '' },
                                        { id: 'standard', label: t.quote.deliveryStandard, days: t.quote.deliveryDays45, extra: '' },
                                        { id: 'express', label: t.quote.deliveryExpress, days: t.quote.deliveryDays2, extra: '+฿200' },
                                    ].map(d => (
                                        <button
                                            key={d.id}
                                            onClick={() => patchQuote(activeQuote._id, { deliverySpeed: d.id })}
                                            className={cn(
                                                "flex flex-col items-center py-3 px-2 rounded-xl border text-center transition-all",
                                                (activeQuote.deliverySpeed || 'standard') === d.id
                                                    ? "bg-[#2563eb] text-white border-[#2563eb] shadow-lg shadow-blue-100"
                                                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="text-[12px] font-black">{d.label}</span>
                                            <span className={cn("text-[10px] font-bold mt-0.5", (activeQuote.deliverySpeed || 'standard') === d.id ? "text-white/70" : "text-slate-400")}>{d.days}</span>
                                            {d.extra && <span className={cn("text-[9px] font-black mt-1 px-1.5 py-0.5 rounded-full", (activeQuote.deliverySpeed || 'standard') === d.id ? "bg-white/20 text-white" : "bg-orange-50 text-orange-500")}>{d.extra}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[11px] text-slate-200 font-black uppercase tracking-widest">Select Item</div>
                    )}
                </aside>

                {/* 3.4 PRICE: Right 2 */}
                <aside className="border-l border-slate-200 bg-[#fafafa] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="text-[10px] font-black tracking-widest uppercase text-slate-300">{t.quote.priceBreakdown}</div>
                        <div className="text-[12px] font-black mt-0.5">{t.quote.priceBreakdown}</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="p-3 space-y-3">
                            {quotes.map(q => (
                                <div key={q._id} className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 pr-2">
                                            <div className="text-[11px] font-black truncate text-slate-800">{q.originalName}</div>
                                            <div className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter leading-none">
                                                {q.technology} · {q.materialName || 'Nylon PA12'} · {q.color} · ×{q.quantity || 1}
                                            </div>
                                        </div>
                                        <div className="text-[12px] font-mono font-black text-slate-800">฿{q.priceDetail?.totalPrice?.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-300 mt-1">
                                        <span>฿{q.priceDetail?.pricePerUnit?.toLocaleString() || "0"}{t.quote.perPiece}</span>
                                        {q.finish === 'sanded' && <span className="text-[#2563eb]">+ {t.quote.finishSanded}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-4 space-y-1.5 font-mono text-[11px] font-black">
                            <div className="flex justify-between text-slate-700"><span>Subtotal</span><span>฿{totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <div className="flex justify-between text-slate-300 font-bold"><span>{t.quote.setupFee}</span><span>฿150.00</span></div>
                            <div className="flex justify-between text-[#2563eb]"><span>FIRST25 {t.quote.coupon}</span><span>-฿25.00</span></div>
                            <div className="flex justify-between text-slate-300 font-bold"><span>VAT 7%</span><span>฿{vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        </div>

                        <div className="p-3 mt-2">
                            <div className="text-[8px] font-black tracking-widest uppercase text-slate-300 mb-2">{t.quote.coupon}</div>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                                    <ShoppingCart className="w-3 h-3 text-[#2563eb] shrink-0" />
                                    <input type="text" value="FIRST25" readOnly className="flex-1 bg-transparent border-none outline-none text-[10px] font-black tracking-[0.2em] text-slate-700" />
                                    <span className="text-[7px] font-black text-[#2563eb] bg-purple-50 px-1 py-0.5 rounded uppercase">ACTIVE</span>
                                </div>
                                <button className="px-2 text-[9px] font-black text-slate-400 hover:text-red-500 uppercase transition-all">{t.quote.removeBtn}</button>
                            </div>
                        </div>

                        {/* Shipping Address Selection */}
                        <div className="p-3 border-t border-slate-100 bg-white relative">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 shrink-0 text-blue-600" />
                                <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{t.quote.shippingAddr}</div>
                            </div>

                            <div className="relative">
                                {userAddresses.length > 0 ? (
                                    <>
                                        <button 
                                            onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                                            className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[12px] font-black text-slate-700 hover:bg-slate-100 transition-all shadow-sm active:scale-[0.98]"
                                        >
                                            <div className="flex flex-col items-start gap-0.5 min-w-0">
                                                <span className="text-slate-900 font-black truncate w-full text-left">
                                                    {userAddresses.find(a => a._id === selectedAddressId)?.label || t.quote.selectAddr}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate w-full text-left">
                                                    {userAddresses.find(a => a._id === selectedAddressId)?.receiverName || session?.user?.name}
                                                </span>
                                            </div>
                                            <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-300 shrink-0 ml-2", showAddressDropdown && "rotate-180")} />
                                        </button>

                                        {showAddressDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-[60]" onClick={() => setShowAddressDropdown(false)}></div>
                                                <div className="absolute bottom-full left-0 right-0 mb-2 z-[70] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                    <div className="p-2 space-y-1 max-h-[250px] overflow-y-auto no-scrollbar">
                                                        {userAddresses.map((addr) => (
                                                            <button
                                                                key={addr._id}
                                                                onClick={() => {
                                                                    setSelectedAddressId(addr._id);
                                                                    setShowAddressDropdown(false);
                                                                    patchQuote(activeQuote?._id, { shipping: addr });
                                                                }}
                                                                className={cn(
                                                                    "w-full flex flex-col items-start p-3 rounded-xl transition-all",
                                                                    selectedAddressId === addr._id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"
                                                                )}
                                                            >
                                                                <div className="text-[12px] font-black flex items-center gap-2">
                                                                    {addr.label}
                                                                    {addr.isDefault && <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full uppercase">Default</span>}
                                                                </div>
                                                                <div className="text-[10px] font-bold opacity-60 mt-0.5 text-left line-clamp-1">
                                                                    {addr.address}, {addr.subDistrict}, {addr.district}, {addr.province} {addr.zipCode}
                                                                </div>
                                                            </button>
                                                        ))}
                                                        <button 
                                                            onClick={() => router.push('/profile/account')}
                                                            className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-blue-600 transition-all border-t border-slate-50 mt-1"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                            <span className="text-[11px] font-black">{t.quote.manageAddr}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => router.push('/profile/account')}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl px-3.5 py-4 text-[11px] font-black text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> {t.quote.addAddr}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Delivery Channels */}
                        <div className="p-3 border-t border-slate-100 bg-white relative">
                            <div className="flex items-center gap-2 mb-2">
                                <Truck className="w-4 h-4 shrink-0 text-blue-600" />
                                <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{t.quote.shippingChannel}</div>
                            </div>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
                                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[12px] font-black text-slate-700 hover:bg-slate-100 transition-all shadow-sm active:scale-[0.98]"
                                >
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-blue-600 font-black">Kerry Express</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                            {currentDelivery.label} ({currentDelivery.days})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-slate-900">฿{deliveryCost.toFixed(2)}</span>
                                        <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-300", showDeliveryDropdown && "rotate-180")} />
                                    </div>
                                </button>

                                {showDeliveryDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowDeliveryDropdown(false)}></div>
                                        <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                            <div className="p-2 space-y-1">
                                                {Object.entries(deliveryConfig).map(([key, config]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => {
                                                            patchQuote(activeQuote?._id, { deliverySpeed: key });
                                                            setShowDeliveryDropdown(false);
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                                                            activeQuote?.deliverySpeed === key ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"
                                                        )}
                                                    >
                                                        <div className="flex flex-col items-start">
                                                            <div className="text-[12px] font-black flex items-center gap-2">
                                                                {config.label}
                                                                {key === 'express' && <span className="text-[8px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full uppercase">Recommend</span>}
                                                            </div>
                                                            <div className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">จัดส่งใน {config.days} · Kerry</div>
                                                        </div>
                                                        <div className="text-[12px] font-mono font-black">฿{config.price.toFixed(2)}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Checkout Footer */}
                    <div className="shrink-0">
                        <div className="p-4 bg-[#1d4ed8] text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">TOTAL · {t.quote.total}</div>
                                <div className="text-[8px] font-black opacity-30 mt-0.5 tracking-widest uppercase">{t.quote.inclVat}</div>
                            </div>
                            <div className="text-[26px] font-mono font-black tracking-tighter relative z-10 leading-none">฿{finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                        </div>
                        <div className="p-3 bg-white border-t border-slate-100">
                            <div className="flex items-start gap-2 text-[10px] text-slate-400 mb-3 cursor-pointer group">
                                <input 
                                    id="terms-checkbox"
                                    type="checkbox" 
                                    checked={isTermsAccepted}
                                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                    className="mt-0.5 w-3 h-3 accent-[#2563eb] rounded border-slate-300 cursor-pointer" 
                                />
                                <label htmlFor="terms-checkbox" className="group-hover:text-slate-600 transition-colors leading-relaxed cursor-pointer">
                                    {t.quote.termsCheck} <span 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowTermsModal(true);
                                        }}
                                        className="text-slate-900 font-black underline decoration-slate-200 underline-offset-4 hover:decoration-[#2563eb]"
                                    >
                                        {t.quote.termsLink}
                                    </span>
                                </label>
                            </div>
                            <button 
                                onClick={handlePlaceOrder}
                                disabled={!isTermsAccepted}
                                className={cn(
                                    "w-full py-2.5 rounded-xl font-black text-[11px] transition-all tracking-[0.2em] uppercase mb-3 shadow-sm",
                                    isTermsAccepted ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.98]" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                {t.quote.placeOrder} · Place order
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={handleGetQuotation} className="py-2 text-[10px] font-black border border-slate-100 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-400 transition-all uppercase tracking-widest shadow-sm"><Info className="w-3.5 h-3.5 opacity-50" /> {t.quote.quotation}</button>
                                <button onClick={handleSaveToCart} className="py-2 text-[10px] font-black border border-slate-100 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-400 transition-all uppercase tracking-widest shadow-sm"><ShoppingCart className="w-3.5 h-3.5 opacity-50" /> {t.quote.saveCart}</button>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>

            {/* Terms of Use Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTermsModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{t.quote.termsTitle}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.quote.termsSub}</p>
                            </div>
                            <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><Plus className="w-6 h-6 rotate-45" /></button>
                        </div>
                        <div className="p-8 overflow-y-auto text-slate-600 text-[13px] leading-relaxed space-y-6">
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS1Title}</h4>
                                <p>{t.quote.termsS1Body}</p>
                            </section>
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS2Title}</h4>
                                <p>{t.quote.termsS2Body}</p>
                            </section>
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS3Title}</h4>
                                <p>{t.quote.termsS3Body}</p>
                            </section>
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS4Title}</h4>
                                <p>{t.quote.termsS4Body}</p>
                            </section>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                                onClick={() => setShowTermsModal(false)}
                                className="flex-1 py-3 px-6 rounded-xl font-black text-[12px] text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                            >
                                {t.quote.cancelBtn}
                            </button>
                            <button 
                                onClick={() => {
                                    setIsTermsAccepted(true);
                                    setShowTermsModal(false);
                                }}
                                className="flex-[2] py-3 px-6 bg-[#2563eb] text-white rounded-xl font-black text-[12px] hover:bg-[#1d4ed8] shadow-lg shadow-blue-200 transition-all uppercase tracking-widest"
                            >
                                {t.quote.acceptBtn}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
