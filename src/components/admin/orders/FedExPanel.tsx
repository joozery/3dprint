"use client";

import { useState, useEffect } from "react";
import { Plane, Package, Printer, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

interface Props {
    orderId: string;
    shippingAddress: {
        zipCode:  string;
        province: string;
    };
    quotesData: {
        weightGrams: number;
        dimensions:  { x: number; y: number; z: number };
    }[];
    existing: {
        trackingNumber?:  string;
        shippingProvider?: string;
        fedexServiceType?: string;
        fedexLabelUrl?:   string;
    };
}

export default function FedExPanel({ orderId, shippingAddress, quotesData, existing }: Props) {
    const alreadyFedEx = existing.shippingProvider === "fedex" && !!existing.trackingNumber;

    const [rates, setRates]               = useState<any[]>([]);
    const [loadingRates, setLoadingRates] = useState(false);
    const [selectedService, setSelectedService] = useState(existing.fedexServiceType || "");
    const [creating, setCreating]         = useState(false);
    const [result, setResult]             = useState<{ trackingNumber: string; labelUrl: string; serviceType: string } | null>(
        alreadyFedEx
            ? { trackingNumber: existing.trackingNumber!, labelUrl: existing.fedexLabelUrl || "", serviceType: existing.fedexServiceType || "" }
            : null
    );
    const [error, setError]               = useState("");

    const totalWeightG = quotesData.reduce((s, q) => s + (q.weightGrams || 0), 0);
    const maxW  = Math.max(...quotesData.map(q => q.dimensions?.x || 10));
    const maxL  = Math.max(...quotesData.map(q => q.dimensions?.y || 10));
    const maxH  = quotesData.reduce((s, q) => s + (q.dimensions?.z || 5), 0);

    useEffect(() => {
        if (result || !shippingAddress?.zipCode) return;
        setLoadingRates(true);
        fetch("/api/fedex/rates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dst_zipcode:  shippingAddress.zipCode,
                dst_province: shippingAddress.province || "",
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
        if (!selectedService) { setError("กรุณาเลือกบริการ FedEx ก่อน"); return; }
        setCreating(true);
        setError("");
        try {
            const res  = await fetch("/api/fedex/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, serviceType: selectedService }),
            });
            const data = await res.json();
            if (data.success) {
                setResult({ trackingNumber: data.trackingNumber, labelUrl: data.labelUrl || "", serviceType: data.fedexServiceType });
            } else {
                setError(data.error || "สร้างพัสดุ FedEx ไม่สำเร็จ");
            }
        } catch {
            setError("ระบบขัดข้อง กรุณาลองใหม่");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
                <Plane size={18} className="text-purple-500" /> จัดส่งพัสดุ (FedEx)
            </h3>

            {/* Package summary */}
            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs text-slate-500 flex gap-4 flex-wrap">
                <span>น้ำหนัก: <b className="text-slate-700">{totalWeightG >= 1000 ? `${(totalWeightG/1000).toFixed(2)} kg` : `${totalWeightG.toFixed(0)} g`}</b></span>
                <span>ขนาด: <b className="text-slate-700">{Math.ceil(maxW)} × {Math.ceil(maxL)} × {Math.ceil(maxH)} cm</b></span>
                <span>ปลายทาง: <b className="text-slate-700">{shippingAddress.zipCode} {shippingAddress.province}</b></span>
            </div>

            {result ? (
                <div className="space-y-3">
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-purple-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-1">สร้างพัสดุ FedEx สำเร็จ</p>
                            <p className="text-sm font-bold text-slate-800">
                                Tracking: <span className="font-black text-purple-700 select-all">{result.trackingNumber || "-"}</span>
                            </p>
                            {result.serviceType && (
                                <p className="text-xs text-slate-500 mt-0.5">Service: {result.serviceType}</p>
                            )}
                        </div>
                    </div>

                    {result.labelUrl ? (
                        <a
                            href={result.labelUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            <Printer size={14} /> พิมพ์ label FedEx
                        </a>
                    ) : (
                        <a
                            href={`https://www.fedex.com/fedextrack/?trknbr=${result.trackingNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-purple-500 hover:underline justify-center"
                        >
                            <ExternalLink size={12} /> ติดตามพัสดุบน FedEx.com
                        </a>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {loadingRates ? (
                        <div className="flex items-center gap-2 py-4 text-slate-400 text-sm justify-center">
                            <RefreshCw size={14} className="animate-spin" /> กำลังโหลดราคา FedEx...
                        </div>
                    ) : rates.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">เลือกบริการ FedEx</p>
                            {rates.map(r => (
                                <button
                                    key={r.serviceType}
                                    onClick={() => setSelectedService(r.serviceType)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                                        selectedService === r.serviceType
                                            ? "border-purple-500 bg-purple-50"
                                            : "border-slate-100 hover:border-slate-200"
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                        selectedService === r.serviceType ? "border-purple-500" : "border-slate-300"
                                    }`}>
                                        {selectedService === r.serviceType && (
                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">{r.serviceName}</p>
                                        <p className="text-[10px] text-slate-400">{r.estimatedDays}</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-800 shrink-0">
                                        {r.currency} {Number(r.totalPrice).toLocaleString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">เลือกบริการ FedEx</p>
                            <select
                                value={selectedService}
                                onChange={e => setSelectedService(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-white"
                            >
                                <option value="">-- เลือกบริการ --</option>
                                <option value="FEDEX_EXPRESS_SAVER">FedEx Express Saver</option>
                                <option value="INTERNATIONAL_PRIORITY">FedEx International Priority</option>
                                <option value="INTERNATIONAL_ECONOMY">FedEx International Economy</option>
                                <option value="PRIORITY_OVERNIGHT">FedEx Priority Overnight</option>
                                <option value="STANDARD_OVERNIGHT">FedEx Standard Overnight</option>
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1">* ไม่พบราคาอัตโนมัติ — เลือกบริการด้วยตนเอง</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                            <AlertCircle size={14} className="shrink-0" /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleCreate}
                        disabled={creating || !selectedService}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {creating
                            ? <><RefreshCw size={14} className="animate-spin" /> กำลังสร้างพัสดุ FedEx...</>
                            : <><Package size={14} /> สร้างพัสดุ FedEx</>}
                    </button>
                </div>
            )}
        </div>
    );
}
