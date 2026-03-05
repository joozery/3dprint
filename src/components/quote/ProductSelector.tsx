"use client";

import { Box, Cog, Layers, Cpu, Database, Scissors, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const products = [
    { id: "3d", label: "พิมพ์ 3 มิติ", icon: <Layers className="w-6 h-6" /> },
    { id: "cnc", label: "งานกัด CNC", icon: <Cog className="w-6 h-6" /> },
    { id: "sheet", label: "งานพับโลหะ", icon: <Scissors className="w-6 h-6" /> },
    { id: "mech", label: "ชิ้นงานกลไก", icon: <Box className="w-6 h-6" /> },
    { id: "pcb", label: "แผ่นวงจร PCB", icon: <Cpu className="w-6 h-6" /> },
    { id: "pcba", label: "ประกอบแผ่นวงจร", icon: <Zap className="w-6 h-6" /> },
    { id: "smt", label: "แผ่นสเตนซิล SMT", icon: <Database className="w-6 h-6" /> },
];

export function ProductSelector() {
    const [activeTab, setActiveTab] = useState("3d");

    return (
        <div className="bg-white/95 backdrop-blur-sm border-b sticky top-16 z-40">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => setActiveTab(product.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center min-w-[140px] px-2 py-3 rounded-lg transition-all border shrink-0 overflow-hidden",
                                activeTab === product.id
                                    ? "border-blue-500 bg-white text-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                                    : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <div className={cn(
                                "mb-1.5 transition-colors",
                                activeTab === product.id ? "text-blue-500" : "text-slate-400"
                            )}>
                                {product.icon}
                            </div>
                            <span className="text-xs font-bold text-center leading-tight">
                                {product.label}
                            </span>

                            {/* Blue triangle checkmark on active tab */}
                            {activeTab === product.id && (
                                <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-l-[20px] border-b-blue-500 border-l-transparent flex items-end justify-end">
                                    <svg className="w-2.5 h-2.5 text-white absolute -right-0 -bottom-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                    <button className="p-3 shrink-0 text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
