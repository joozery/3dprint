"use client";

import { useState, useEffect } from "react";
import { Settings, Building2, User, Save, Loader2, CheckCircle2, AlertCircle, MapPin, Phone, Mail, Hash } from "lucide-react";

type BillingType = "individual" | "company";

interface BillingForm {
  type: BillingType;
  firstName: string; lastName: string; idCard: string;
  companyName: string; taxId: string; contactName: string;
  address: string; district: string; province: string; postalCode: string;
  phone: string; email: string;
}

const empty: BillingForm = {
  type: "individual",
  firstName: "", lastName: "", idCard: "",
  companyName: "", taxId: "", contactName: "",
  address: "", district: "", province: "", postalCode: "",
  phone: "", email: "",
};

export default function BillingClientForm() {
  const [billingType, setBillingType] = useState<BillingType>("individual");
  const [form, setForm] = useState<BillingForm>(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const set = (key: keyof BillingForm, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    fetch("/api/profile/billing")
      .then(r => r.json())
      .then(({ billing }) => {
        if (billing) {
          setForm({ ...empty, ...billing });
          setBillingType(billing.type || "individual");
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/profile/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing: { ...form, type: billingType } }),
      });
      if (!res.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");
      setFeedback({ text: "บันทึกข้อมูลการออกใบเสนอราคาสำเร็จ", type: "success" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-10 px-3 rounded-md border border-slate-300 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors shadow-sm";
  const labelClass = "text-slate-700 text-[13px] font-semibold mb-1.5 block";
  const sectionTitleClass = "text-sm font-semibold text-slate-900";
  const sectionDescClass = "text-[13px] text-slate-500 mt-1 leading-relaxed";

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">ตั้งค่าข้อมูลการออกเอกสาร</h1>
        <p className="text-slate-500 text-sm mt-1">จัดการข้อมูลผู้เสียภาษี สำหรับใช้ระบบตั้งต้นในการขอใบเสนอราคา หรือใบกำกับภาษี</p>
      </div>

      {fetching ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-300" size={32} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section: Entity Type */}
          <div className="flex flex-col md:flex-row gap-8 border-t border-slate-200 pt-8">
            <div className="w-full md:w-1/3 shrink-0">
              <h2 className={sectionTitleClass}>ประเภทผู้เสียภาษี</h2>
              <p className={sectionDescClass}>เลือกประเภทบัญชี เพื่อกำหนดรูปแบบข้อมูลที่ต้องกรอกในเอกสารทางกฎหมายให้ถูกต้อง</p>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex font-medium text-sm">
                <button
                  type="button"
                  onClick={() => setBillingType("individual")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors ${
                    billingType === "individual" 
                      ? "bg-slate-900 text-white" 
                      : "bg-transparent text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <User size={16} /> บุคคลธรรมดา
                </button>
                <div className="w-px bg-slate-200"></div>
                <button
                  type="button"
                  onClick={() => setBillingType("company")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors ${
                    billingType === "company" 
                      ? "bg-slate-900 text-white" 
                      : "bg-transparent text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building2 size={16} /> นิติบุคคล
                </button>
              </div>
            </div>
          </div>

          {/* Section: Tax Information */}
          <div className="flex flex-col md:flex-row gap-8 border-t border-slate-200 pt-8">
            <div className="w-full md:w-1/3 shrink-0">
              <h2 className={sectionTitleClass}>ข้อมูลรายละเอียด</h2>
              <p className={sectionDescClass}>ระบุชื่อ-นามสกุล หรือชื่อบริษัท พร้อมเลขประจำตัวผู้เสียภาษีอากรให้ครบถ้วน</p>
            </div>
            
            <div className="w-full md:w-2/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="space-y-5">
                {billingType === "individual" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClass}>ชื่อจริง</label><input type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)} className={inputClass} placeholder="เช่น สมรรถชัย" /></div>
                      <div><label className={labelClass}>นามสกุล</label><input type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)} className={inputClass} placeholder="เช่น ใจดี" /></div>
                    </div>
                    <div>
                      <label className={labelClass}>เลขประจำตัวประชาชน <span className="text-slate-400 font-normal">(ระบุหรือไม่ก็ได้)</span></label>
                      <input type="text" value={form.idCard} onChange={e => set("idCard", e.target.value)} className={inputClass} placeholder="X-XXXX-XXXXX-XX-X" maxLength={13} />
                    </div>
                  </>
                ) : (
                  <>
                    <div><label className={labelClass}>ชื่อบริษัท / นิติบุคคล</label><input type="text" value={form.companyName} onChange={e => set("companyName", e.target.value)} className={inputClass} placeholder="บริษัท..." /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className={labelClass}>เลขประจำตัวผู้เสียภาษีอากร</label><input type="text" value={form.taxId} onChange={e => set("taxId", e.target.value)} className={inputClass} placeholder="เลข 13 หลัก" maxLength={13} /></div>
                      <div><label className={labelClass}>ชื่อผู้ติดต่อประสานงาน</label><input type="text" value={form.contactName} onChange={e => set("contactName", e.target.value)} className={inputClass} /></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div className="flex flex-col md:flex-row gap-8 border-t border-slate-200 pt-8">
            <div className="w-full md:w-1/3 shrink-0">
              <h2 className={sectionTitleClass}>ที่อยู่สำหรับออกเอกสาร</h2>
              <p className={sectionDescClass}>ที่อยู่จดทะเบียนตามบัตรประชาชน หรือที่ตั้งสำนักงานใหญ่เพื่อใช้ในใบกำกับภาษี</p>
            </div>
            
            <div className="w-full md:w-2/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="space-y-5">
                <div><label className={labelClass}>รายละเอียดที่อยู่</label><input type="text" value={form.address} onChange={e => set("address", e.target.value)} className={inputClass} placeholder="บ้านเลขที่ อาคาร ชั้น ถนน..." /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1"><label className={labelClass}>แขวง / ตำบล</label><input type="text" value={form.district} onChange={e => set("district", e.target.value)} className={inputClass} /></div>
                  <div className="col-span-1"><label className={labelClass}>เขต / จังหวัด</label><input type="text" value={form.province} onChange={e => set("province", e.target.value)} className={inputClass} /></div>
                  <div className="col-span-1"><label className={labelClass}>รหัสไปรษณีย์</label><input type="text" value={form.postalCode} onChange={e => set("postalCode", e.target.value)} className={inputClass} maxLength={5} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="flex flex-col md:flex-row gap-8 border-t border-slate-200 pt-8">
            <div className="w-full md:w-1/3 shrink-0">
              <h2 className={sectionTitleClass}>ช่องทางการติดต่อ</h2>
              <p className={sectionDescClass}>สำหรับส่งใบกำกับภาษีอิเล็กทรอนิกส์ (E-Tax) และติดต่อยืนยันการจัดส่ง</p>
            </div>
            
            <div className="w-full md:w-2/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>เบอร์โทรศัพท์</label>
                  <div className="relative"><span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">+66</span><input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} className={`${inputClass} pl-10`} /></div>
                </div>
                <div>
                  <label className={labelClass}>อีเมลรับเอกสาร</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-slate-200 pt-8 pb-4">
            {feedback && (
              <span className={`text-sm font-medium ${feedback.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                {feedback.text}
              </span>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 text-white text-[13px] font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "บันทึกข้อมูล"}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
