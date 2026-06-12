"use client";

import { useState, useEffect, useRef } from "react";
import { User, Building2, Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Plus, Star, Trash2, Edit3, MapPin, X, Globe, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import CascadingAddressPicker, { AddressData } from "@/components/ui/CascadingAddressPicker";
import { useLanguage } from "@/components/providers/LanguageProvider";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina",
  "Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados",
  "Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina",
  "Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros",
  "Congo","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica",
  "Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea",
  "Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia",
  "Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo",
  "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya",
  "Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives",
  "Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia",
  "Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia",
  "Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea",
  "North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia",
  "Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia",
  "Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan",
  "Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago",
  "Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City",
  "Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

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
  isInternational?: boolean;
}

function CountryCombobox({ value, onChange, inputClass }: {
  value: string;
  onChange: (v: string) => void;
  inputClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? COUNTRIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (country: string) => {
    onChange(country);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
      <input
        type="text"
        className={cn(inputClass, "pl-9 pr-8 cursor-pointer")}
        placeholder="Search country..."
        value={open ? query : value}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
      />
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
            <Search size={13} className="text-slate-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-bold">
              {filtered.length} countries
            </span>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-[13px] text-slate-400 text-center">No results</li>
            ) : filtered.map(c => (
              <li
                key={c}
                onMouseDown={() => handleSelect(c)}
                className={cn(
                  "px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-colors",
                  c === value ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
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
  const { t } = useLanguage();
  const p = t.profile;
  const [form, setForm] = useState<UnifiedForm>(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [addressForm, setAddressForm] = useState<Address>({
    label: "", fullName: "", phone: "", address: "", district: "", subDistrict: "", province: "", zipCode: "", isDefault: false, isInternational: false
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressFeedback, setAddressFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const set = (key: keyof UnifiedForm, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    setIsMounted(true);
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

  useEffect(() => {
    if (editingAddress) {
      setAddressForm(editingAddress);
    } else {
      setAddressForm({
        label: "", fullName: "", phone: "", address: "", district: "", subDistrict: "", province: "", zipCode: "", isDefault: false, isInternational: false
      });
    }
  }, [editingAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const nameParts = form.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare addresses for saving - remove temporary IDs created by Date.now()
      const sanitizedAddresses = form.shippingAddresses.map(addr => {
        // If _id is a temporary timestamp string (e.g. "1712345678901"), remove it so MongoDB can generate a real ObjectId
        if (addr._id && addr._id.length !== 24) {
          const { _id, ...rest } = addr;
          return rest;
        }
        return addr;
      });

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
          shippingAddresses: sanitizedAddresses
        }),
      });
      if (!res.ok) throw new Error(p.saveFailed);
      setFeedback({ text: p.saveSuccess, type: "success" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const saveAddressesToAPI = async (addresses: Address[]) => {
    const sanitized = addresses.map(addr => {
      if (addr._id && addr._id.length !== 24) {
        const { _id, ...rest } = addr;
        return rest;
      }
      return addr;
    });
    const res = await fetch("/api/profile/billing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingAddresses: sanitized }),
    });
    if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
    const data = await res.json();
    return data;
  };

  const handleSetDefaultAddress = async (index: number) => {
    const updated = form.shippingAddresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    set("shippingAddresses", updated);
    try {
      await saveAddressesToAPI(updated);
    } catch {}
  };

  const handleDeleteAddress = async (index: number) => {
    const updated = form.shippingAddresses.filter((_, i) => i !== index);
    set("shippingAddresses", updated);
    try {
      await saveAddressesToAPI(updated);
    } catch {}
  };

  const validateAddress = (): string | null => {
    if (!addressForm.label.trim()) return "กรุณาระบุชื่อที่อยู่ (เช่น บ้าน, ออฟฟิศ)";
    if (!addressForm.fullName.trim()) return "กรุณาระบุชื่อผู้รับ";
    if (!addressForm.phone.trim()) return "กรุณาระบุเบอร์โทรศัพท์";
    if (!addressForm.address.trim()) return "กรุณาระบุที่อยู่โดยละเอียด";
    if (addressForm.isInternational) {
      if (!addressForm.subDistrict.trim()) return "กรุณาระบุ City / District";
      if (!addressForm.province.trim()) return "กรุณาเลือกประเทศ (Country)";
      if (!addressForm.zipCode.trim()) return "กรุณาระบุรหัสไปรษณีย์";
    } else {
      if (!addressForm.province.trim() || !addressForm.district.trim() || !addressForm.subDistrict.trim() || !addressForm.zipCode.trim())
        return "กรุณาเลือกจังหวัด, เขต/อำเภอ, แขวง/ตำบล และรหัสไปรษณีย์ให้ครบ";
    }
    return null;
  };

  const handleSaveAddress = async () => {
    const error = validateAddress();
    if (error) { setAddressFeedback({ text: error, type: "error" }); return; }
    setSavingAddress(true);
    setAddressFeedback(null);
    try {
      let updated = [...form.shippingAddresses];
      if (editingAddress?._id) {
        updated = updated.map(a => a._id === editingAddress._id ? addressForm : a);
      } else {
        updated.push({ ...addressForm, _id: Date.now().toString(), isDefault: form.shippingAddresses.length === 0 });
      }
      await saveAddressesToAPI(updated);
      set("shippingAddresses", updated);
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (err: any) {
      setAddressFeedback({ text: err.message || "บันทึกไม่สำเร็จ", type: "error" });
    } finally {
      setSavingAddress(false);
    }
  };

  if (fetching || !isMounted) {
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
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-tight">{p.profileTitle}</h1>
          <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-sm">{p.profileSubtitle}</p>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> {p.save}</>}
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
        <h3 className={labelClass}>{p.accountType}</h3>
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
              <div className="text-sm font-black text-slate-800">{p.individual}</div>
              <div className="text-[11px] font-bold text-slate-400">{p.individualDesc}</div>
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
              <div className="text-sm font-black text-slate-800">{p.companyType}</div>
              <div className="text-[11px] font-bold text-slate-400">{p.companyDesc}</div>
            </div>
          </label>
        </div>
      </div>

      {/* 2. Individual Info */}
      <div className={bentoClass}>
        <div className="mb-8">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">{p.primaryContact}</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.primaryContactDesc}</p>
        </div>
        <div className="mb-6">
          <label className={labelClass}>{p.fullName}</label>
          <input type="text" value={form.fullName} onChange={e => set("fullName", e.target.value)} className={inputClass} placeholder="สมชาย วิศวกร" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div><label className={labelClass}>{p.emailLabel}</label><input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} placeholder="somchai@siaminnovation.co.th" /></div>
          <div><label className={labelClass}>{p.phoneLabel}</label><input type="text" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass} placeholder="+66 81 234 5678" /></div>
        </div>
        <div>
          <label className={labelClass}>{p.passwordLabel}</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input type={showPassword ? "text" : "password"} value=".........." readOnly className={cn(inputClass, "bg-slate-50 border-slate-100")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="button" className="px-6 h-11 bg-white border border-slate-200 rounded-xl font-black text-[13px] text-slate-600 hover:bg-slate-50 transition-all">{p.changePassword}</button>
          </div>
        </div>
      </div>

      {/* 3. Corporate Info */}
      <div className={bentoClass}>
        <div className="mb-8">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">{p.companySection}</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.companyBillingDesc}</p>
        </div>
        <div className="space-y-6">
          <div><label className={labelClass}>{p.companyNameTH}</label><input type="text" value={form.companyName} onChange={e => set("companyName", e.target.value)} className={inputClass} placeholder="บริษัท สยาม อินโนเวชั่น จำกัด" /></div>
          <div><label className={labelClass}>{p.companyNameEN}</label><input type="text" value={form.companyNameEng} onChange={e => set("companyNameEng", e.target.value)} className={inputClass} placeholder="Siam Innovation Co., Ltd." /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>{p.taxId}</label><input type="text" value={form.taxId} onChange={e => set("taxId", e.target.value)} className={inputClass} placeholder="0-1055-61234-56-7" /></div>
            <div><label className={labelClass}>{p.branchCode}</label><input type="text" value={form.branchCode} onChange={e => set("branchCode", e.target.value)} className={inputClass} placeholder="00001" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.isVatRegistered} onChange={e => set("isVatRegistered", e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <div className="text-[12px] font-bold text-slate-600">{p.vatRegistered}</div>
            </div>
            <div><label className={labelClass}>{p.industryLabel}</label><input type="text" value={form.industry} onChange={e => set("industry", e.target.value)} className={inputClass} placeholder="Electronics" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>{p.contactPerson}</label><input type="text" value={form.contactName} onChange={e => set("contactName", e.target.value)} className={inputClass} placeholder="สมชาย วิศวกร" /></div>
            <div><label className={labelClass}>{p.officePhone}</label><input type="text" value={form.officePhone} onChange={e => set("officePhone", e.target.value)} className={inputClass} placeholder="+66 2 610 9999" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>{p.companyEmail}</label><input type="email" value={form.corporateEmail} onChange={e => set("corporateEmail", e.target.value)} className={inputClass} placeholder="info@siaminnovation.co.th" /></div>
            <div><label className={labelClass}>{p.websiteLabel}</label><input type="text" value={form.website} onChange={e => set("website", e.target.value)} className={inputClass} placeholder="siaminnovation.co.th" /></div>
          </div>
          <div>
            <label className={labelClass}>{p.companySizeLabel}</label>
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
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{p.addressTitle}</h2>
                <p className="text-slate-400 font-bold text-sm">{p.shippingAddressesDesc}</p>
            </div>
            <button 
                type="button"
                onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
                <Plus size={14} /> {p.addAddress}
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
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {addr.isInternational ? `${addr.province || "INTL"} · ${addr.zipCode}` : `TH · ${addr.zipCode}`}
                                </span>
                            </div>
                        </div>
                        {addr.isDefault && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                <Star size={10} className="fill-emerald-600" />
                                <span className="text-[10px] font-black uppercase">{p.defaultBadge}</span>
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
                            <Edit3 size={12} /> {p.editBtn}
                        </button>
                        {!addr.isDefault && (
                            <button 
                                type="button" 
                                onClick={() => handleSetDefaultAddress(idx)}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                {p.setAsDefault}
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
                    <p className="text-[15px] font-bold text-slate-800">{p.noAddresses}</p>
                    <p className="text-sm text-slate-400 mt-1">{p.noAddressesDesc}</p>
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
                        <h2 className="text-[18px] font-black text-slate-900 leading-tight">{editingAddress ? p.editAddressTitle : p.addAddressTitle}</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.addressFormSubtitle}</p>
                    </div>
                    <button type="button" onClick={() => setShowAddressModal(false)} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="px-7 py-2 overflow-y-auto no-scrollbar space-y-5 flex-1">
                    <div><label className={labelClass}>{p.placeLabel}</label><input type="text" value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} className={inputClass} placeholder="ออฟฟิศสำนักงานใหญ่" /></div>
                    <div><label className={labelClass}>{p.recipientName}</label><input type="text" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} className={inputClass} placeholder="คุณสมชาย วิศวกร" /></div>
                    <div><label className={labelClass}>{p.phoneNumber}</label><input type="text" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className={inputClass} placeholder="+66 2 610 9999" /></div>
                    
                    <div className="flex items-center gap-2 mt-2 mb-2">
                      <input 
                        type="checkbox" 
                        id="isInternational"
                        checked={addressForm.isInternational} 
                        onChange={e => setAddressForm({...addressForm, isInternational: e.target.checked})} 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="isInternational" className="text-sm font-bold text-slate-700 cursor-pointer">
                        {p.internationalAddress}
                      </label>
                    </div>

                    <div><label className={labelClass}>{p.addressDetail}</label><textarea value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className={cn(inputClass, "h-20 py-3")} placeholder="88/12 อาคารสยามพารากอน ชั้น 4" /></div>
                    
                    {addressForm.isInternational ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>City / District <span className="text-red-400">*</span></label>
                            <input type="text" value={addressForm.subDistrict} onChange={e => setAddressForm({...addressForm, subDistrict: e.target.value})} className={inputClass} placeholder="City" />
                          </div>
                          <div>
                            <label className={labelClass}>State / Province</label>
                            <input type="text" value={addressForm.district} onChange={e => setAddressForm({...addressForm, district: e.target.value})} className={inputClass} placeholder="State (optional)" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Country <span className="text-red-400">*</span></label>
                            <CountryCombobox
                              value={addressForm.province}
                              onChange={v => setAddressForm({...addressForm, province: v})}
                              inputClass={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Zip/Postal Code <span className="text-red-400">*</span></label>
                            <input type="text" value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} className={inputClass} placeholder="Zipcode" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="pt-2 pb-6">
                        <CascadingAddressPicker
                          value={{
                            province: addressForm.province,
                            amphure: addressForm.district,
                            district: addressForm.subDistrict,
                            zipcode: addressForm.zipCode
                          }}
                          onChange={(addr: AddressData) => setAddressForm({
                            ...addressForm,
                            province: addr.province,
                            district: addr.amphure,
                            subDistrict: addr.district,
                            zipCode: addr.zipcode
                          })}
                        />
                      </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-7 pt-4 pb-7 shrink-0 border-t border-slate-100 space-y-3">
                    {addressFeedback && (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                        <AlertCircle size={14} className="shrink-0" />
                        {addressFeedback.text}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setShowAddressModal(false); setAddressFeedback(null); }}
                        disabled={savingAddress}
                        className="flex-1 h-11 rounded-xl border border-slate-200 font-black text-xs text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
                      >
                        {p.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        disabled={savingAddress}
                        className="flex-[2] h-11 px-8 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {savingAddress
                          ? <><Loader2 size={14} className="animate-spin" /> {p.savingAddress}</>
                          : <><Save size={14} /> {p.saveAddress}</>}
                      </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </form>
  );
}
