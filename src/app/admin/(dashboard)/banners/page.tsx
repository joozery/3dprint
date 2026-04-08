import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";
import AdminBannersView from "@/components/admin/banners/AdminBannersView";

export default async function AdminBannersPage() {
  await dbConnect();
  const banners = await Banner.find().sort({ order: 1, createdAt: -1 }).lean();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Content</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">จัดการแบนเนอร์หน้าแรก</h1>
        </div>
      </div>

      <AdminBannersView initialBanners={JSON.parse(JSON.stringify(banners))} />
    </div>
  );
}
