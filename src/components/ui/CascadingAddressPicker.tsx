"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface AddressData {
    province: string;
    amphure: string;
    district: string;
    zipcode: string;
}

interface Props {
    value: AddressData;
    onChange: (addr: AddressData) => void;
    className?: string;
}

export default function CascadingAddressPicker({ value, onChange, className }: Props) {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [subDistricts, setSubDistricts] = useState<any[]>([]);
    
    const [loadingP, setLoadingP] = useState(true);
    const [loadingD, setLoadingD] = useState(false);
    const [loadingS, setLoadingS] = useState(false);

    // Selected IDs
    const [selectedProvId, setSelectedProvId] = useState<number | null>(null);
    const [selectedDistId, setSelectedDistId] = useState<number | null>(null);

    // Initial fetch provinces
    useEffect(() => {
        fetch('/api/address/provinces')
            .then(res => res.json())
            .then(d => {
                if (d.success) {
                    setProvinces(d.data);
                    // Match existing province name to ID if editing
                    if (value.province) {
                        const p = d.data.find((x: any) => x.name_th === value.province);
                        if (p) setSelectedProvId(p.id);
                    }
                }
            })
            .finally(() => setLoadingP(false));
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        if (!selectedProvId) {
            setDistricts([]);
            setSelectedDistId(null);
            return;
        }
        setLoadingD(true);
        fetch(`/api/address/districts?province_id=${selectedProvId}`)
            .then(res => res.json())
            .then(d => {
                if (d.success) {
                    setDistricts(d.data);
                    if (value.amphure) {
                        const dist = d.data.find((x: any) => x.name_th === value.amphure);
                        if (dist) setSelectedDistId(dist.id);
                    }
                }
            })
            .finally(() => setLoadingD(false));
    }, [selectedProvId]);

    // Fetch sub-districts when district changes
    useEffect(() => {
        if (!selectedDistId) {
            setSubDistricts([]);
            return;
        }
        setLoadingS(true);
        fetch(`/api/address/sub-districts?district_id=${selectedDistId}`)
            .then(res => res.json())
            .then(d => {
                if (d.success) setSubDistricts(d.data);
            })
            .finally(() => setLoadingS(false));
    }, [selectedDistId]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedProvId(id);
        const pName = provinces.find(p => p.id === id)?.name_th || "";
        onChange({ province: pName, amphure: "", district: "", zipcode: "" });
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedDistId(id);
        const dName = districts.find(d => d.id === id)?.name_th || "";
        onChange({ ...value, amphure: dName, district: "", zipcode: "" });
    };

    const handleSubDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        const s = subDistricts.find(sd => sd.id === id);
        if (s) {
            onChange({ ...value, district: s.name_th, zipcode: s.zip_code?.toString() || "" });
        } else {
            onChange({ ...value, district: "", zipcode: "" });
        }
    };

    const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-400";
    const labelCls = "text-[11px] font-black text-slate-400 block mb-2 uppercase tracking-widest";

    return (
        <div className={cn("grid grid-cols-2 gap-4", className)}>
            {/* Province */}
            <div>
                <label className={labelCls}>จังหวัด <span className="text-red-500">*</span></label>
                <div className="relative">
                    <select
                        value={selectedProvId || ""}
                        onChange={handleProvinceChange}
                        className={cn(inputCls, "appearance-none")}
                        disabled={loadingP}
                    >
                        <option value="">เลือกจังหวัด</option>
                        {provinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name_th}</option>
                        ))}
                    </select>
                    {loadingP && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-slate-400" />}
                </div>
            </div>

            {/* District */}
            <div>
                <label className={labelCls}>เขต/อำเภอ <span className="text-red-500">*</span></label>
                <div className="relative">
                    <select
                        value={selectedDistId || ""}
                        onChange={handleDistrictChange}
                        className={cn(inputCls, "appearance-none")}
                        disabled={!selectedProvId || loadingD}
                    >
                        <option value="">เลือกเขต/อำเภอ</option>
                        {districts.map(d => (
                            <option key={d.id} value={d.id}>{d.name_th}</option>
                        ))}
                    </select>
                    {loadingD && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-slate-400" />}
                </div>
            </div>

            {/* Sub-District */}
            <div>
                <label className={labelCls}>แขวง/ตำบล <span className="text-red-500">*</span></label>
                <div className="relative">
                    <select
                        value={subDistricts.find(sd => sd.name_th === value.district)?.id || ""}
                        onChange={handleSubDistrictChange}
                        className={cn(inputCls, "appearance-none")}
                        disabled={!selectedDistId || loadingS}
                    >
                        <option value="">เลือกแขวง/ตำบล</option>
                        {subDistricts.map(sd => (
                            <option key={sd.id} value={sd.id}>{sd.name_th}</option>
                        ))}
                    </select>
                    {loadingS && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-slate-400" />}
                </div>
            </div>

            {/* Zipcode */}
            <div>
                <label className={labelCls}>รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    value={value.zipcode}
                    onChange={(e) => onChange({...value, zipcode: e.target.value})}
                    placeholder="รหัสไปรษณีย์"
                    className={inputCls}
                />
            </div>
        </div>
    );
}
