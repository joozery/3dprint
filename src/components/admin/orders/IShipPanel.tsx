"use client";

import { useState, useEffect } from "react";
import { Truck, Package, Printer, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

interface Props {
    orderId: string;
    shippingAddress: {
        zipCode:     string;
        province:    string;
        district?:   string;
        subDistrict?: string;
    };
    quotesData: {
        weightGrams: number;
        dimensions:  { x: number; y: number; z: number };
    }[];
    existing: {
        trackingNumber?:   string;
        ishipOrderId?:     string;
        ishipCourierCode?: string;
    };
}

export default function IShipPanel({ orderId, shippingAddress, quotesData, existing }: Props) {
    const [rates, setRates]           = useState<any[]>([]);
    const [loadingRates, setLoadingRates] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(existing.ishipCourierCode || "");
    const [creating, setCreating]     = useState(false);
    const [rawResponse, setRawResponse] = useState<any>(null);
    const [result, setResult]         = useState<{ trackingNumber: string; ishipOrderId: string } | null>(
        existing.trackingNumber && existing.ishipOrderId
            ? { trackingNumber: existing.trackingNumber, ishipOrderId: existing.ishipOrderId }
            : null
    );
    const [error, setError]           = useState("");
    const [labelUrl, setLabelUrl]     = useState("");
    const [loadingLabel, setLoadingLabel] = useState(false);

    const alreadyCreated = !!result?.ishipOrderId;

    // คำนวณ package stats
    const totalWeightG = quotesData.reduce((s, q) => s + (q.weightGrams || 0), 0);
    const maxW  = Math.max(...quotesData.map(q => q.dimensions?.x || 10));
    const maxL  = Math.max(...quotesData.map(q => q.dimensions?.y || 10));
    const maxH  = quotesData.reduce((s, q) => s + (q.dimensions?.z || 5), 0);

    useEffect(() => {
        if (alreadyCreated || !shippingAddress?.zipCode) return;
        setLoadingRates(true);
        fetch("/api/shipping/rates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dst_zipcode:  shippingAddress.zipCode,
                dst_province: shippingAddress.province    || "",
                dst_amphure:  shippingAddress.district    || "",
                dst_district: shippingAddress.subDistrict || "",
                weightKg:  Math.max(totalWeightG / 1000, 0.1),
                width:     Math.ceil(maxW),
                length:    Math.ceil(maxL),
                height:    Math.ceil(maxH),
            }),
        })
            .then(r => r.json())
            .then(d => { if (d.rates) setRates(d.rates); })
            .catch(() => {})
            .finally(() => setLoadingRates(false));
    }, []);

    const handleCreate = async () => {
        if (!selectedCourier) { setError("กรุณาเลือกบริษัทขนส่งก่อน"); return; }
        setCreating(true);
        setError("");
        try {
            const res = await fetch("/api/shipping/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, courier_code: selectedCourier }),
            });
            const data = await res.json();
            setRawResponse(data.raw || data);
            if (data.success) {
                setResult({ trackingNumber: data.trackingNumber, ishipOrderId: data.ishipOrderId });
            } else {
                setError(data.error || "สร้างพัสดุไม่สำเร็จ");
            }
        } catch {
            setError("ระบบขัดข้อง กรุณาลองใหม่");
        } finally {
            setCreating(false);
        }
    };

    const handlePrintLabel = async () => {
        if (!result?.ishipOrderId) return;
        setLoadingLabel(true);
        try {
            const res = await fetch(`/api/shipping/label?order_id=${result.ishipOrderId}`);
            const data = await res.json();
            const url = data.data?.label_url || data.data?.url || data.data?.pdf_url || data.data?.link;
            if (url) {
                setLabelUrl(url);
                window.open(url, "_blank");
            } else {
                setError("ไม่พบ URL ของ label: " + JSON.stringify(data.data));
            }
        } catch {
            setError("ดึง label ไม่สำเร็จ");
        } finally {
            setLoadingLabel(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
                <Truck size={18} className="text-blue-500" /> จัดส่งพัสดุ (iShip)
            </h3>

            {/* Package summary */}
            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs text-slate-500 flex gap-4 flex-wrap">
                <span>น้ำหนัก: <b className="text-slate-700">{totalWeightG >= 1000 ? `${(totalWeightG/1000).toFixed(2)} kg` : `${totalWeightG.toFixed(0)} g`}</b></span>
                <span>ขนาด: <b className="text-slate-700">{Math.ceil(maxW)} × {Math.ceil(maxL)} × {Math.ceil(maxH)} cm</b></span>
                <span>ปลายทาง: <b className="text-slate-700">{shippingAddress.zipCode} {shippingAddress.province}</b></span>
            </div>

            {/* Already created */}
            {alreadyCreated ? (
                <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">สร้างพัสดุสำเร็จ</p>
                            <p className="text-sm font-bold text-slate-800">Tracking: <span className="font-black">{result!.trackingNumber || "-"}</span></p>
                            <p className="text-xs text-slate-500 mt-0.5">iShip ID: {result!.ishipOrderId}</p>
                            {existing.ishipCourierCode && (
                                <p className="text-xs text-slate-500">Courier: {existing.ishipCourierCode}</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handlePrintLabel}
                        disabled={loadingLabel}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loadingLabel
                            ? <><RefreshCw size={14} className="animate-spin" /> กำลังโหลด label...</>
                            : <><Printer size={14} /> พิมพ์ label</>}
                    </button>

                    {labelUrl && (
                        <a href={labelUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-500 hover:underline justify-center">
                            <ExternalLink size={12} /> เปิด label URL อีกครั้ง
                        </a>
                    )}

                    {/* Debug: raw response จาก iShip */}
                    {rawResponse && (
                        <details className="mt-2">
                            <summary className="text-[10px] text-slate-400 cursor-pointer hover:text-slate-600">iShip raw response (debug)</summary>
                            <pre className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg p-3 mt-1 overflow-auto max-h-40 text-slate-600">
                                {JSON.stringify(rawResponse, null, 2)}
                            </pre>
                        </details>
                    )}
                </div>
            ) : (
                /* Create form */
                <div className="space-y-4">
                    {loadingRates ? (
                        <div className="flex items-center gap-2 py-4 text-slate-400 text-sm justify-center">
                            <RefreshCw size={14} className="animate-spin" /> กำลังโหลดราคาขนส่ง...
                        </div>
                    ) : (
                        <>
                            {rates.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">เลือกบริษัทขนส่ง</p>
                                    {rates.map(r => (
                                        <button
                                            key={r.courier_code}
                                            onClick={() => setSelectedCourier(r.courier_code)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                                                selectedCourier === r.courier_code
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-100 hover:border-slate-200"
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                selectedCourier === r.courier_code ? "border-blue-500" : "border-slate-300"
                                            }`}>
                                                {selectedCourier === r.courier_code && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            {r.logo && (
                                                <img src={r.logo} alt={r.courier_name}
                                                    className="w-10 h-7 object-contain rounded border border-slate-100 bg-white p-0.5 shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800">{r.courier_name}</p>
                                                <p className="text-[10px] text-slate-400">~{r.estimate_days} วัน</p>
                                            </div>
                                            <p className="text-sm font-black text-slate-800 shrink-0">฿{r.total_price}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                /* fallback: manual courier select */
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">เลือกบริษัทขนส่ง</p>
                                    <select
                                        value={selectedCourier}
                                        onChange={e => setSelectedCourier(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                                    >
                                        <option value="">-- เลือกขนส่ง --</option>
                                        <option value="FlashExpressA">Flash Express</option>
                                        <option value="Kerry">Kerry Express</option>
                                        <option value="ThaiPost">ไปรษณีย์ไทย (EMS)</option>
                                        <option value="Ninja">Ninja Van</option>
                                        <option value="DHL">DHL</option>
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-1">* ราคาค่าส่งไม่พบ — อาจเนื่องจากที่อยู่ไม่ครบ</p>
                                </div>
                            )}
                        </>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                            <AlertCircle size={14} className="shrink-0" /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleCreate}
                        disabled={creating || !selectedCourier}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {creating
                            ? <><RefreshCw size={14} className="animate-spin" /> กำลังสร้างพัสดุ...</>
                            : <><Package size={14} /> สร้างพัสดุ iShip</>}
                    </button>
                </div>
            )}
        </div>
    );
}
