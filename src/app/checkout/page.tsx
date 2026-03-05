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
                            active ? "bg-blue-600 text-white shadow-md shadow-blue-200" :
                                done ? "bg-green-50 text-green-600" : "bg-white text-slate-400 border"
                        )}>
                            <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0",
                                active ? "bg-white/20" : done ? "bg-green-100" : "bg-slate-100"
                            )}>
                                {done ? <CheckCircle2 className="w-4 h-4" /> : step.n}
                            </div>
                            <span className="text-sm font-bold">{step.label}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={cn("h-0.5 flex-1 mx-2", done ? "bg-green-300" : "bg-slate-200")} />
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
            alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบก่อนครับ");
            return;
        }
        onNext({ ...form, type });
    };

    return (
        <div className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black">1</div>
                <h2 className="text-lg font-bold text-slate-900">ที่อยู่จัดส่ง</h2>
                <button className="ml-auto text-[11px] text-blue-600 font-bold flex items-center gap-1 hover:underline">
                    <MapPin className="w-3 h-3" /> ระบุตำแหน่งปัจจุบัน
                </button>
            </div>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    onClick={() => setType("company")}
                    className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-bold",
                        type === "company" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-500"
                    )}
                >
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0", type === "company" ? "border-blue-600 bg-blue-600" : "border-slate-300")} />
                    <Building2 className="w-4 h-4" /> บริษัท / นิติบุคคล
                </button>
                <button
                    onClick={() => setType("individual")}
                    className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-bold",
                        type === "individual" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-500"
                    )}
                >
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center", type === "individual" ? "border-blue-600" : "border-slate-300")}>
                        {type === "individual" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <User className="w-4 h-4" /> บุคคลทั่วไป
                </button>
            </div>

            {type === "company" && (
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">ชื่อบริษัท</label>
                    <input
                        placeholder="ชื่อบริษัท / นิติบุคคล"
                        value={form.company}
                        onChange={e => set("company", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">
                        ชื่อ <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="ชื่อ"
                        value={form.firstName}
                        onChange={e => set("firstName", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">
                        นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="นามสกุล"
                        value={form.lastName}
                        onChange={e => set("lastName", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">ประเทศ <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select
                            value={form.country}
                            onChange={e => set("country", e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 appearance-none"
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
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">จังหวัด <span className="text-red-500">*</span></label>
                    <input
                        placeholder="จังหวัด"
                        value={form.state}
                        onChange={e => set("state", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">เขต/อำเภอ <span className="text-red-500">*</span></label>
                    <input
                        placeholder="เขต / อำเภอ"
                        value={form.city}
                        onChange={e => set("city", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">ที่อยู่ <span className="text-red-500">*</span></label>
                    <input
                        placeholder="เลขที่บ้าน / ถนน / ซอย"
                        value={form.address}
                        onChange={e => set("address", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">อาคาร / หมู่บ้าน</label>
                    <input
                        placeholder="ชื่ออาคาร / หมู่บ้าน"
                        value={form.building}
                        onChange={e => set("building", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">รหัสไปรษณีย์ <span className="text-red-500">*</span></label>
                    <input
                        placeholder="รหัสไปรษณีย์"
                        value={form.postal}
                        onChange={e => set("postal", e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <select
                            value={form.countryCode}
                            onChange={e => set("countryCode", e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 w-20 shrink-0"
                        >
                            <option>+66</option>
                            <option>+1</option>
                            <option>+65</option>
                            <option>+81</option>
                        </select>
                        <input
                            placeholder="0xx-xxx-xxxx"
                            value={form.phone}
                            onChange={e => set("phone", e.target.value)}
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 h-11 font-bold shadow-md shadow-blue-100"
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
            desc: "ถนนลาดพล้าว กรุงเทพฯ (จันทร์–ศุกร์ 09:00–18:00)",
            price: 0,
            days: "–",
            logo: null,
            useIcon: true,
        },
        {
            id: "kerry",
            label: "Kerry Express",
            desc: "จัดส่งภายใน 1–3 วัน (ทั่วประเทศ)",
            price: 50,
            days: "1–3",
            logo: "/shipping/kerryexpress.png",
            useIcon: false,
        },
        {
            id: "flash",
            label: "Flash Express",
            desc: "จัดส่งภายใน 1–2 วัน",
            price: 45,
            days: "1–2",
            logo: "/shipping/fashexpress.png",
            useIcon: false,
        },
        {
            id: "ems",
            label: "ไปรษณีย์ไทย EMS",
            desc: "จัดส่งภายใน 2–5 วัน",
            price: 60,
            days: "2–5",
            logo: "/shipping/ems.jpeg",
            useIcon: false,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black">2</div>
                    <h2 className="text-lg font-bold text-slate-900">วิธีจัดส่ง</h2>
                </div>

                <div className="space-y-3">
                    {methods.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setSelected(m.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                                selected === m.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"
                            )}
                        >
                            {/* Radio */}
                            <div className={cn("w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center", selected === m.id ? "border-blue-600" : "border-slate-300")}>
                                {selected === m.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                            </div>

                            {/* Logo / Icon */}
                            <div className="w-14 h-10 flex items-center justify-center shrink-0">
                                {m.useIcon ? (
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <Warehouse className="w-5 h-5 text-slate-500" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-100 bg-white flex items-center justify-center p-1">
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
                                <p className="text-xs text-slate-500">{m.desc}</p>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-slate-900">
                                    {m.price === 0 ? <span className="text-green-600">ฟรี</span> : `฿${m.price}`}
                                </p>
                                {m.days !== "–" && <p className="text-[10px] text-slate-400">{m.days} วัน</p>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="rounded-full px-6 border-slate-300 text-slate-600">
                    <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
                </Button>
                <Button
                    onClick={() => onNext({ method: selected, price: methods.find(m => m.id === selected)?.price || 0 })}
                    className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 font-bold shadow-md shadow-blue-100 flex-1"
                >
                    ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}

// ─── Step 3: Confirm ─────────────────────────────────────────────────────────
function ConfirmOrder({ address, shipping, onBack }: { address: any; shipping: any; onBack: () => void }) {
    const [placed, setPlaced] = useState(false);

    if (placed) {
        return (
            <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">สั่งพิมพ์สำเร็จแล้วครับ! 🎉</h2>
                <p className="text-slate-500 mb-8">ทีมงานจะตรวจสอบไฟล์และติดต่อยืนยันคำสั่งซื้อภายใน 24 ชั่วโมงครับ</p>
                <Link href="/quote">
                    <Button className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 font-bold">
                        สั่งพิมพ์อีกชิ้น
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black">3</div>
                    <h2 className="text-lg font-bold text-slate-900">ยืนยันคำสั่งซื้อ</h2>
                </div>

                {/* Address Summary */}
                <div className="bg-slate-50 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ที่อยู่จัดส่ง</p>
                        <button onClick={onBack} className="text-[11px] text-blue-600 font-bold hover:underline">แก้ไข</button>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{address.firstName} {address.lastName}</p>
                    <p className="text-sm text-slate-600">{address.address}{address.building ? `, ${address.building}` : ""}</p>
                    <p className="text-sm text-slate-600">{address.city}, {address.state} {address.postal}</p>
                    <p className="text-sm text-slate-600">{address.country}</p>
                    <p className="text-sm text-slate-500 mt-1">{address.countryCode} {address.phone}</p>
                </div>

                {/* Shipping Summary */}
                <div className="bg-slate-50 rounded-xl p-5 mb-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">วิธีจัดส่ง</p>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">{shipping.method === "kerry" ? "Kerry Express" : shipping.method === "flash" ? "Flash Express" : shipping.method === "ems" ? "ไปรษณีย์ไทย EMS" : "รับด้วยตัวเอง"}</p>
                        <p className="text-sm font-bold text-blue-600">{shipping.price === 0 ? "ฟรี" : `฿${shipping.price}`}</p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">ราคาที่แสดงเป็นราคาประมาณการเบื้องต้น ทีมงานจะยืนยันราคาจริงอีกครั้งหลังตรวจสอบไฟล์ครับ</p>
                </div>

                <Button
                    onClick={() => setPlaced(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-6 text-base font-black shadow-lg shadow-blue-200"
                >
                    ยืนยันและสั่งพิมพ์ 🚀
                </Button>
            </div>

            <Button variant="outline" onClick={onBack} className="rounded-full px-6 border-slate-300 text-slate-600">
                <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
            </Button>
        </div>
    );
}

// ─── Summary Panel ───────────────────────────────────────────────────────────
function SummaryPanel({ shipping }: { shipping: any }) {
    const price = 4.43;
    const shipFee = shipping?.price || 0;
    const total = price + shipFee;

    return (
        <div className="bg-white border rounded-2xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Summary</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">1 items &gt;</button>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">ราคาชิ้นงาน</span>
                    <span className="font-bold text-slate-900">฿{price.toFixed(2)}</span>
                </div>
                {shipFee > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">ค่าจัดส่ง</span>
                        <span className="font-bold text-slate-900">฿{shipFee.toFixed(2)}</span>
                    </div>
                )}
                <div className="border-t pt-2 flex justify-between">
                    <span className="text-sm font-bold text-slate-900">ยอดรวม</span>
                    <span className="text-xl font-black text-orange-500">฿{total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 rounded-lg p-3">
                <Package className="w-3.5 h-3.5 shrink-0" />
                <span>ราคายังไม่รวม VAT 7%</span>
            </div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState<any>(null);
    const [shipping, setShipping] = useState<any>(null);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-10">
                {/* Back */}
                <Link href="/quote" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
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
                            />
                        )}
                    </div>

                    {/* Right */}
                    <div className="col-span-12 lg:col-span-4">
                        <SummaryPanel shipping={shipping} />
                    </div>
                </div>
            </main>
        </div>
    );
}
