"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, User, Save, Loader2, Map, Truck, Navigation, Package } from "lucide-react";
import { toast } from "sonner";

interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  zipCode: string;
}

const empty: ShippingForm = {
  fullName: "",
  phone: "",
  address: "",
  province: "",
  zipCode: "",
};

export default function ShippingFormUI() {
  const [form, setForm] = useState<ShippingForm>(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const set = (key: keyof ShippingForm, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    fetch("/api/profile/shipping")
      .then(r => r.json())
      .then(({ shippingAddress }) => {
        if (shippingAddress) {
          setForm({ ...empty, ...shippingAddress });
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile/shipping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
      toast.success("บันทึกข้อมูลการจัดส่งเรียบร้อยแล้ว");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-800 placeholder:text-slate-300 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 shadow-sm shadow-slate-200/20";
  const labelClass = "text-slate-500 text-[11px] font-black uppercase tracking-widest mb-2 block group-focus-within:text-blue-600 transition-colors";

  return (
    <div className="p-6 md:p-10 max-w-4xl w-full mx-auto pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-[32px] md:text-[36px] font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white shrink-0 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
             <Package size={24} />
          </div>
          ข้อมูลการจัดส่งพัสดุ
        </h1>
        <p className="text-slate-500 text-[15px] mt-3 font-medium md:ml-[64px]">ระบุที่อยู่เริ่มต้นสำหรับจัดส่งสินค้า 3D Print ให้ถึงมือคุณอย่างรวดเร็วและปลอดภัย</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgb(59,130,246,0.08)] relative">
        {/* Subtle decorative border stroke top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent opacity-80"></div>

        <div className="px-6 md:px-10 py-6 border-b border-slate-100/60 bg-gradient-to-b from-slate-50/80 to-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
            <Truck size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">ที่อยู่จัดส่งเริ่มต้น</h2>
            <p className="text-[12px] font-bold text-slate-400 mt-0.5 tracking-wide">ถูกตั้งเป็นค่าพื้นฐานสำหรับแบบฟอร์มขอใบเสนอราคา</p>
          </div>
        </div>

        {fetching ? (
          <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className={labelClass}>ชื่อ-นามสกุล / ชื่อผู้รับ <span className="text-red-400 font-bold">*</span></label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input required type="text" placeholder="ระบุชื่อผู้รับสินค้า" value={form.fullName} onChange={e => set("fullName", e.target.value)} className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div className="group">
                <label className={labelClass}>เบอร์โทรศัพท์ติดต่อ <span className="text-red-400 font-bold">*</span></label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input required type="tel" placeholder="0X-XXXX-XXXX" value={form.phone} onChange={e => set("phone", e.target.value)} className={`${inputClass} pl-11`} />
                </div>
              </div>
            </div>

            <div className="group">
              <label className={labelClass}>ที่อยู่จัดส่งโดยละเอียด <span className="text-red-400 font-bold">*</span></label>
              <div className="relative">
                 <MapPin size={16} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                 <textarea required placeholder="บ้านเลขที่, ถนน, ซอย, หมู่บ้าน, แขวง/ตำบล, เขต/อำเภอ" value={form.address} onChange={e => set("address", e.target.value)} rows={3}
                   className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-800 placeholder:text-slate-300 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 resize-none shadow-sm shadow-slate-200/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className={labelClass}>จังหวัด <span className="text-red-400 font-bold">*</span></label>
                 <div className="relative">
                  <Map size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input required type="text" placeholder="ระบุจังหวัด" value={form.province} onChange={e => set("province", e.target.value)} className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div className="group">
                <label className={labelClass}>รหัสไปรษณีย์ <span className="text-red-400 font-bold">*</span></label>
                <div className="relative">
                  <Navigation size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input required type="text" placeholder="10000" value={form.zipCode} onChange={e => set("zipCode", e.target.value)} className={`${inputClass} pl-11`} maxLength={5} />
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loading}
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-[14px] tracking-wide transition-all duration-500 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-slate-900 w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0"></div>
                {loading ? <Loader2 size={18} className="animate-spin relative z-10" /> : <Save size={18} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />}
                <span className="relative z-10">{loading ? "กำลังบันทึกข้อมูล..." : "บันทึกที่จัดส่งเริ่มต้น"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
