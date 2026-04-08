import dbConnect from "@/lib/mongoose";
import Material from "@/models/Material";
import AdminMaterialsView from "@/components/admin/materials/AdminMaterialsView";

export default async function AdminMaterialsPage() {
  await dbConnect();
  // Fetch initial materials
  const materials = await Material.find().sort({ technology: 1, createdAt: 1 }).lean();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Settings</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ตั้งค่าวัสดุ 3D และตัวคูณราคา</h1>
        </div>
      </div>

      {/* Main View Component */}
      <AdminMaterialsView initialMaterials={JSON.parse(JSON.stringify(materials))} />
    </div>
  );
}
