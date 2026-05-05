"use client";

import { useState, useEffect } from "react";
import { User, Building2, Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Plus, Star, Trash2, Edit3, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BillingType = "individual" | "company";

interface Address {
  _id?: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  subDistrict: string;
  province: string;
  zipCode: string;
  isDefault: boolean;
}

interface UnifiedForm {
  billingType: BillingType;
  // Individual / Account Info
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  
  // Corporate Info
  companyName: string;
  companyNameEng: string;
  taxId: string;
  branchCode: string;
  isVatRegistered: boolean;
  industry: string;
  contactName: string;
  officePhone: string;
  corporateEmail: string;
  website: string;
  companySize: string;

  shippingAddresses: Address[];
}

const empty: UnifiedForm = {
  billingType: "individual",
  fullName: "", email: "", phone: "",
  companyName: "", companyNameEng: "", taxId: "", branchCode: "00000",
  isVatRegistered: false, industry: "Electronics", contactName: "",
  officePhone: "", corporateEmail: "", website: "", companySize: "51-200",
  shippingAddresses: []
};

export default function UnifiedProfileForm() {
  const [form, setForm] = useState<UnifiedForm>(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const set = (key: keyof UnifiedForm, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    fetch("/api/profile/billing")
      .then(r => r.json())
      .then(({ user, billing }) => {
        if (user) {
          setForm(prev => ({ 
            ...prev, 
            ...billing,
            fullName: billing?.firstName && billing?.lastName 
                ? `${billing.firstName} ${billing.lastName}` 
                : user.name || "",
            email: user.email || "",
            phone: billing?.phone || user.phone || "",
            billingType: billing?.type || "individual",
            corporateEmail: billing?.email || user.email || "",
            companySize: billing?.companySize || "51-200",
            industry: billing?.industry || "Electronics",
            branchCode: billing?.branchCode || "00000",
            shippingAddresses: user.shippingAddresses || []
          }));
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const nameParts = form.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const res = await fetch("/api/profile/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          billing: { 
            ...form, 
            type: form.billingType, 
            email: form.corporateEmail,
            firstName,
            lastName
          },
          shippingAddresses: form.shippingAddresses
        }),
      });
      if (!res.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");
      setFeedback({ text: "บันทึกข้อมูลสำเร็จแล้ว", type: "success" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = (index: number) => {
    const updated = form.shippingAddresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    set("shippingAddresses", updated);
  };

  const handleDeleteAddress = (index: number) => {
    const updated = form.shippingAddresses.filter((_, i) => i !== index);
    set("shippingAddresses", updated);
  };

  const handleSaveAddress = (addr: Address) => {
    let updated = [...form.shippingAddresses];
    if (editingAddress?._id) {
        updated = updated.map(a => a._id === editingAddress._id ? addr : a);
    } else {
        updated.push({ ...addr, _id: Date.now().toString() });
    }
    set("shippingAddresses", updated);
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-slate-300" size={32} />
      </div>
    );
  }

  const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] font-bold text-slate-700 placeholder:text-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-all bg-white";
  const labelClass = "text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2 block";
  const bentoClass = "bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm mb-6";

  return (
    <form onSubmit={handleSubmit} className="max-w-[1000px] mx-auto w-full pb-20">
      
      {/* Header with Save Button */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-tight">โปรไฟล์</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-sm">ข้อมูลบัญชีของคุณ</p>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> บันทึก</>}
        </button>
      </div>

      {feedback && (
        <div className={cn("mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2", feedback.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100")}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-black">{feedback.text}</span>
        </div>
      )}

      {/* 1. Account Type */}
      <div className={bentoClass}>
        <h3 className={labelClass}>ประเภทบัญชี</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={cn(
            "relative flex items-center gap-4 p-5 rounded-[20px] border-2 cursor-pointer transition-all",
            form.billingType === 'individual' ? "bg-slate-50 border-blue-600" : "bg-white border-slate-100 hover:border-slate-200"
          )}>
            <input type="radio" className="hidden" checked={form.billingType === 'individual'} onChange={() => set("billingType", "individual")} />
            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", form.billingType === 'individual' ? "border-blue-600" : "border-slate-200")}>
              {form.billingType === 'individual' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
            </div>
            <div>
              <div className="text-sm font-black text-slate-800">บุคคลธรรมดา</div>
              <div className="text-[11px] font-bold text-slate-400">ใช้ส่วนตัว</div>
            </div>
          </label>
          <label className={cn(
            "relative flex items-center gap-4 p-5 rounded-[20px] border-2 cursor-pointer transition-all",
            form.billingType === 'company' ? "bg-slate-50 border-blue-600" : "bg-white border-slate-100 hover:border-slate-200"
          )}>
            <input type="radio" className="hidden" checked={form.billingType === 'company'} onChange={() => set("billingType", "company")} />
            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", form.billingType === 'company' ? "border-blue-600" : "border-slate-200")}>
              {form.billingType === 'company' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
            </div>
            <div>
              <div className="text-sm font-black text-slate-800">นิติบุคคล</div>
              <div className="text-[11px] font-bold text-slate-400">ออกใบกำกับภาษีในนามบริษัท</div>
            </div>
          </label>
        </div>
      </div>

      {/* 2. Individual Info */}
      <div className={bentoClass}>
        <div className="mb-8">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">บุคคลธรรมดา</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ข้อมูลติดต่อหลัก</p>
        </div>
        <div className="mb-6">
          <label className={labelClass}>ชื่อ-นามสกุล</label>
          <input type="text" value={form.fullName} onChange={e => set("fullName", e.target.value)} className={inputClass} placeholder="สมชาย วิศวกร" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div><label className={labelClass}>อีเมล</label><input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} placeholder="somchai@siaminnovation.co.th" /></div>
          <div><label className={labelClass}>เบอร์โทร</label><input type="text" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass} placeholder="+66 81 234 5678" /></div>
        </div>
        <div>
          <label className={labelClass}>รหัสผ่าน</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input type={showPassword ? "text" : "password"} value=".........." readOnly className={cn(inputClass, "bg-slate-50 border-slate-100")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="button" className="px-6 h-11 bg-white border border-slate-200 rounded-xl font-black text-[13px] text-slate-600 hover:bg-slate-50 transition-all">เปลี่ยน</button>
          </div>
        </div>
      </div>

      {/* 3. Corporate Info */}
      <div className={bentoClass}>
        <div className="mb-8">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">นิติบุคคล</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ข้อมูลนิติบุคคลสำหรับออกใบกำกับภาษี</p>
        </div>
        <div className="space-y-6">
          <div><label className={labelClass}>ชื่อบริษัท (ไทย)</label><input type="text" value={form.companyName} onChange={e => set("companyName", e.target.value)} className={inputClass} placeholder="บริษัท สยาม อินโนเวชั่น จำกัด" /></div>
          <div><label className={labelClass}>ชื่อบริษัท (อังกฤษ)</label><input type="text" value={form.companyNameEng} onChange={e => set("companyNameEng", e.target.value)} className={inputClass} placeholder="Siam Innovation Co., Ltd." /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>เลขประจำตัวผู้เสียภาษี</label><input type="text" value={form.taxId} onChange={e => set("taxId", e.target.value)} className={inputClass} placeholder="0-1055-61234-56-7" /></div>
            <div><label className={labelClass}>รหัสสาขา</label><input type="text" value={form.branchCode} onChange={e => set("branchCode", e.target.value)} className={inputClass} placeholder="00001" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.isVatRegistered} onChange={e => set("isVatRegistered", e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <div className="text-[12px] font-bold text-slate-600">จดทะเบียนแล้ว · มี VAT 7%</div>
            </div>
            <div><label className={labelClass}>อุตสาหกรรม</label><input type="text" value={form.industry} onChange={e => set("industry", e.target.value)} className={inputClass} placeholder="Electronics" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>ผู้ติดต่อ</label><input type="text" value={form.contactName} onChange={e => set("contactName", e.target.value)} className={inputClass} placeholder="สมชาย วิศวกร" /></div>
            <div><label className={labelClass}>เบอร์บริษัท</label><input type="text" value={form.officePhone} onChange={e => set("officePhone", e.target.value)} className={inputClass} placeholder="+66 2 610 9999" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>อีเมลบริษัท</label><input type="email" value={form.corporateEmail} onChange={e => set("corporateEmail", e.target.value)} className={inputClass} placeholder="info@siaminnovation.co.th" /></div>
            <div><label className={labelClass}>เว็บไซต์</label><input type="text" value={form.website} onChange={e => set("website", e.target.value)} className={inputClass} placeholder="siaminnovation.co.th" /></div>
          </div>
          <div>
            <label className={labelClass}>ขนาดบริษัท</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["1-10", "11-50", "51-200", "201+"].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => set("companySize", size)}
                  className={cn(
                    "py-3 rounded-xl font-black text-[12px] transition-all border",
                    form.companySize === size ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Shipping Addresses Section */}
      <div id="shipping-addresses" className="mb-10 mt-12 scroll-mt-24">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight">ที่อยู่</h2>
                <p className="text-slate-400 font-bold text-sm">ที่อยู่จัดส่งของคุณ</p>
            </div>
            <button 
                type="button"
                onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
                <Plus size={14} /> เพิ่มที่อยู่
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.shippingAddresses.length > 0 ? form.shippingAddresses.map((addr, idx) => (
                <div 
                    key={addr._id || idx}
                    className={cn(
                        "relative bg-white border-2 rounded-[24px] p-6 shadow-sm transition-all",
                        addr.isDefault ? "border-blue-600 ring-4 ring-blue-50/50" : "border-slate-100 hover:border-slate-200"
                    )}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-[15px] font-black text-slate-800">{addr.label}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TH · {addr.zipCode}</span>
                            </div>
                        </div>
                        {addr.isDefault && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                <Star size={10} className="fill-emerald-600" />
                                <span className="text-[10px] font-black uppercase">ค่าเริ่มต้น</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1 mb-6">
                        <p className="text-[13px] font-bold text-slate-700">{addr.fullName}</p>
                        <p className="text-[12px] font-medium text-slate-500">{addr.phone}</p>
                        <p className="text-[12px] font-medium text-slate-400 leading-relaxed mt-2">
                            {addr.address} {addr.subDistrict} {addr.district} {addr.province} {addr.zipCode}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            type="button" 
                            onClick={() => { setEditingAddress(addr); setShowAddressModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            <Edit3 size={12} /> แก้ไข
                        </button>
                        {!addr.isDefault && (
                            <button 
                                type="button" 
                                onClick={() => handleSetDefaultAddress(idx)}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                ตั้งเป็นค่าเริ่มต้น
                            </button>
                        )}
                        <button 
                            type="button" 
                            onClick={() => handleDeleteAddress(idx)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all border border-red-100"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>
            )) : (
                <div className="md:col-span-2 py-16 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
                        <MapPin size={32} />
                    </div>
                    <p className="text-[15px] font-bold text-slate-800">ยังไม่มีที่อยู่สำหรับจัดส่ง</p>
                    <p className="text-sm text-slate-400 mt-1">เพิ่มที่อยู่ใหม่เพื่อความสะดวกรวดเร็วในการสั่งพิมพ์</p>
                </div>
            )}
        </div>
      </div>

      {/* Simplified Address Modal / Form Overlay */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex justify-between items-center px-7 pt-7 pb-4 shrink-0">
                    <div>
                        <h2 className="text-[18px] font-black text-slate-900 leading-tight">{editingAddress ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">กรอกรายละเอียดสถานที่จัดส่ง</p>
                    </div>
                    <button type="button" onClick={() => setShowAddressModal(false)} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="px-7 py-2 overflow-y-auto no-scrollbar space-y-5 flex-1">
                    <div><label className={labelClass}>ชื่อสถานที่ (เช่น บ้าน, ออฟฟิศ)</label><input type="text" id="modal-label" defaultValue={editingAddress?.label} className={inputClass} placeholder="ออฟฟิศสำนักงานใหญ่" /></div>
                    <div><label className={labelClass}>ชื่อ-นามสกุล ผู้รับ</label><input type="text" id="modal-name" defaultValue={editingAddress?.fullName} className={inputClass} placeholder="คุณสมชาย วิศวกร" /></div>
                    <div><label className={labelClass}>เบอร์โทรศัพท์</label><input type="text" id="modal-phone" defaultValue={editingAddress?.phone} className={inputClass} placeholder="+66 2 610 9999" /></div>
                    <div><label className={labelClass}>ที่อยู่ (บ้านเลขที่, อาคาร, ถนน)</label><textarea id="modal-address" defaultValue={editingAddress?.address} className={cn(inputClass, "h-20 py-3")} placeholder="88/12 อาคารสยามพารากอน ชั้น 4" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>แขวง/ตำบล</label><input type="text" id="modal-subDistrict" defaultValue={editingAddress?.subDistrict} className={inputClass} placeholder="ปทุมวัน" /></div>
                        <div><label className={labelClass}>เขต/อำเภอ</label><input type="text" id="modal-district" defaultValue={editingAddress?.district} className={inputClass} placeholder="ปทุมวัน" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>จังหวัด</label><input type="text" id="modal-province" defaultValue={editingAddress?.province} className={inputClass} placeholder="กรุงเทพมหานคร" /></div>
                        <div><label className={labelClass}>รหัสไปรษณีย์</label><input type="text" id="modal-zip" defaultValue={editingAddress?.zipCode} className={inputClass} placeholder="10330" /></div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 px-7 pt-4 pb-7 shrink-0 border-t border-slate-50">
                    <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 h-11 rounded-xl border border-slate-200 font-black text-xs text-slate-500 hover:bg-slate-50 transition-all">ยกเลิก</button>
                    <button 
                        type="button" 
                        onClick={() => {
                            const newAddr: Address = {
                                _id: editingAddress?._id || Date.now().toString(),
                                label: (document.getElementById('modal-label') as HTMLInputElement).value,
                                fullName: (document.getElementById('modal-name') as HTMLInputElement).value,
                                phone: (document.getElementById('modal-phone') as HTMLInputElement).value,
                                address: (document.getElementById('modal-address') as HTMLTextAreaElement).value,
                                subDistrict: (document.getElementById('modal-subDistrict') as HTMLInputElement).value,
                                district: (document.getElementById('modal-district') as HTMLInputElement).value,
                                province: (document.getElementById('modal-province') as HTMLInputElement).value,
                                zipCode: (document.getElementById('modal-zip') as HTMLInputElement).value,
                                isDefault: editingAddress?.isDefault || form.shippingAddresses.length === 0
                            };
                            handleSaveAddress(newAddr);
                        }}
                        className="flex-[2] h-11 px-8 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
      )}
    </form>
  );
}
