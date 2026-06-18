"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

const emptyForm = {
  question: "",
  answer: "",
  category: "ทั่วไป",
  order: 0,
  isActive: true,
};

export default function AdminFaqView({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  const handleOpenModal = (faq?: Faq) => {
    if (faq) {
      setEditingId(faq._id);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        isActive: faq.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({ ...emptyForm, order: faqs.length });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/faq/${editingId}` : `/api/admin/faq`;
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

      if (editingId) {
        setFaqs((prev) => prev.map((f) => (f._id === editingId ? data.faq : f)));
        toast.success("อัปเดต FAQ สำเร็จ");
      } else {
        setFaqs((prev) => [...prev, data.faq]);
        toast.success("เพิ่ม FAQ สำเร็จ");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบคำถามนี้ออกหรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ไม่สามารถลบได้");
      setFaqs((prev) => prev.filter((f) => f._id !== id));
      toast.success("ลบสำเร็จ");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleActive = async (faq: Faq) => {
    try {
      const res = await fetch(`/api/admin/faq/${faq._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setFaqs((prev) => prev.map((f) => (f._id === faq._id ? data.faq : f)));
      }
    } catch {
      toast.error("อัปเดตล้มเหลว");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <HelpCircle size={18} className="text-blue-500" />
          จัดการคำถามที่พบบ่อย ({faqs.length} รายการ)
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
        >
          <Plus size={16} /> เพิ่ม FAQ ใหม่
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {faqs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">ยังไม่มี FAQ</p>
            <p className="text-sm mt-1">คลิก "เพิ่ม FAQ ใหม่" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">คำถาม</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">หมวดหมู่</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">ลำดับ</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {faqs.map((faq) => (
                <tr key={faq._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800 line-clamp-1">{faq.question}</p>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{faq.answer}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className="text-slate-500 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                      {faq.order}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(faq)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${faq.isActive ? "bg-blue-500" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${faq.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(faq)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl my-auto p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg mb-6">{editingId ? "แก้ไข FAQ" : "เพิ่ม FAQ ใหม่"}</h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">
                  คำถาม <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="พิมพ์คำถาม..."
                  className="w-full p-3 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">
                  คำตอบ <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="พิมพ์คำตอบ..."
                  className="w-full p-3 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">หมวดหมู่</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="เช่น ทั่วไป, การชำระเงิน"
                    className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">ลำดับ</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-blue-500" : "bg-slate-300"}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${formData.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm font-semibold text-slate-600">
                  {formData.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </span>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
