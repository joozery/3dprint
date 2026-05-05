"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package, Truck, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderHistoryTableProps {
    quotes: any[];
}

export function OrderHistoryTable({ quotes }: OrderHistoryTableProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const steps = [1, 2, 3, 4, 5, 6];
    
    // Mock status mapping for demonstration based on screenshot
    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 2;
            case 'printing': return 3;
            case 'quality_check': return 4;
            case 'packing': return 5;
            case 'shipped': return 6;
            case 'ordered': return 2;
            default: return 3;
        }
    };

    const getStatusLabel = (step: number) => {
        if (step >= 6) return "จัดส่ง";
        if (step >= 3) return "พิมพ์";
        return "รอดำเนินการ";
    };

    if (quotes.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-slate-900 font-black tracking-tight">ไม่พบประวัติคำสั่งซื้อ</h3>
                <p className="text-slate-400 text-xs mt-1 font-bold">คุณยังไม่มีรายการสั่งซื้อในขณะนี้</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center px-6 py-4 bg-white border-b border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <div className="w-[30%]">ใบสั่งซื้อ</div>
                <div className="w-[15%]">วันที่</div>
                <div className="w-[10%] text-center">รายการ</div>
                <div className="w-[30%] text-center">สถานะ</div>
                <div className="w-[15%] text-right pr-4">รวม</div>
            </div>

            <div className="divide-y divide-slate-100">
                {quotes.map((q) => {
                    const currentStep = getStatusStep(q.status);
                    const isExpanded = expandedId === q._id;
                    const orderId = q.quoteNumber || `PMD-${new Date(q.createdAt).getFullYear()}-${q._id.toString().slice(-4).toUpperCase()}`;

                    return (
                        <div key={q._id} className="group transition-all">
                            <div 
                                onClick={() => setExpandedId(isExpanded ? null : q._id)}
                                className={cn(
                                    "flex flex-col md:flex-row md:items-center px-6 py-5 cursor-pointer hover:bg-slate-50/50 transition-colors",
                                    isExpanded && "bg-slate-50/80"
                                )}
                            >
                                {/* 1. Order ID & Tracking */}
                                <div className="w-full md:w-[30%] mb-3 md:mb-0">
                                    <div className="text-[13px] font-black text-slate-900 tracking-tight">{orderId}</div>
                                    {q.trackingNumber && (
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                            หมายเลขติดตาม: {q.trackingNumber}
                                        </div>
                                    )}
                                </div>

                                {/* 2. Date */}
                                <div className="w-full md:w-[15%] mb-2 md:mb-0 text-[12px] font-bold text-slate-500 font-mono">
                                    {new Date(q.createdAt).toISOString().split('T')[0]}
                                </div>

                                {/* 3. Items Count */}
                                <div className="w-full md:w-[10%] mb-4 md:mb-0 text-center text-[12px] font-black text-slate-600">
                                    <span className="md:hidden text-slate-400 mr-2">รายการ:</span>
                                    1
                                </div>

                                {/* 4. Status Stepper */}
                                <div className="w-full md:w-[30%] mb-4 md:mb-0 flex items-center justify-center gap-1.5">
                                    <div className="flex items-center gap-0.5">
                                        {steps.map((s, idx) => (
                                            <React.Fragment key={s}>
                                                <div 
                                                    className={cn(
                                                        "w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all",
                                                        s < currentStep 
                                                            ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                                                            : s === currentStep
                                                            ? "bg-white border-slate-900 text-slate-900 ring-4 ring-slate-100"
                                                            : "bg-white border-slate-200 text-slate-300"
                                                    )}
                                                >
                                                    {s < currentStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                                                </div>
                                                {idx < steps.length - 1 && (
                                                    <div className={cn("w-3 h-[1.5px]", s < currentStep ? "bg-slate-900" : "bg-slate-200")} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {getStatusLabel(currentStep)}
                                    </span>
                                </div>

                                {/* 5. Price & Expand */}
                                <div className="w-full md:w-[15%] flex items-center justify-end gap-3 pr-2">
                                    <div className="text-[14px] font-black text-slate-900 font-mono tracking-tighter">
                                        ฿{(q.priceDetail?.totalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-6 py-6 bg-slate-50/30 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex gap-6">
                                        <div className="w-20 h-20 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                                            <Package className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-[13px] font-black text-slate-800">{q.originalName}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                                        {q.technology} · {q.material} · {q.color}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ราคาประเมิน</div>
                                                    <div className="text-[12px] font-black text-slate-900">฿{(q.priceDetail?.totalPrice || 0).toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
                                                    ดูโมเดล 3D
                                                </button>
                                                <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
                                                    ดาวน์โหลดใบเสนอราคา
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
