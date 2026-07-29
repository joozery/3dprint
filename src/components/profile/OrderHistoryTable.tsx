"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package, CheckCircle2, ExternalLink, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface OrderHistoryTableProps {
    orders: any[];
}

const TRACKING_URL: Record<string, (n: string) => string> = {
    FlashExpressA: (n) => `https://www.flashexpress.co.th/tracking/?se=${n}`,
    KerryExpress:  (n) => `https://th.kerryexpress.com/en/track/?track=${n}`,
    BestExpress:   (n) => `https://www.best-inc.co.th/track/${n}`,
    ShopeeExpress: (n) => `https://spx.co.th/track?trackingNo=${n}`,
    fedex:         (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}`,
};

const COURIER_NAME: Record<string, string> = {
    FlashExpressA: "Flash Express",
    KerryExpress:  "Kerry Express",
    BestExpress:   "Best Express",
    ShopeeExpress: "Shopee Express",
    fedex:         "FedEx",
};


export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { t } = useLanguage();
    const p = t.profile;

    const STATUS_STEPS = [
        { key: "pending_payment", label: p.statusPendingPayment },
        { key: "processing",      label: p.statusProcessing },
        { key: "printing",        label: p.statusPrinting },
        { key: "shipped",         label: p.statusShipped },
        { key: "delivered",       label: p.statusDelivered },
    ];

    function getStep(status: string): number {
        const idx = STATUS_STEPS.findIndex(s => s.key === status);
        return idx >= 0 ? idx + 1 : 1;
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case "pending_payment": return { label: p.statusPendingPayment, cls: "bg-amber-50 text-amber-600 border-amber-200" };
            case "processing":      return { label: p.statusProcessing,     cls: "bg-blue-50 text-blue-600 border-blue-200" };
            case "printing":        return { label: p.statusPrinting,       cls: "bg-indigo-50 text-indigo-600 border-indigo-200" };
            case "shipped":         return { label: p.statusShipped,        cls: "bg-emerald-50 text-emerald-600 border-emerald-200" };
            case "delivered":       return { label: p.statusDelivered,      cls: "bg-green-50 text-green-700 border-green-200" };
            case "cancelled":       return { label: p.statusCancelled,      cls: "bg-red-50 text-red-600 border-red-200" };
            default:                return { label: status,                  cls: "bg-slate-50 text-slate-500 border-slate-200" };
        }
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-slate-900 font-black tracking-tight">{p.noHistory}</h3>
                <p className="text-slate-400 text-xs mt-1 font-bold">{p.noHistoryDesc}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center px-6 py-4 bg-white border-b border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <div className="w-[28%]">{p.orderCol}</div>
                <div className="w-[14%]">{p.dateCol}</div>
                <div className="w-[10%] text-center">{p.itemsCol}</div>
                <div className="w-[28%] text-center">{p.status}</div>
                <div className="w-[20%] text-right pr-4">{p.totalCol}</div>
            </div>

            <div className="divide-y divide-slate-100">
                {orders.map((order) => {
                    const currentStep = getStep(order.status);
                    const isExpanded  = expandedId === order._id;
                    const badge       = getStatusBadge(order.status);
                    const quotes      = order.quotes as any[] || [];
                    const courierKey  = order.shippingProvider === "fedex"
                        ? "fedex"
                        : order.ishipCourierCode || "";
                    const trackingUrl = order.trackingNumber && courierKey
                        ? TRACKING_URL[courierKey]?.(order.trackingNumber)
                        : null;

                    return (
                        <div key={order._id} className="group transition-all">
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                className={cn(
                                    "flex flex-col md:flex-row md:items-center px-6 py-5 cursor-pointer hover:bg-slate-50/50 transition-colors",
                                    isExpanded && "bg-slate-50/80"
                                )}
                            >
                                {/* 1. Order ID & Tracking */}
                                <div className="w-full md:w-[28%] mb-3 md:mb-0">
                                    <div className="text-[13px] font-black text-slate-900 tracking-tight">
                                        {order.orderNumber}
                                    </div>
                                    {order.trackingNumber ? (
                                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                            <Truck size={10} className="text-slate-400 shrink-0" />
                                            <span className="text-[10px] font-bold text-slate-500 font-mono">
                                                {order.trackingNumber}
                                            </span>
                                            {courierKey && (
                                                <span className="text-[9px] text-slate-400">
                                                    · {COURIER_NAME[courierKey] || courierKey}
                                                </span>
                                            )}
                                            {trackingUrl && (
                                                <a
                                                    href={trackingUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="text-[9px] text-blue-500 hover:underline flex items-center gap-0.5"
                                                >
                                                    <ExternalLink size={8} /> {p.trackLink}
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-slate-300 mt-0.5">{p.noTracking}</div>
                                    )}
                                </div>

                                {/* 2. Date */}
                                <div className="w-full md:w-[14%] mb-2 md:mb-0 text-[12px] font-bold text-slate-500 font-mono">
                                    {new Date(order.createdAt).toISOString().split("T")[0]}
                                </div>

                                {/* 3. Items Count */}
                                <div className="w-full md:w-[10%] mb-4 md:mb-0 text-center text-[12px] font-black text-slate-600">
                                    <span className="md:hidden text-slate-400 mr-2">{p.itemsLabel}</span>
                                    {quotes.length}
                                </div>

                                {/* 4. Status Stepper */}
                                <div className="w-full md:w-[28%] mb-4 md:mb-0 flex items-center justify-center gap-2">
                                    {order.status === "cancelled" ? (
                                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", badge.cls)}>
                                            {badge.label}
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-0.5">
                                            {STATUS_STEPS.map((s, idx) => {
                                                const stepNum = idx + 1;
                                                const done    = stepNum < currentStep;
                                                const active  = stepNum === currentStep;
                                                return (
                                                    <React.Fragment key={s.key}>
                                                        <div className="relative group/step">
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/step:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30">
                                                                {s.label}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[4px] border-transparent border-t-slate-900" />
                                                            </div>
                                                            <div className={cn(
                                                                "w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all",
                                                                done   ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                                                : active ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50"
                                                                : "bg-white border-slate-200 text-slate-300"
                                                            )}>
                                                                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                                                            </div>
                                                        </div>
                                                        {idx < STATUS_STEPS.length - 1 && (
                                                            <div className={cn("w-3 h-[1.5px]", done ? "bg-blue-600" : "bg-slate-200")} />
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest" style={{ color: badge.cls.includes("emerald") || badge.cls.includes("green") ? "#059669" : badge.cls.includes("blue") ? "#2563eb" : badge.cls.includes("indigo") ? "#4f46e5" : "#94a3b8" }}>
                                        {badge.label}
                                    </span>
                                </div>

                                {/* 5. Price & Expand */}
                                <div className="w-full md:w-[20%] flex items-center justify-end gap-3 pr-2">
                                    <div className="text-[14px] font-black text-slate-900 font-mono tracking-tighter">
                                        ฿{(order.pricing?.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    {isExpanded
                                        ? <ChevronUp className="w-4 h-4 text-slate-300" />
                                        : <ChevronDown className="w-4 h-4 text-slate-300" />}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-6 py-5 bg-slate-50/40 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200 space-y-3">
                                    {/* Shipping info */}
                                    {order.trackingNumber && (
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                            <Truck size={14} className="text-emerald-600 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{p.shippedBy} {COURIER_NAME[courierKey] || courierKey}</p>
                                                <p className="text-sm font-black text-slate-800 font-mono select-all">{order.trackingNumber}</p>
                                            </div>
                                            {trackingUrl && (
                                                <a
                                                    href={trackingUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline whitespace-nowrap"
                                                >
                                                    <ExternalLink size={12} /> {p.trackPackage}
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Quote items */}
                                    {quotes.map((q: any) => (
                                        <div key={q._id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                                                <Package className="w-7 h-7 text-slate-200" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-black text-slate-800 truncate">{q.originalName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                                    {[q.technology, q.material, q.color].filter(Boolean).join(" · ")}
                                                </p>
                                                <p className="text-[11px] font-black text-slate-700 mt-1">
                                                    ฿{(q.priceDetail?.totalPrice || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Address */}
                                    {order.shippingAddress && (
                                        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                                            <span className="font-bold text-slate-600">{order.shippingAddress.fullName}</span>
                                            {" · "}
                                            {[order.shippingAddress.address, order.shippingAddress.subDistrict, order.shippingAddress.district, order.shippingAddress.province, order.shippingAddress.zipCode].filter(Boolean).join(", ")}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
