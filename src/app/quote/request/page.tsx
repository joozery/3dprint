"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import {
  Building2, User, ChevronRight, Loader2,
  CheckCircle2, AlertCircle, FileText, MapPin, Phone, Mail, Hash, ArrowLeft, Save, Truck
} from "lucide-react";

type BillingType = "individual" | "company";

interface BillingForm {
  type: BillingType;
  firstName: string; lastName: string; idCard: string;
  companyName: string; taxId: string; contactName: string;
  address: string; district: string; province: string; postalCode: string;
  phone: string; email: string; note: string;
}

const empty: BillingForm = {
  type: "individual",
  firstName: "", lastName: "", idCard: "",
  companyName: "", taxId: "", contactName: "",
  address: "", district: "", province: "", postalCode: "",
  phone: "", email: "", note: "",
};

interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  zipCode: string;
}

const emptyShipping: ShippingForm = {
  fullName: "",
  phone: "",
  address: "",
  province: "",
  zipCode: "",
};

/* ── Success Modal ─────────────────────────────────────────────── */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-slate-800 text-lg font-bold mb-2">ส่งใบเสนอราคาสำเร็จ!</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          ทีมงานได้รับข้อมูลของคุณแล้ว<br />
          จะติดต่อกลับภายใน <strong className="text-slate-600">24 ชั่วโมง</strong>
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-all"
        >
          ดูใบเสนอราคาของฉัน
        </button>
      </div>
    </div>
  );
}

/* ── Main Form ─────────────────────────────────────────────────── */
function QuoteRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids") || "";

  const [billingType, setBillingType] = useState<BillingType>("individual");
  const [form, setForm] = useState<BillingForm>(empty);
  const [shippingForm, setShippingForm] = useState<ShippingForm>(emptyShipping);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  const [saveBilling, setSaveBilling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchingBilling, setFetchingBilling] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const set = (key: keyof BillingForm, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const setShipping = (key: keyof ShippingForm, value: string) =>
    setShippingForm(prev => ({ ...prev, [key]: value }));

  // โหลด billing & shipping ที่บันทึกไว้
  useEffect(() => {
    Promise.all([
      fetch("/api/profile/billing").then(r => r.ok ? r.json() : {}),
      fetch("/api/profile/shipping").then(r => r.ok ? r.json() : {})
    ])
    .then(([billingData, shippingData]: [any, any]) => {
      if (billingData.billing) {
        setForm({ ...empty, ...billingData.billing, note: "" });
        setBillingType(billingData.billing.type || "individual");
      }
      if (shippingData.shippingAddress) {
        setShippingForm({ ...emptyShipping, ...shippingData.shippingAddress });
        setSameAsBilling(false);
      }
    })
    .catch(() => {})
    .finally(() => setFetchingBilling(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const payload = { ...form, type: billingType };

    try {
      const finalShipping = sameAsBilling ? {
        fullName: billingType === "company" ? form.contactName : `${form.firstName} ${form.lastName}`.trim() || form.companyName,
        phone: form.phone,
        address: `${form.address} ${form.district} ${form.province} ${form.postalCode}`.trim(),
        province: form.province,
        zipCode: form.postalCode,
      } : shippingForm;

      // 1. ยืนยัน quote + บันทึก billing และ shipping ใน quote
      const res = await fetch("/api/quote/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: ids.split(",").filter(Boolean), billing: payload, shipping: finalShipping }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      // 2. บันทึก billing และ shipping ไว้ใน profile (ถ้าเลือก)
      if (saveBilling) {
        await Promise.all([
          fetch("/api/profile/billing", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ billing: { ...payload, note: undefined } }),
          }),
          fetch("/api/profile/shipping", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shippingAddress: finalShipping }),
          })
        ]);
      }

      // 3. Clear cart from local storage
      const submittedIds = ids.split(",").filter(Boolean);
      const currentCart = JSON.parse(localStorage.getItem("guest_quote_ids") || "[]");
      const newCart = currentCart.filter((id: string) => !submittedIds.includes(id));
      localStorage.setItem("guest_quote_ids", JSON.stringify(newCart));
      window.dispatchEvent(new Event("cart_updated"));

      setShowSuccess(true);
    } catch (err: any) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 px-4 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all";
  const labelClass = "text-slate-600 text-xs font-semibold mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {showSuccess && (
        <SuccessModal 
          onClose={() => {
            const idArray = ids.split(",").filter(Boolean);
            if (idArray.length > 0) {
              // พาเข้าไปดูบิล/ใบแรกเลย ตามที่ผู้ใช้ต้องการ
              router.push(`/profile/quotes/${idArray[0]}`);
            } else {
              router.push("/profile/quotes");
            }
          }} 
        />
      )}

      <main className="flex-grow py-10">
        <div className="max-w-2xl mx-auto px-4">

          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> กลับ
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                <FileText size={16} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">ข้อมูลสำหรับออกใบเสนอราคา</h1>
            </div>
            <p className="text-slate-400 text-sm ml-12">กรุณากรอกข้อมูลผู้รับใบเสนอราคา เพื่อให้ทีมงานจัดทำเอกสารได้ถูกต้อง</p>
          </div>

          {fetchingBilling ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300" size={28} /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Type selector */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <p className={labelClass}>ประเภทผู้รับใบเสนอราคา</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: "individual", icon: User,      title: "บุคคลธรรมดา", sub: "สำหรับบุคคลทั่วไป" },
                    { key: "company",    icon: Building2,  title: "นิติบุคคล",   sub: "บริษัท / องค์กร" },
                  ] as const).map(({ key, icon: Icon, title, sub }) => (
                    <button key={key} type="button" onClick={() => { setBillingType(key); set("type", key); }}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${billingType === key ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${billingType === key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${billingType === key ? "text-blue-700" : "text-slate-700"}`}>{title}</p>
                        <p className="text-[11px] text-slate-400">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual */}
              {billingType === "individual" && (
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
                  <p className="text-slate-700 text-sm font-semibold flex items-center gap-2"><User size={14} className="text-blue-500" /> ข้อมูลบุคคล</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>ชื่อ <span className="text-red-400">*</span></label>
                      <input required type="text" placeholder="ชื่อ" value={form.firstName} onChange={e => set("firstName", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>นามสกุล <span className="text-red-400">*</span></label>
                      <input required type="text" placeholder="นามสกุล" value={form.lastName} onChange={e => set("lastName", e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>เลขบัตรประชาชน (ถ้ามี)</label>
                    <div className="relative"><Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input type="text" placeholder="X-XXXX-XXXXX-XX-X" value={form.idCard} onChange={e => set("idCard", e.target.value)} className={`${inputClass} pl-9`} maxLength={13} /></div>
                  </div>
                </div>
              )}

              {/* Company */}
              {billingType === "company" && (
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
                  <p className="text-slate-700 text-sm font-semibold flex items-center gap-2"><Building2 size={14} className="text-blue-500" /> ข้อมูลนิติบุคคล</p>
                  <div>
                    <label className={labelClass}>ชื่อบริษัท / องค์กร <span className="text-red-400">*</span></label>
                    <input required type="text" placeholder="บริษัท ... จำกัด" value={form.companyName} onChange={e => set("companyName", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>เลขประจำตัวผู้เสียภาษี <span className="text-red-400">*</span></label>
                    <div className="relative"><Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input required type="text" placeholder="0000000000000" value={form.taxId} onChange={e => set("taxId", e.target.value)} className={`${inputClass} pl-9`} maxLength={13} /></div>
                  </div>
                  <div>
                    <label className={labelClass}>ชื่อผู้ติดต่อ <span className="text-red-400">*</span></label>
                    <input required type="text" placeholder="ชื่อ-นามสกุล" value={form.contactName} onChange={e => set("contactName", e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
                <p className="text-slate-700 text-sm font-semibold flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> ที่อยู่สำหรับออกเอกสาร</p>
                <div>
                  <label className={labelClass}>ที่อยู่ <span className="text-red-400">*</span></label>
                  <input required type="text" placeholder="บ้านเลขที่ ถนน ซอย" value={form.address} onChange={e => set("address", e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className={labelClass}>แขวง/ตำบล</label><input type="text" placeholder="แขวง/ตำบล" value={form.district} onChange={e => set("district", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>จังหวัด <span className="text-red-400">*</span></label><input required type="text" placeholder="จังหวัด" value={form.province} onChange={e => set("province", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>รหัสไปรษณีย์</label><input type="text" placeholder="10000" value={form.postalCode} onChange={e => set("postalCode", e.target.value)} className={inputClass} maxLength={5} /></div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
                <p className="text-slate-700 text-sm font-semibold flex items-center gap-2"><Phone size={14} className="text-blue-500" /> ข้อมูลติดต่อ</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>เบอร์โทร <span className="text-red-400">*</span></label>
                    <div className="relative"><Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input required type="tel" placeholder="0X-XXXX-XXXX" value={form.phone} onChange={e => set("phone", e.target.value)} className={`${inputClass} pl-9`} /></div>
                  </div>
                  <div><label className={labelClass}>อีเมลรับเอกสาร <span className="text-red-400">*</span></label>
                    <div className="relative"><Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input required type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} className={`${inputClass} pl-9`} /></div>
                  </div>
                </div>
                <div><label className={labelClass}>หมายเหตุ</label>
                  <textarea placeholder="รายละเอียดเพิ่มเติม..." value={form.note} onChange={e => set("note", e.target.value)} rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all resize-none placeholder:text-slate-300" />
                </div>
              </div>

              {/* Shipping Flow */}
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
                <p className="text-slate-700 text-sm font-semibold flex items-center gap-2"><Truck size={14} className="text-blue-500" /> ข้อมูลสำหรับการจัดส่ง</p>
                
                <label className="flex items-center gap-3 cursor-pointer select-none border-b border-slate-100 pb-4">
                  <div onClick={() => setSameAsBilling(v => !v)}
                    className={`w-10 h-5 rounded-full flex items-center transition-all cursor-pointer ${sameAsBilling ? "bg-blue-600" : "bg-slate-200"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${sameAsBilling ? "ml-auto mr-0.5" : "ml-0.5"}`} />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">จัดส่งไปที่อยู่เดียวกันกับเอกสารใบเสนอราคา</span>
                </label>

                {!sameAsBilling && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>ชื่อผู้รับ <span className="text-red-400">*</span></label>
                        <input required type="text" placeholder="ชื่อผู้รับสินค้า" value={shippingForm.fullName} onChange={e => setShipping("fullName", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>เบอร์โทร <span className="text-red-400">*</span></label>
                        <input required type="tel" placeholder="0X-XXXX-XXXX" value={shippingForm.phone} onChange={e => setShipping("phone", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>ที่อยู่จัดส่ง <span className="text-red-400">*</span></label>
                      <input required type="text" placeholder="บ้านเลขที่ ถนน ซอย แขวง เขต" value={shippingForm.address} onChange={e => setShipping("address", e.target.value)} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>จังหวัด <span className="text-red-400">*</span></label>
                        <input required type="text" placeholder="จังหวัด" value={shippingForm.province} onChange={e => setShipping("province", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>รหัสไปรษณีย์ <span className="text-red-400">*</span></label>
                        <input required type="text" placeholder="10000" value={shippingForm.zipCode} onChange={e => setShipping("zipCode", e.target.value)} className={inputClass} maxLength={5} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save billing toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div onClick={() => setSaveBilling(v => !v)}
                  className={`w-10 h-5 rounded-full flex items-center transition-all cursor-pointer ${saveBilling ? "bg-blue-600" : "bg-slate-200"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${saveBilling ? "ml-auto mr-0.5" : "ml-0.5"}`} />
                </div>
                <span className="text-slate-600 text-xs font-medium flex items-center gap-1.5">
                  <Save size={12} className={saveBilling ? "text-blue-500" : "text-slate-300"} />
                  บันทึกข้อมูลนี้สำหรับครั้งหน้า
                </span>
              </label>

              {/* Error */}
              {feedback && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl border bg-red-50 text-red-600 border-red-200 text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{feedback}</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-lg shadow-slate-900/10 disabled:opacity-40 active:scale-95">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                {loading ? "กำลังส่ง..." : "ส่งใบเสนอราคา"}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function QuoteRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-slate-300" size={28} /></div>}>
      <QuoteRequestForm />
    </Suspense>
  );
}
