"use client";

import { useState } from "react";
import { Settings2, Save, Phone, Mail, MessageCircle, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { toast } from "sonner";

interface SupportSettingsData {
  phone?: string;
  email?: string;
  lineId?: string;
  lineUrl?: string;
  address?: string;
  businessHours?: string;
  chatEnabled?: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function AdminSupportSettingsView({
  initialSettings,
}: {
  initialSettings: SupportSettingsData;
}) {
  const [formData, setFormData] = useState<SupportSettingsData>({
    phone: "",
    email: "",
    lineId: "",
    lineUrl: "",
    address: "",
    businessHours: "จันทร์ - เสาร์ 9:00 - 18:00 น.",
    chatEnabled: true,
    facebookUrl: "",
    instagramUrl: "",
    ...initialSettings,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/support-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
      toast.success("บันทึกการตั้งค่าสำเร็จ");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm">
        <Settings2 size={18} className="text-blue-500" />
        <span className="text-sm text-slate-500">ตั้งค่าข้อมูลติดต่อและแชทสำหรับหน้า Support</span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Phone size={16} className="text-blue-500" /> ข้อมูลติดต่อ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <Phone size={12} /> เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                value={formData.phone ?? ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="เช่น 02-xxx-xxxx"
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <Mail size={12} /> อีเมล
              </label>
              <input
                type="email"
                value={formData.email ?? ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="เช่น hello@yoursite.co.th"
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <MessageCircle size={12} /> LINE ID
              </label>
              <input
                type="text"
                value={formData.lineId ?? ""}
                onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                placeholder="เช่น @pdmpro"
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <MessageCircle size={12} /> LINE URL (ลิงก์แอด)
              </label>
              <input
                type="url"
                value={formData.lineUrl ?? ""}
                onChange={(e) => setFormData({ ...formData, lineUrl: e.target.value })}
                placeholder="เช่น https://line.me/R/ti/p/@pdmpro"
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <MapPin size={12} /> ที่อยู่
              </label>
              <textarea
                rows={2}
                value={formData.address ?? ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="ที่อยู่สำนักงาน..."
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <Clock size={12} /> เวลาทำการ
              </label>
              <input
                type="text"
                value={formData.businessHours ?? ""}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="เช่น จันทร์ - เสาร์ 9:00 - 18:00 น."
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Facebook size={16} className="text-blue-500" /> โซเชียลมีเดีย
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <Facebook size={12} /> Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl ?? ""}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5 block">
                <Instagram size={12} /> Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl ?? ""}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/yourprofile"
                className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Chat Settings */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <MessageCircle size={16} className="text-blue-500" /> ตั้งค่า Live Chat
          </h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, chatEnabled: !formData.chatEnabled })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formData.chatEnabled ? "bg-blue-500" : "bg-slate-300"}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition ${formData.chatEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <div>
              <p className="font-semibold text-slate-700 text-sm">
                {formData.chatEnabled ? "เปิดใช้งาน Live Chat" : "ปิดใช้งาน Live Chat"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formData.chatEnabled
                  ? "ปุ่มแชทจะปรากฏในหน้า Support Chat"
                  : "ปุ่มแชทจะถูกซ่อนและแสดงข้อความนอกเวลาทำการ"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save size={16} /> บันทึกการตั้งค่า
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
