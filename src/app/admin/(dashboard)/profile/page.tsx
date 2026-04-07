import AdminProfileForm from "@/components/admin/profile/AdminProfileForm";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Profile</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ตั้งค่าโปรไฟล์</h1>
        </div>
      </div>

      <AdminProfileForm />
    </div>
  );
}
