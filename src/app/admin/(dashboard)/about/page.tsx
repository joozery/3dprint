"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AboutAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("hero");

    const [data, setData] = useState<any>({
        hero: {},
        whoWeAre: {},
        mvv: [],
        whyUs: [],
        team: [],
        cta: {}
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/about");
            const result = await res.json();
            if (res.ok) {
                setData(result);
            }
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/about", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast.success("บันทึกข้อมูลสำเร็จ");
            } else {
                toast.error("ไม่สามารถบันทึกข้อมูลได้");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setSaving(false);
        }
    };

    // Helper for nested state
    const updateField = (section: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateTeamMember = (index: number, field: string, value: string) => {
        const newTeam = [...data.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setData((prev: any) => ({ ...prev, team: newTeam }));
    };

    const addTeamMember = () => {
        setData((prev: any) => ({
            ...prev,
            team: [...prev.team, { name: "ชื่อ นามสกุล", role: "ตำแหน่ง", img: "" }]
        }));
    };

    const removeTeamMember = (index: number) => {
        const newTeam = [...data.team];
        newTeam.splice(index, 1);
        setData((prev: any) => ({ ...prev, team: newTeam }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">จัดการหน้าเกี่ยวกับเรา</h1>
                    <p className="text-slate-500 text-sm mt-1">ปรับแต่งเนื้อหาในหน้า About Us (/about)</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    บันทึกการเปลี่ยนแปลง
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                {[
                    { id: "hero", label: "Hero Section" },
                    { id: "whoWeAre", label: "Who We Are" },
                    { id: "team", label: "ทีมงาน (Team)" },
                    { id: "cta", label: "Call to Action" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                
                {/* HERO TAB */}
                {activeTab === "hero" && (
                    <div className="space-y-5">
                        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">ส่วนหัว (Hero)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">คำบรรยายย่อย (Subtitle)</label>
                                <input
                                    type="text"
                                    value={data.hero?.subtitle || ""}
                                    onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อหลัก บรรทัด 1</label>
                                <input
                                    type="text"
                                    value={data.hero?.title1 || ""}
                                    onChange={(e) => updateField("hero", "title1", e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ข้อความเน้นสี (Highlight)</label>
                                <input
                                    type="text"
                                    value={data.hero?.titleHighlight || ""}
                                    onChange={(e) => updateField("hero", "titleHighlight", e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อหลัก บรรทัด 2</label>
                                <input
                                    type="text"
                                    value={data.hero?.title2 || ""}
                                    onChange={(e) => updateField("hero", "title2", e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด (Description)</label>
                                <textarea
                                    rows={3}
                                    value={data.hero?.description || ""}
                                    onChange={(e) => updateField("hero", "description", e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* WHO WE ARE TAB */}
                {activeTab === "whoWeAre" && (
                    <div className="space-y-5">
                        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">PrintMyDesign คือใคร</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อ (Title)</label>
                            <input
                                type="text"
                                value={data.whoWeAre?.title || ""}
                                onChange={(e) => updateField("whoWeAre", "title", e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด (Description)</label>
                            <textarea
                                rows={4}
                                value={data.whoWeAre?.description || ""}
                                onChange={(e) => updateField("whoWeAre", "description", e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* TEAM TAB */}
                {activeTab === "team" && (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-b pb-2 mb-4">
                            <h2 className="text-lg font-semibold text-slate-800">ทีมงานของเรา</h2>
                            <button
                                onClick={addTeamMember}
                                className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                เพิ่มสมาชิก
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.team?.map((member: any, index: number) => (
                                <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-xl relative group">
                                    <button 
                                        onClick={() => removeTeamMember(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-white text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-slate-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-3 mt-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อ-นามสกุล</label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">ตำแหน่ง</label>
                                            <input
                                                type="text"
                                                value={member.role}
                                                onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">URL รูปภาพ</label>
                                            <input
                                                type="text"
                                                value={member.img}
                                                onChange={(e) => updateTeamMember(index, "img", e.target.value)}
                                                placeholder="/about/team-1.png"
                                                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        {member.img && (
                                            <div className="mt-2 aspect-square w-24 rounded-lg overflow-hidden border border-slate-200 mx-auto relative bg-slate-100">
                                                <img src={member.img} alt={member.name} className="object-cover w-full h-full" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!data.team || data.team.length === 0) && (
                            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                ยังไม่มีข้อมูลสมาชิกในทีม
                            </div>
                        )}
                    </div>
                )}

                {/* CTA TAB */}
                {activeTab === "cta" && (
                    <div className="space-y-5">
                        <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Call to Action (ส่วนท้าย)</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อ (Title)</label>
                            <input
                                type="text"
                                value={data.cta?.title || ""}
                                onChange={(e) => updateField("cta", "title", e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด (Description)</label>
                            <textarea
                                rows={2}
                                value={data.cta?.description || ""}
                                onChange={(e) => updateField("cta", "description", e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
