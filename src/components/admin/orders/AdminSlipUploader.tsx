"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminSlipUploader({ orderId }: { orderId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/slip`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("อัปโหลดสลิปสำเร็จ และปรับสถานะเป็นชำระแล้ว");
        router.refresh();
      } else {
        toast.error(data.error || "อัปโหลดไม่สำเร็จ");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 mt-4">
      <label className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-2 border-dashed ${isUploading ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300'}`}>
        {isUploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            กำลังอัปโหลด...
          </>
        ) : (
          <>
            <Upload size={16} />
            อัปโหลดสลิปใหม่ (แอดมิน)
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
