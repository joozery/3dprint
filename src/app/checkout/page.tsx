"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ArrowLeft, MapPin, Truck, CheckCircle2, ChevronRight,
    Package, Home, Building2, Phone, Globe, User, Info, Warehouse
} from "lucide-react";
import Link from "next/link";

import { useEffect } from "react";

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepHeader({ current }: { current: number }) {
    const steps = [
        { n: 1, label: "ที่อยู่จัดส่ง", icon: MapPin },
        { n: 2, label: "วิธีจัดส่ง", icon: Truck },
        { n: 3, label: "ยืนยันคำสั่งซื้อ", icon: CheckCircle2 },
    ];
    return (
        <div className="flex items-center gap-0 mb-8">
            {steps.map((step, idx) => {
                const Icon = step.icon;
                const done = current > step.n;
                const active = current === step.n;
                return (
                    <div key={step.n} className="flex items-center flex-1">
                        <div className={cn(
                            "flex items-center gap-2 py-3 px-4 rounded-xl transition-all",
                            active ? "bg-slate-900 text-white shadow-lg shadow-slate-200" :
                                done ? "bg-emerald-50 text-emerald-600" : "bg-white text-slate-400 border"
                        )}>
                            <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0",
                                active ? "bg-white/20" : done ? "bg-emerald-100" : "bg-slate-100"
                            )}>
                                {done ? <CheckCircle2 className="w-4 h-4" /> : step.n}
                            </div>
                            <span className="text-sm font-bold tracking-wide">{step.label}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={cn("h-0.5 flex-1 mx-2", done ? "bg-emerald-300" : "bg-slate-200")} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Step 1: Shipping Address ────────────────────────────────────────────────
function ShippingAddress({ onNext }: { onNext: (data: any) => void }) {
    const [type, setType] = useState<"individual" | "company">("individual");
    const [form, setForm] = useState({
        firstName: "", lastName: "", company: "",
        country: "Thailand", state: "", city: "",
        address: "", building: "", postal: "",
        phone: "", countryCode: "+66"
    });

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = () => {
        if (!form.firstName || !form.lastName || !form.address || !form.postal || !form.phone) {
            alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
            return;
        }
        onNext({ ...form, type });
    };

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">1</div>
                <h2 className="text-lg font-bold text-slate-900 tracking-wide">ข้อมูลการจัดส่ง</h2>
            </div>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    onClick={() => setType("company")}
                    className={cn(
                        "flex items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-bold",
                        type === "company" ? "border-slate-900 bg-slate-50 text-slate-900" : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                >
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center", type === "company" ? "border-slate-900" : "border-slate-300")}>
                        {type === "company" && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                    </div>
                    <Building2 className="w-4 h-4 shrink-0" /> บริษัท / นิติบุคคล
                </button>
                <button
                    onClick={() => setType("individual")}
                    className={cn(
                        "flex items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-bold",
                        type === "individual" ? "border-slate-900 bg-slate-50 text-slate-900" : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                >
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center", type === "individual" ? "border-slate-900" : "border-slate-300")}>
                        {type === "individual" && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                    </div>
                    <User className="w-4 h-4 shrink-0" /> บุคคลทั่วไป
                </button>
            </div>

            {type === "company" && (
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">ชื่อบริษัท <span className="text-red-500">*</span></label>
                    <input
                        placeholder="ชื่อบริษัท / นิติบุคคล"
                        value={form.company}
                        onChange={e => set("company", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                        ชื่อ <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="ชื่อจริง"
                        value={form.firstName}
                        onChange={e => set("firstName", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                        นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="นามสกุล"
                        value={form.lastName}
                        onChange={e => set("lastName", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">ประเทศ <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select
                            value={form.country}
                            onChange={e => set("country", e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 appearance-none bg-white"
                        >
                            <option>Thailand</option>
                            <option>Singapore</option>
                            <option>Japan</option>
                            <option>USA</option>
                        </select>
                        <Globe className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">จังหวัด <span className="text-red-500">*</span></label>
                    <input
                        placeholder="จังหวัด"
                        value={form.state}
                        onChange={e => set("state", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">เขต/อำเภอ <span className="text-red-500">*</span></label>
                    <input
                        placeholder="เขต / อำเภอ"
                        value={form.city}
                        onChange={e => set("city", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">ที่อยู่จัดส่ง <span className="text-red-500">*</span></label>
                    <input
                        placeholder="เลขที่บ้าน / ถนน / ซอย"
                        value={form.address}
                        onChange={e => set("address", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">อาคาร / หมู่บ้าน</label>
                    <input
                        placeholder="ชื่ออาคาร / หมู่บ้าน (ถ้ามี)"
                        value={form.building}
                        onChange={e => set("building", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                    <input
                        placeholder="รหัสไปรษณีย์"
                        value={form.postal}
                        onChange={e => set("postal", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <select
                            value={form.countryCode}
                            onChange={e => set("countryCode", e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-slate-900 w-20 shrink-0 bg-white"
                        >
                            <option>+66</option>
                            <option>+1</option>
                            <option>+81</option>
                        </select>
                        <input
                            placeholder="0xx-xxx-xxxx"
                            value={form.phone}
                            onChange={e => set("phone", e.target.value)}
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSave}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-12 font-bold shadow-md shadow-slate-200 w-full md:w-auto"
            >
                บันทึกและดำเนินการต่อ
            </Button>
        </div>
    );
}

// ─── Step 2: Shipping Method ─────────────────────────────────────────────────
function ShippingMethod({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
    const [selected, setSelected] = useState("kerry");
    const methods = [
        {
            id: "self",
            label: "รับด้วยตัวเองที่โรงงาน",
            desc: "ถนนลาดพร้าว กรุงเทพฯ (จันทร์–ศุกร์ 09:00–18:00)",
            price: 0,
            days: "–",
            logo: null,
            useIcon: true,
        },
        {
            id: "kerry",
            label: "Kerry Express",
            desc: "จัดส่งด่วนภายใน 1–3 วันทำการ",
            price: 50,
            days: "1–3",
            logo: "/shipping/kerryexpress.png",
            useIcon: false,
        },
        {
            id: "flash",
            label: "Flash Express",
            desc: "จัดส่งรวดเร็วภายใน 1–2 วัน",
            price: 45,
            days: "1–2",
            logo: "/shipping/fashexpress.png",
            useIcon: false,
        },
        {
            id: "ems",
            label: "ไปรษณีย์ไทย (EMS)",
            desc: "จัดส่งมาตรฐาน 2–5 วันทำการ",
            price: 60,
            days: "2–5",
            logo: "/shipping/ems.jpeg",
            useIcon: false,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">2</div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-wide">ช่องทางการจัดส่ง</h2>
                </div>

                <div className="space-y-3">
                    {methods.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setSelected(m.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                                selected === m.id ? "border-slate-900 bg-slate-50" : "border-slate-100 hover:border-slate-200 bg-white"
                            )}
                        >
                            {/* Radio */}
                            <div className={cn("w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center", selected === m.id ? "border-slate-900" : "border-slate-300")}>
                                {selected === m.id && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
                            </div>

                            {/* Logo / Icon */}
                            <div className="w-12 h-10 flex items-center justify-center shrink-0">
                                {m.useIcon ? (
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <Warehouse className="w-5 h-5 text-slate-600" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-100 bg-white flex items-center justify-center p-1">
                                        <img
                                            src={m.logo!}
                                            alt={m.label}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{m.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                                <p className="text-sm font-black text-slate-900">
                                    {m.price === 0 ? <span className="text-emerald-600">ฟรี</span> : `฿${m.price}`}
                                </p>
                                {m.days !== "–" && <p className="text-[10px] text-slate-400 mt-0.5">{m.days} วัน</p>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="rounded-full px-6 border-slate-200 text-slate-600 hover:bg-slate-50">
                    <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
                </Button>
                <Button
                    onClick={() => onNext({ method: selected, price: methods.find(m => m.id === selected)?.price || 0 })}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 font-bold shadow-md shadow-slate-200 flex-1 h-11"
                >
                    ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}

function ConfirmOrder({ address, shipping, onBack, quotes }: { address: any; shipping: any; onBack: () => void, quotes: any[] }) {
    const [placed, setPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const pendingQuotes = quotes || [];
            
            if (pendingQuotes.length === 0) {
                alert("ไม่มีสินค้าในตะกร้าเหลือให้สั่งซื้อ");
                setLoading(false);
                return;
            }

            // คำนวณยอดรวม (ราคาสินค้า + ค่าจัดส่ง)
            const subtotal = pendingQuotes.reduce((sum: number, q: any) => sum + (q.priceDetail?.totalPrice || 0), 0);
            const total = subtotal + (shipping.price || 0);

            const quoteIds = pendingQuotes.map((q: any) => q._id);

            // 1. สร้างออเดอร์ในระบบของเรา
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quoteIds,
                    shippingAddress: {
                        fullName: `${address.firstName} ${address.lastName}`,
                        phone: `${address.countryCode} ${address.phone}`,
                        address: `${address.address} ${address.building || ""}`,
                        province: address.state,
                        zipCode: address.postal
                    },
                    paymentMethod: "paysolutions",
                    customerNotes: ""
                })
            });
            const data = await res.json();
            
            if (data.success) {
                // 2. สร้าง Form เพื่อส่งไป Paysolutions
                const form = document.createElement("form");
                form.method = "POST";
                // ใช้ endpoint ของ Thaiepay/Paysolutions
                form.action = "https://www.thaiepay.com/epaylink/payment.aspx";

                const origin = window.location.origin;

                const rawOrderNumber: string = data.data?.orderNumber || "";
                const refno = rawOrderNumber.replace(/[^0-9]/g, ""); // ตัดตัวอักษร/ขีดออก เหลือแต่ตัวเลข
                console.log("[Paysolutions] refno:", refno, "total:", total.toFixed(2), "rawOrderNumber:", rawOrderNumber);

                const params: Record<string, string> = {
                    merchantid: "77650214",
                    refno: refno,
                    customeremail: "customer@3dprint.com",
                    productdetail: "3D Print Service Order",
                    total: total.toFixed(2),
                    cardtype: "V,M,J,C,A,B,D,PP,WE,AL,TM,CT,P,X,AT,SHPP,SHPL,SHPD,SHPC",
                    returnurl: `${origin}/profile/orders`,
                    postbackurl: `${origin}/api/webhook/paysolutions`
                };

                for (const key in params) {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = params[key];
                    form.appendChild(input);
                }

                document.body.appendChild(form);
                form.submit(); // พุ่งไปหน้าจ่ายเงิน
            } else {
                alert("สร้างรายการสั่งซื้อไม่สำเร็จ: " + data.error);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง");
            setLoading(false);
        }
    };

    if (placed) {
        return (
            <div className="bg-white rounded-2xl border shadow-sm p-12 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2">สร้างรายการสั่งซื้อสำเร็จ</h2>
                <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">ข้อมูลของคุณได้รับการบันทึกแล้ว กรุณาไปที่หน้า Dashboard เพื่อเข้าชมและตรวจสอบสถานะการชำระเงินของคุณ</p>
                <Link href="/profile">
                    <Button className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200">
                        ไปที่แดชบอร์ด
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">3</div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-wide">ตรวจสอบคำสั่งซื้อ</h2>
                </div>

                {/* Address Summary */}
                <div className="bg-slate-50/80 rounded-xl p-5 mb-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ที่อยู่จัดส่ง</p>
                        <button onClick={onBack} className="text-[11px] text-slate-900 font-bold hover:underline">แก้ไข</button>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{address.firstName} {address.lastName}</p>
                    <p className="text-sm text-slate-600 mt-1">{address.address}{address.building ? `, ${address.building}` : ""}</p>
                    <p className="text-sm text-slate-600">{address.city}, {address.state} {address.postal}</p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {address.countryCode} {address.phone}</p>
                </div>

                {/* Shipping Summary */}
                <div className="bg-slate-50/80 rounded-xl p-5 mb-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ช่องทางการจัดส่ง</p>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">
                            {shipping.method === "kerry" ? "Kerry Express" : 
                             shipping.method === "flash" ? "Flash Express" : 
                             shipping.method === "ems" ? "ไปรษณีย์ไทย (EMS)" : "รับด้วยตนเอง"}
                        </p>
                        <p className="text-sm font-bold text-slate-900">{shipping.price === 0 ? <span className="text-emerald-600">ฟรี</span> : `฿${shipping.price}`}</p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 mb-6">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">ออเดอร์จะเสร็จสมบูรณ์เมื่อยื่นสลิปชำระเงิน เจ้าหน้าที่จะเริ่มทำการผลิตหลังการตรวจสอบสลิป</p>
                </div>

                <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 rounded-full py-6 text-base font-black text-white shadow-lg shadow-slate-200"
                >
                    {loading ? "กำลังบันทึกข้อมูล..." : "ยืนยันและสั่งซื้อสินค้า"}
                </Button>
            </div>

            <Button variant="outline" onClick={onBack} disabled={loading} className="rounded-full px-6 border-slate-200 text-slate-600 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
            </Button>
        </div>
    );
}

// ─── Summary Panel ───────────────────────────────────────────────────────────
function SummaryPanel({ shipping, quotes }: { shipping: any; quotes: any[] }) {
    const subtotal = quotes.reduce((sum, q) => sum + (q.priceDetail?.totalPrice || 0), 0);
    const shipFee = shipping?.price || 0;
    const total = subtotal + shipFee;

    return (
        <div className="bg-white border rounded-2xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">สรุปคำสั่งซื้อ</h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{quotes.length} รายการ</span>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">ราคาชิ้นงาน</span>
                    <span className="font-bold text-slate-900">฿{subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">ค่าจัดส่ง</span>
                    <span className="font-bold text-slate-900">{shipFee > 0 ? `฿${shipFee.toFixed(2)}` : <span className="text-emerald-600">ฟรี</span>}</span>
                </div>
                <div className="border-t border-dashed pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">ยอดชำระทั้งหมด</span>
                    <span className="text-xl font-black text-slate-900">฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 rounded-xl p-3">
                <Package className="w-3.5 h-3.5 shrink-0" />
                <span>ราคายังไม่รวม VAT 7%</span>
            </div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
// ─── Page ────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState<any>(null);
    const [shipping, setShipping] = useState<any>(null);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const addressId = params.get("addressId");
                const idsParam = params.get("ids");

                // ดึงข้อมูลตะกร้าเฉพาะไอเท็มที่ส่งมาจากหน้า Quote
                const checkoutUrl = idsParam ? `/api/checkout?ids=${idsParam}` : "/api/checkout";
                const resQuotes = await fetch(checkoutUrl);
                const dataQuotes = await resQuotes.json();

                // ดึงข้อมูล Profile ผู้ใช้ (เพื่อเอาที่อยู่) - ต้องชี้ไปที่ /api/profile/billing
                const resProfile = await fetch("/api/profile/billing");
                const dataProfile = await resProfile.json();

                if (dataQuotes.success && dataQuotes.data) {
                    setQuotes(dataQuotes.data);

                    let targetAddress = null;
                    if (dataProfile.user?.shippingAddresses?.length > 0) {
                        const addrs = dataProfile.user.shippingAddresses;
                        if (addressId) {
                            targetAddress = addrs.find((a: any) => a._id === addressId);
                        }
                        if (!targetAddress) {
                            targetAddress = addrs.find((a: any) => a.isDefault) || addrs[0];
                        }
                    }

                    if (targetAddress) {
                        setAddress({
                            firstName: targetAddress.receiverName || targetAddress.fullName || targetAddress.label || "Customer",
                            lastName: "",
                            company: "",
                            country: "Thailand",
                            state: targetAddress.province || "",
                            city: targetAddress.district || targetAddress.subDistrict || "",
                            address: targetAddress.address || "",
                            building: "",
                            postal: targetAddress.zipCode || targetAddress.postalCode || "",
                            phone: targetAddress.phone || "0000000000",
                            countryCode: "+66"
                        });
                        
                        // สมมติฐานราคา Kerry ตามรูป
                        setShipping({
                            method: "kerry",
                            price: 85
                        });
                        
                        // ข้ามไปหน้า Confirm Order เลย
                        setStep(3);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch checkout data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCheckoutData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-500 font-bold">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (quotes.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <Navbar />
                <main className="max-w-md mx-auto px-4 py-20 text-center">
                    <div className="bg-white rounded-3xl border shadow-sm p-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 border">
                            <Package className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">ไม่มีสินค้าในตะกร้า</h2>
                        <p className="text-sm text-slate-400 mb-8 leading-relaxed">ดูเหมือนคุณยังไม่ได้เพิ่มรายการพิมพ์ 3D หรือสินค้าถูกสั่งซื้อไปแล้วครับ</p>
                        <Link href="/quote">
                            <Button className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200">
                                ไปสั่งพิมพ์งาน 3D
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-10">
                {/* Back */}
                <Link href="/quote" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> กลับไปที่ตะกร้า
                </Link>

                <StepHeader current={step} />

                <div className="grid grid-cols-12 gap-8">
                    {/* Left */}
                    <div className="col-span-12 lg:col-span-8">
                        {step === 1 && (
                            <ShippingAddress
                                onNext={(data) => { setAddress(data); setStep(2); }}
                            />
                        )}
                        {step === 2 && (
                            <ShippingMethod
                                onNext={(data) => { setShipping(data); setStep(3); }}
                                onBack={() => setStep(1)}
                            />
                        )}
                        {step === 3 && (
                            <ConfirmOrder
                                address={address}
                                shipping={shipping}
                                onBack={() => setStep(2)}
                                quotes={quotes}
                            />
                        )}
                    </div>

                    {/* Right */}
                    <div className="col-span-12 lg:col-span-4">
                        <SummaryPanel shipping={shipping} quotes={quotes} />
                    </div>
                </div>
            </main>
        </div>
    );
}
