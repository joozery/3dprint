"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Edit3, Globe } from "lucide-react";
import { toast } from "sonner";

export default function ServicesContentAdmin() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/services-content");
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
      } else {
        toast.error("ดึงข้อมูลไม่สำเร็จ");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">กำลังโหลด...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-2">จัดการหน้าบริการ (Services Pages)</h1>
        <p className="text-slate-500 text-sm">แก้ไขข้อความ รูปภาพ และข้อมูลในหน้ารายละเอียดบริการ (FDM, SLA, Multi-color)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-24 bg-${p.themeColor}-100 flex items-center justify-center relative overflow-hidden`}>
              {/* Optional: Show bg image here */}
              <div className={`absolute inset-0 bg-${p.themeColor}-600/10`}></div>
              <Layers className={`text-${p.themeColor}-600 w-10 h-10 z-10`} />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-slate-900">{p.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-${p.themeColor}-50 text-${p.themeColor}-600 uppercase tracking-wide`}>
                  {p.slug}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-5 line-clamp-2">{p.description}</p>
              
              <div className="flex gap-2">
                <Link 
                  href={`/admin/services-content/${p._id}`}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2 rounded-lg text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 size={16} />
                  แก้ไขเนื้อหา
                </Link>
                <Link 
                  href={`/services/${p.slug}`}
                  target="_blank"
                  className="w-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  title="ดูหน้าจริง"
                >
                  <Globe size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
