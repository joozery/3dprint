"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThaiAddress {
    province: string;
    amphure:  string;
    district: string;
    zipcode:  string;
}

interface Props {
    value: ThaiAddress;
    onChange: (addr: ThaiAddress) => void;
    className?: string;
}

export default function ThaiAddressPicker({ value, onChange, className }: Props) {
    const [zipInput, setZipInput]     = useState(value.zipcode || "");
    const [suggestions, setSuggestions] = useState<ThaiAddress[]>([]);
    const [showDrop, setShowDrop]     = useState(false);
    const [loading, setLoading]       = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    // Lookup when zipcode is 5 digits
    useEffect(() => {
        if (zipInput.length !== 5) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        fetch(`/api/address?zipcode=${zipInput}`)
            .then(r => r.json())
            .then(d => {
                if (d.results?.length) {
                    setSuggestions(d.results);
                    // auto-fill ถ้ามีเพียง province+amphure เดียว
                    const uniquePA = [...new Set(d.results.map((r: ThaiAddress) => `${r.province}|${r.amphure}`))];
                    if (uniquePA.length === 1 && d.results.length === 1) {
                        // เลือกให้เลย
                        onChange(d.results[0]);
                        setShowDrop(false);
                    } else {
                        setShowDrop(true);
                    }
                } else {
                    setSuggestions([]);
                }
            })
            .catch(() => setSuggestions([]))
            .finally(() => setLoading(false));
    }, [zipInput]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setShowDrop(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const select = (addr: ThaiAddress) => {
        onChange(addr);
        setZipInput(addr.zipcode);
        setShowDrop(false);
    };

    const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors bg-white";
    const labelCls = "text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider";

    return (
        <div className={cn("space-y-4", className)}>
            {/* Zipcode */}
            <div ref={dropRef} className="relative">
                <label className={labelCls}>รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="กรอกรหัสไปรษณีย์ 5 หลัก"
                        value={zipInput}
                        onChange={e => {
                            const v = e.target.value.replace(/\D/g, "");
                            setZipInput(v);
                            if (v.length < 5) {
                                onChange({ ...value, zipcode: v, province: "", amphure: "", district: "" });
                            }
                        }}
                        className={cn(inputCls, "pr-10")}
                    />
                    {loading && (
                        <div className="absolute right-3 top-3.5 animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400" />
                    )}
                    {!loading && suggestions.length > 1 && (
                        <button onClick={() => setShowDrop(s => !s)} className="absolute right-3 top-3.5">
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                </div>

                {showDrop && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => select(s)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm border-b border-slate-100 last:border-0 flex items-center gap-2"
                            >
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>
                                    <span className="font-bold text-slate-800">{s.district}</span>
                                    <span className="text-slate-400"> · {s.amphure} · {s.province}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Province + Amphure */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>จังหวัด <span className="text-red-500">*</span></label>
                    <input
                        readOnly
                        placeholder="กรอก zipcode ก่อน"
                        value={value.province}
                        className={cn(inputCls, "bg-slate-50 text-slate-600")}
                    />
                </div>
                <div>
                    <label className={labelCls}>เขต/อำเภอ <span className="text-red-500">*</span></label>
                    <input
                        readOnly
                        placeholder="—"
                        value={value.amphure}
                        className={cn(inputCls, "bg-slate-50 text-slate-600")}
                    />
                </div>
            </div>

            {/* District dropdown if multiple */}
            <div>
                <label className={labelCls}>แขวง/ตำบล <span className="text-red-500">*</span></label>
                {suggestions.filter(s => s.province === value.province && s.amphure === value.amphure).length > 1 ? (
                    <select
                        value={value.district}
                        onChange={e => {
                            const picked = suggestions.find(s => s.district === e.target.value);
                            if (picked) onChange(picked);
                        }}
                        className={cn(inputCls, "appearance-none")}
                    >
                        <option value="">เลือกแขวง/ตำบล</option>
                        {suggestions
                            .filter(s => s.province === value.province && s.amphure === value.amphure)
                            .map(s => (
                                <option key={s.district} value={s.district}>{s.district}</option>
                            ))}
                    </select>
                ) : (
                    <input
                        readOnly
                        placeholder="—"
                        value={value.district}
                        className={cn(inputCls, "bg-slate-50 text-slate-600")}
                    />
                )}
            </div>
        </div>
    );
}
