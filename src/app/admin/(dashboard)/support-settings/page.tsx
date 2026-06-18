import dbConnect from "@/lib/mongoose";
import SupportSettings from "@/models/SupportSettings";
import AdminSupportSettingsView from "@/components/admin/support/AdminSupportSettingsView";

export default async function AdminSupportSettingsPage() {
  await dbConnect();
  const settings = await SupportSettings.findOne().lean();

  const defaultSettings = {
    phone: "",
    email: "",
    lineId: "",
    lineUrl: "",
    address: "",
    businessHours: "จันทร์ - เสาร์ 9:00 - 18:00 น.",
    chatEnabled: true,
    facebookUrl: "",
    instagramUrl: "",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Support</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ตั้งค่า Support</h1>
        </div>
      </div>

      <AdminSupportSettingsView
        initialSettings={settings ? JSON.parse(JSON.stringify(settings)) : defaultSettings}
      />
    </div>
  );
}
