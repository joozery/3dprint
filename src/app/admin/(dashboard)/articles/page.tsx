import dbConnect from "@/lib/mongoose";
import Article from "@/models/Article";
import AdminArticlesView from "@/components/admin/support/AdminArticlesView";

export default async function AdminArticlesPage() {
  await dbConnect();
  const articles = await Article.find().sort({ order: 1, createdAt: -1 }).lean();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Support</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">จัดการบทความ / คู่มือ</h1>
        </div>
      </div>

      <AdminArticlesView initialArticles={JSON.parse(JSON.stringify(articles))} />
    </div>
  );
}
