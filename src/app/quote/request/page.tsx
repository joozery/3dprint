"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import {
  Building2, User, ChevronRight, Loader2,
  CheckCircle2, AlertCircle, FileText, MapPin, Phone, Mail, Hash, ArrowLeft, Save, Package, Globe
} from "lucide-react";

type BillingType = "individual" | "company";

interface BillingForm {
  type: BillingType;
  firstName: string; lastName: string; idCard: string;
  companyName: string; taxId: string; contactName: string;
  address: string; district: string; province: string; postalCode: string;
  phone: string; email: string; note: string;
}

interface SavedAddress {
  _id: string;
  label: string;
  receiverName?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  district?: string;
  subDistrict?: string;
  province?: string;
  zipCode?: string;
  isInternational?: boolean;
  countryCode?: string;
}

const empty: BillingForm = {
  type: "individual",
  firstName: "", lastName: "", idCard: "",
  companyName: "", taxId: "", contactName: "",
  address: "", district: "", province: "", postalCode: "",
  phone: "", email: "", note: "",
};

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

function QuoteRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids") || "";
  const addressId = searchParams.get("addressId") || "";

  const [billingType, setBillingType] = useState<BillingType>("individual");
  const [form, setForm] = useState<BillingForm>(empty);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [saveBilling, setSaveBilling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const set = (key: keyof BillingForm, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    // /api/profile/billing returns { user, billing } — user includes shippingAddresses
    fetch("/api/profile/billing")
    .then(r => r.ok ? r.json() : {})
    .then((data: any) => {
      if (data.billing) {
        setForm({ ...empty, ...data.billing, note: "" });
        setBillingType(data.billing.type || "individual");
      }
      const addresses: SavedAddress[] = data?.user?.shippingAddresses || [];
      if (addressId && addresses.length > 0) {
        const found = addresses.find((a: SavedAddress) => String(a._id) === String(addressId));
        setSelectedAddress(found || addresses[0]);
      } else if (!addressId && addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    })
    .catch(() => {})
    .finally(() => setFetchingData(false));
  }, [addressId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const payload = { ...form, type: billingType };

    try {
      const shippingForQuote = selectedAddress ? {
        fullName:  selectedAddress.receiverName || selectedAddress.fullName || "",
        phone:     selectedAddress.phone || "",
        address:   selectedAddress.address || "",
        province:  selectedAddress.province || "",
        zipCode:   selectedAddress.zipCode || "",
      } : {
        fullName: billingType === "company"
          ? form.contactName
          : `${form.firstName} ${form.lastName}`.trim(),
        phone:    form.phone,
        address:  `${form.address} ${form.district} ${form.province} ${form.postalCode}`.trim(),
        province: form.province,
        zipCode:  form.postalCode,
      };

      const res = await fetch("/api/quote/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: ids.split(",").filter(Boolean),
          billing: payload,
          shipping: shippingForQuote,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      if (saveBilling) {
        await fetch("/api/profile/billing", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ billing: { ...payload, note: undefined } }),
        });
      }

      const submittedIds = ids.split(",").filter(Boolean);
      const currentCart = JSON.parse(localStorage.getItem("guest_quote_ids") || "[]");
      localStorage.setItem("guest_quote_ids", JSON.stringify(
        currentCart.filter((id: string) => !submittedIds.includes(id))
      ));
      window.dispatchEvent(new Event("cart_updated"));

      setShowSuccess(true);
    } catch (err: any) {
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all";
  const labelClass = "text-slate-500 text-xs font-semibold mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {showSuccess && (
        <SuccessModal
          onClose={() => {
            const idArray = ids.split(",").filter(Boolean);
            router.push(idArray.length > 0 ? `/profile/quotes/${idArray[0]}` : "/profile/quotes");
          }}
        />
      )}

      <main className="flex-grow py-10">
        <div className="max-w-2xl mx-auto px-4">

          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-6 transition-colors font-medium">
            <ArrowLeft size={15} /> กลับ
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900 mb-1">ยืนยันใบเสนอราคา</h1>
            <p className="text-slate-400 text-sm">กรอกข้อมูลสำหรับออกเอกสาร — ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง</p>
          </div>

          {fetchingData ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300" size={28} /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Shipping Address Card ── */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Package size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">ที่อยู่จัดส่ง</p>
                    <p className="text-[11px] text-slate-400">ที่อยู่ที่เลือกไว้จากหน้าก่อนหน้า</p>
                  </div>
                </div>

                {selectedAddress ? (
                  <div className="px-5 py-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900">
                          {selectedAddress.receiverName || selectedAddress.fullName || "—"}
                        </p>
                        {selectedAddress.label && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
                            {selectedAddress.label}
                          </span>
                        )}
                        {selectedAddress.isInternational && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full border border-purple-100">
                            <Globe size={9} /> ต่างประเทศ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {selectedAddress.address}
                        {selectedAddress.subDistrict && `, ${selectedAddress.subDistrict}`}
                        {selectedAddress.district && `, ${selectedAddress.district}`}
                        {selectedAddress.province && `, ${selectedAddress.province}`}
                        {selectedAddress.zipCode && ` ${selectedAddress.zipCode}`}
                      </p>
                      {selectedAddress.phone && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Phone size={10} /> {selectedAddress.phone}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-4 flex items-center gap-3 text-slate-400">
                    <MapPin size={14} />
                    <p className="text-sm">ไม่พบที่อยู่ที่เลือก — ระบบจะใช้ที่อยู่จากข้อมูลผู้รับใบแทน</p>
                  </div>
                )}
              </div>

              {/* ── Billing Type ── */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
                <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-blue-500" /> ข้อมูลออกใบเสนอราคา
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {([
                    { key: "individual", icon: User,     title: "บุคคลธรรมดา", sub: "สำหรับบุคคลทั่วไป" },
                    { key: "company",    icon: Building2, title: "นิติบุคคล",   sub: "บริษัท / องค์กร" },
                  ] as const).map(({ key, icon: Icon, title, sub }) => (
                    <button key={key} type="button"
                      onClick={() => { setBillingType(key); set("type", key); }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                        billingType === key ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-slate-200 bg-slate-50"
                      }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        billingType === key ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                      }`}>
                        <Icon size={15} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${billingType === key ? "text-blue-700" : "text-slate-600"}`}>{title}</p>
                        <p className="text-[10px] text-slate-400">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {billingType === "individual" ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
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
                        <div className="relative">
                          <Hash size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input type="text" placeholder="X-XXXX-XXXXX-XX-X" value={form.idCard} onChange={e => set("idCard", e.target.value)} className={`${inputClass} pl-9`} maxLength={13} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className={labelClass}>ชื่อบริษัท / องค์กร <span className="text-red-400">*</span></label>
                        <input required type="text" placeholder="บริษัท ... จำกัด" value={form.companyName} onChange={e => set("companyName", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>เลขประจำตัวผู้เสียภาษี <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <Hash size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input required type="text" placeholder="0000000000000" value={form.taxId} onChange={e => set("taxId", e.target.value)} className={`${inputClass} pl-9`} maxLength={13} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>ชื่อผู้ติดต่อ <span className="text-red-400">*</span></label>
                        <input required type="text" placeholder="ชื่อ-นามสกุล" value={form.contactName} onChange={e => set("contactName", e.target.value)} className={inputClass} />
                      </div>
                    </>
                  )}

                  {/* Address for billing doc */}
                  <div>
                    <label className={labelClass}>ที่อยู่ (สำหรับออกเอกสาร) <span className="text-red-400">*</span></label>
                    <input required type="text" placeholder="บ้านเลขที่ ถนน ซอย" value={form.address} onChange={e => set("address", e.target.value)} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>แขวง/ตำบล</label>
                      <input type="text" placeholder="แขวง/ตำบล" value={form.district} onChange={e => set("district", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>จังหวัด <span className="text-red-400">*</span></label>
                      <input required type="text" placeholder="จังหวัด" value={form.province} onChange={e => set("province", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>รหัสไปรษณีย์</label>
                      <input type="text" placeholder="10000" value={form.postalCode} onChange={e => set("postalCode", e.target.value)} className={inputClass} maxLength={5} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Contact ── */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 space-y-3">
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Phone size={14} className="text-blue-500" /> ข้อมูลติดต่อ
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>เบอร์โทร <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input required type="tel" placeholder="0X-XXXX-XXXX" value={form.phone} onChange={e => set("phone", e.target.value)} className={`${inputClass} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>อีเมล <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input required type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} className={`${inputClass} pl-9`} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>หมายเหตุ</label>
                  <textarea
                    placeholder="รายละเอียดเพิ่มเติม..."
                    value={form.note}
                    onChange={e => set("note", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all resize-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Save toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none px-1">
                <div
                  onClick={() => setSaveBilling(v => !v)}
                  className={`w-10 h-5 rounded-full flex items-center transition-all cursor-pointer ${saveBilling ? "bg-blue-600" : "bg-slate-200"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${saveBilling ? "ml-auto mr-0.5" : "ml-0.5"}`} />
                </div>
                <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                  <Save size={11} className={saveBilling ? "text-blue-500" : "text-slate-300"} />
                  บันทึกข้อมูลนี้สำหรับครั้งหน้า
                </span>
              </label>

              {/* Error */}
              {feedback && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl border bg-red-50 text-red-600 border-red-100 text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{feedback}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-lg shadow-slate-900/10 disabled:opacity-40 active:scale-[0.98]"
              >
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-300" size={28} />
      </div>
    }>
      <QuoteRequestForm />
    </Suspense>
  );
}
