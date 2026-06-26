"use client";

import { useState, useEffect } from "react";
import { Globe, Package, Printer, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Zap } from "lucide-react";

const COUNTRY_PRESETS = [
    { code: "US", name: "สหรัฐอเมริกา" },
    { code: "GB", name: "สหราชอาณาจักร" },
    { code: "JP", name: "ญี่ปุ่น" },
    { code: "SG", name: "สิงคโปร์" },
    { code: "AU", name: "ออสเตรเลีย" },
    { code: "DE", name: "เยอรมนี" },
    { code: "FR", name: "ฝรั่งเศส" },
    { code: "CN", name: "จีน" },
    { code: "KR", name: "เกาหลีใต้" },
    { code: "MY", name: "มาเลเซีย" },
];

interface Props {
    orderId: string;
    quotesData: {
        weightGrams: number;
        dimensions:  { x: number; y: number; z: number };
    }[];
    shippingAddress?: {
        countryCode?: string;
        city?:        string;
        zipCode?:     string;
    };
    existing: {
        trackingNumber?:  string;
        shippingProvider?: string;
        dhlProductCode?:  string;
        dhlLabelBase64?:  string;
    };
}

export default function DHLPanel({ orderId, quotesData, shippingAddress, existing }: Props) {
    const alreadyDHL     = existing.shippingProvider === "dhl" && !!existing.trackingNumber;
    const customerPicked = !!existing.dhlProductCode; // ลูกค้าเลือก service มาแล้ว

    const [dstCountry, setDstCountry] = useState(shippingAddress?.countryCode || "US");
    const [dstCity,    setDstCity]    = useState(shippingAddress?.city        || "");
    const [dstZip,     setDstZip]     = useState(shippingAddress?.zipCode     || "");

    // สำหรับ manual mode (ลูกค้าไม่ได้เลือก service)
    const [rates,         setRates]         = useState<any[]>([]);
    const [loadingRates,  setLoadingRates]  = useState(false);
    const [ratesFetched,  setRatesFetched]  = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(existing.dhlProductCode || "");

    const [creating, setCreating] = useState(false);
    const [result,   setResult]   = useState<{ trackingNumber: string; labelBase64: string; productCode: string } | null>(
        alreadyDHL
            ? { trackingNumber: existing.trackingNumber!, labelBase64: existing.dhlLabelBase64 || "", productCode: existing.dhlProductCode || "" }
            : null
    );
    const [error, setError] = useState("");

    const totalWeightG = quotesData.reduce((s, q) => s + (q.weightGrams || 0), 0);
    const maxW  = Math.max(...quotesData.map(q => q.dimensions?.x || 10));
    const maxL  = Math.max(...quotesData.map(q => q.dimensions?.y || 10));
    const maxH  = quotesData.reduce((s, q) => s + (q.dimensions?.z || 5), 0);

    const fetchRates = async () => {
        if (!dstCountry) return;
        setLoadingRates(true);
        setError("");
        setRates([]);
        setSelectedProduct("");
        try {
            const res = await fetch("/api/dhl/rates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dst_zipcode:  dstZip,
                    dst_city:     dstCity,
                    dst_country:  dstCountry,
                    weightKg:     Math.max(totalWeightG / 1000, 0.1),
                    width:        Math.ceil(maxW),
                    length:       Math.ceil(maxL),
                    height:       Math.ceil(maxH),
                }),
            });
            const data = await res.json();
            if (data.rates) setRates(data.rates);
            else setError(data.error || "ไม่พบราคา DHL");
        } catch {
            setError("ระบบขัดข้อง กรุณาลองใหม่");
        } finally {
            setLoadingRates(false);
            setRatesFetched(true);
        }
    };

    // Auto-fetch rates เฉพาะ manual mode (ลูกค้าไม่ได้เลือก service)
    useEffect(() => {
        if (!alreadyDHL && !customerPicked && shippingAddress?.countryCode) {
            fetchRates();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async () => {
        const productCode = customerPicked ? existing.dhlProductCode! : selectedProduct;
        if (!productCode)  { setError("กรุณาเลือกบริการ DHL ก่อน"); return; }
        if (!dstCountry)   { setError("กรุณาระบุประเทศปลายทาง"); return; }
        setCreating(true);
        setError("");
        try {
            const res = await fetch("/api/dhl/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, productCode, dst_country: dstCountry, dst_city: dstCity }),
            });
            const data = await res.json();
            if (data.success) {
                setResult({ trackingNumber: data.trackingNumber, labelBase64: data.labelBase64 || "", productCode: data.productCode });
            } else {
                setError(data.error || "สร้างพัสดุ DHL ไม่สำเร็จ");
            }
        } catch {
            setError("ระบบขัดข้อง กรุณาลองใหม่");
        } finally {
            setCreating(false);
        }
    };

    const downloadLabel = () => {
        if (!result?.labelBase64) return;
        const byteStr = atob(result.labelBase64);
        const ab = new ArrayBuffer(byteStr.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
        const blob = new Blob([ab], { type: "application/pdf" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url;
        a.download = `dhl-label-${result.trackingNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
                <Globe size={18} className="text-yellow-500" /> จัดส่งพัสดุ (DHL Express ต่างประเทศ)
            </h3>

            {/* Package summary */}
            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs text-slate-500 flex gap-4 flex-wrap">
                <span>น้ำหนัก: <b className="text-slate-700">{totalWeightG >= 1000 ? `${(totalWeightG/1000).toFixed(2)} kg` : `${totalWeightG.toFixed(0)} g`}</b></span>
                <span>ขนาด: <b className="text-slate-700">{Math.ceil(maxW)} × {Math.ceil(maxL)} × {Math.ceil(maxH)} cm</b></span>
            </div>

            {/* ─── ส่งแล้ว: แสดง tracking + label ─── */}
            {result ? (
                <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-yellow-700 uppercase tracking-widest mb-1">สร้างพัสดุ DHL Express สำเร็จ</p>
                            <p className="text-sm font-bold text-slate-800">
                                Tracking: <span className="font-black text-yellow-700 select-all">{result.trackingNumber || "-"}</span>
                            </p>
                            {result.productCode && (
                                <p className="text-xs text-slate-500 mt-0.5">Service: {result.productCode}</p>
                            )}
                        </div>
                    </div>

                    {result.labelBase64 ? (
                        <button
                            onClick={downloadLabel}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            <Printer size={14} /> ดาวน์โหลด label DHL (PDF)
                        </button>
                    ) : (
                        <a
                            href={`https://mydhl.express.dhl/th/en/shipment-tracking.html#/results?id=${result.trackingNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-200"
                        >
                            <Printer size={14} /> พิมพ์ Label บน MyDHL+
                        </a>
                    )}

                    <a
                        href={`https://www.dhl.com/th-th/home/tracking.html?tracking-id=${result.trackingNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-yellow-600 hover:underline justify-center"
                    >
                        <ExternalLink size={12} /> ติดตามพัสดุบน DHL.com
                    </a>
                </div>

            ) : customerPicked ? (
                /* ─── ลูกค้าเลือก service มาแล้ว: fast-create mode ─── */
                <div className="space-y-4">
                    {/* แสดง service ที่ลูกค้าเลือก */}
                    <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                        <Zap size={16} className="text-yellow-500 shrink-0" />
                        <div className="flex-1">
                            <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest">บริการที่ลูกค้าเลือก</p>
                            <p className="text-sm font-black text-slate-800 mt-0.5">DHL Express — {existing.dhlProductCode}</p>
                        </div>
                    </div>

                    {/* Address fields (แก้ได้ถ้าจำเป็น) */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ปลายทาง</p>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-400 font-semibold block mb-1">ประเทศ (ISO)</label>
                                <input
                                    type="text"
                                    maxLength={2}
                                    value={dstCountry}
                                    onChange={e => setDstCountry(e.target.value.toUpperCase())}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 uppercase font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 font-semibold block mb-1">เมือง</label>
                                <input
                                    type="text"
                                    value={dstCity}
                                    onChange={e => setDstCity(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 font-semibold block mb-1">รหัสไปรษณีย์</label>
                                <input
                                    type="text"
                                    value={dstZip}
                                    onChange={e => setDstZip(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                            <AlertCircle size={14} className="shrink-0" /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleCreate}
                        disabled={creating || !dstCountry}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {creating
                            ? <><RefreshCw size={14} className="animate-spin" /> กำลังสร้างพัสดุ DHL...</>
                            : <><Package size={14} /> สร้างพัสดุ DHL Express — {existing.dhlProductCode}</>}
                    </button>
                </div>

            ) : (
                /* ─── Manual mode: admin เลือก service เอง ─── */
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ปลายทาง</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-400 font-semibold block mb-1">ประเทศ *</label>
                                <select
                                    value={dstCountry}
                                    onChange={e => { setDstCountry(e.target.value); setRatesFetched(false); setRates([]); }}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 bg-white"
                                >
                                    {COUNTRY_PRESETS.map(c => (
                                        <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                                    ))}
                                    <option value="">-- ระบุเอง --</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 font-semibold block mb-1">รหัสประเทศ (ISO)</label>
                                <input
                                    type="text"
                                    maxLength={2}
                                    placeholder="เช่น US, JP, SG"
                                    value={dstCountry}
                                    onChange={e => { setDstCountry(e.target.value.toUpperCase()); setRatesFetched(false); setRates([]); }}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 uppercase"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-400 font-semibold block mb-1">เมือง (City)</label>
                                <input
                                    type="text"
                                    placeholder="เช่น New York, Tokyo"
                                    value={dstCity}
                                    onChange={e => setDstCity(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 font-semibold block mb-1">รหัสไปรษณีย์</label>
                                <input
                                    type="text"
                                    placeholder="เช่น 10001, 100-0001"
                                    value={dstZip}
                                    onChange={e => setDstZip(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                        </div>

                        <button
                            onClick={fetchRates}
                            disabled={loadingRates || !dstCountry}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-bold rounded-xl transition-colors disabled:opacity-50 border border-yellow-200"
                        >
                            {loadingRates
                                ? <><RefreshCw size={13} className="animate-spin" /> กำลังโหลดราคา...</>
                                : <><RefreshCw size={13} /> ตรวจสอบราคา DHL</>}
                        </button>
                    </div>

                    {ratesFetched && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">เลือกบริการ DHL</p>
                            {rates.length > 0 ? (
                                rates.map(r => (
                                    <button
                                        key={r.productCode}
                                        onClick={() => setSelectedProduct(r.productCode)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                                            selectedProduct === r.productCode
                                                ? "border-yellow-400 bg-yellow-50"
                                                : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                            selectedProduct === r.productCode ? "border-yellow-500" : "border-slate-300"
                                        }`}>
                                            {selectedProduct === r.productCode && (
                                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800">{r.productName}</p>
                                            <p className="text-[10px] text-slate-400">{r.estimatedDays}</p>
                                        </div>
                                        <p className="text-sm font-black text-slate-800 shrink-0">
                                            {r.currency} {Number(r.totalPrice).toLocaleString()}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic text-center py-2">ไม่พบราคา — ตรวจสอบประเทศ/เมืองอีกครั้ง</p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                            <AlertCircle size={14} className="shrink-0" /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleCreate}
                        disabled={creating || !selectedProduct || !dstCountry}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {creating
                            ? <><RefreshCw size={14} className="animate-spin" /> กำลังสร้างพัสดุ DHL...</>
                            : <><Package size={14} /> สร้างพัสดุ DHL Express</>}
                    </button>
                </div>
            )}
        </div>
    );
}
