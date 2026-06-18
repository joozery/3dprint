import dbConnect from "@/lib/mongoose";
import Faq from "@/models/Faq";
import AdminFaqView from "@/components/admin/support/AdminFaqView";

export default async function AdminFaqPage() {
  await dbConnect();
  const faqs = await Faq.find().sort({ order: 1 }).lean();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin / Support</p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">จัดการ FAQ</h1>
        </div>
      </div>

      <AdminFaqView initialFaqs={JSON.parse(JSON.stringify(faqs))} />
    </div>
  );
}
