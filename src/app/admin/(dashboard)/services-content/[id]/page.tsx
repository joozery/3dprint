"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function EditServiceContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [unwrappedParams.id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/services-content/${unwrappedParams.id}`);
      const result = await res.json();
      if (result.success) {
        setData(result.page);
      } else {
        toast.error("ไม่พบข้อมูล");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, section?: string, index?: number, subfield?: string) => {
    const val = e.target.value;
    setData((prev: any) => {
      const newData = { ...prev };
      if (section && index !== undefined && subfield) {
        newData[section][index][subfield] = val;
      } else if (section) {
        newData[section] = { ...newData[section], [field]: val };
      } else {
        newData[field] = val;
      }
      return newData;
    });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string, arrayName: string, index: number, field: string) => {
    const val = e.target.value;
    setData((prev: any) => {
      const newData = { ...prev };
      newData[section][arrayName][index][field] = val;
      return newData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services-content/${unwrappedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
        router.push("/admin/services-content");
      } else {
        toast.error("ไม่สามารถบันทึกได้");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> กำลังโหลด...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">ไม่พบข้อมูลหน้าบริการนี้</div>;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <Link href="/admin/services-content" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">แก้ไขหน้า: {data.title}</h1>
            <p className="text-sm text-slate-500">/{data.slug}</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">ข้อมูลทั่วไป (Hero Section)</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title (หัวข้อหลัก)</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.title} onChange={e => handleChange(e, "title")} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subtitle (ข้อความสี)</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.subtitle} onChange={e => handleChange(e, "subtitle")} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description (คำอธิบายใต้หัวข้อ)</label>
            <textarea className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]" value={data.description} onChange={e => handleChange(e, "description")} />
          </div>
          <ImageUploader 
            label="Hero Image (รูปภาพพื้นหลัง)"
            value={data.heroImage}
            onChange={(url) => setData((prev: any) => ({ ...prev, heroImage: url }))}
          />
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">ส่วนอธิบายเทคโนโลยี (About Section)</h2>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">หัวข้อ (Title)</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" value={data.about.title} onChange={e => handleChange(e, "title", "about")} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">เนื้อหาย่อหน้าที่ 1</label>
            <textarea className="w-full px-3 py-2 border rounded-lg min-h-[80px]" value={data.about.content} onChange={e => handleChange(e, "content", "about")} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">เนื้อหาย่อหน้าที่ 2</label>
            <textarea className="w-full px-3 py-2 border rounded-lg min-h-[80px]" value={data.about.subContent} onChange={e => handleChange(e, "subContent", "about")} />
          </div>
          <ImageUploader 
            label="About Image (รูปประกอบส่วนเนื้อหา)"
            value={data.about.image}
            onChange={(url) => setData((prev: any) => ({ ...prev, about: { ...prev.about, image: url } }))}
          />

          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-bold text-slate-700 mb-3">จุดเด่น (Bullet Points)</h3>
            <div className="space-y-4">
              {data.about.bullets.map((b: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-1/3">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">หัวข้อจุดเด่น</label>
                    <input type="text" className="w-full px-2 py-1.5 text-sm border rounded bg-white" value={b.title} onChange={e => handleArrayChange(e, "about", "bullets", i, "title")} />
                  </div>
                  <div className="w-2/3">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">รายละเอียด</label>
                    <input type="text" className="w-full px-2 py-1.5 text-sm border rounded bg-white" value={b.desc} onChange={e => handleArrayChange(e, "about", "bullets", i, "desc")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">วัสดุที่รองรับ (Materials)</h2>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">หัวข้อส่วนวัสดุ</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" value={data.materials.title} onChange={e => handleChange(e, "title", "materials")} />
          </div>

          <div className="space-y-4 mt-2">
            {data.materials.items.map((m: any, i: number) => (
              <div key={i} className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="col-span-4 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ชื่อวัสดุ</label>
                  <input type="text" className="w-full px-2 py-1.5 text-sm border rounded bg-white" value={m.name} onChange={e => handleArrayChange(e, "materials", "items", i, "name")} />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">คุณสมบัติ 1</label>
                  <input type="text" className="w-full px-2 py-1.5 text-sm border rounded bg-white" value={m.desc1} onChange={e => handleArrayChange(e, "materials", "items", i, "desc1")} />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">คุณสมบัติ 2</label>
                  <input type="text" className="w-full px-2 py-1.5 text-sm border rounded bg-white" value={m.desc2} onChange={e => handleArrayChange(e, "materials", "items", i, "desc2")} />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">คุณสมบัติ 3</label>
                  <input type="text" className="w-full px-2 py-1.5 text-sm border rounded bg-white" value={m.desc3} onChange={e => handleArrayChange(e, "materials", "items", i, "desc3")} />
                </div>
                <div className="col-span-4">
                  <ImageUploader 
                    label="Image (รูปภาพวัสดุ)"
                    value={m.image}
                    onChange={(url) => {
                      setData((prev: any) => {
                        const newData = { ...prev };
                        newData.materials.items[i].image = url;
                        return newData;
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">ขั้นตอนการทำงาน (Process)</h2>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">หัวข้อส่วนขั้นตอน</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" value={data.process.title} onChange={e => handleChange(e, "title", "process")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {data.process.steps.map((s: any, i: number) => (
              <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 items-start">
                <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0">{s.step}</div>
                <div className="w-full space-y-2">
                  <input type="text" className="w-full px-2 py-1 text-sm font-bold border rounded bg-white" value={s.title} onChange={e => handleArrayChange(e, "process", "steps", i, "title")} />
                  <input type="text" className="w-full px-2 py-1 text-xs border rounded bg-white text-slate-600" value={s.desc} onChange={e => handleArrayChange(e, "process", "steps", i, "desc")} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function ImageUploader({ value, onChange, label }: { value: string, onChange: (url: string) => void, label: string }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        onChange(result.url);
        toast.success("อัปโหลดรูปภาพสำเร็จ");
      } else {
        toast.error("อัปโหลดล้มเหลว: " + result.error);
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploading(false);
      // clear input
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        <input 
          type="text" 
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
          value={value || ""} 
          onChange={e => onChange(e.target.value)} 
          placeholder="URL หรือกดปุ่มอัปโหลดรูป" 
        />
        <label className={`flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="ml-2 text-sm font-bold">อัปโหลด</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {value && <div className="mt-2"><img src={value} alt="Preview" className="h-24 object-contain rounded border border-slate-200 bg-slate-50 p-1" /></div>}
    </div>
  );
}
