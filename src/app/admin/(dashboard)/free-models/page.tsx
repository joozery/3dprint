import dbConnect from "@/lib/mongoose";
import FreeModel from "@/models/FreeModel";
import AdminFreeModelsView from "@/components/admin/free-models/AdminFreeModelsView";

async function getModels() {
  await dbConnect();
  const models = await FreeModel.find().sort({ order: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(models));
}

export default async function AdminFreeModelsPage() {
  const models = await getModels();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">คลังโมเดล 3D ฟรี</h1>
        <p className="text-slate-500 text-sm mt-1">จัดการโมเดล 3D สำหรับดาวน์โหลดฟรีในหน้าเว็บ</p>
      </div>
      <AdminFreeModelsView initialModels={models} />
    </div>
  );
}
