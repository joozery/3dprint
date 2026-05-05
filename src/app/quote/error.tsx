"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h2 className="text-xl font-bold text-slate-900 mb-2">เกิดข้อผิดพลาดในการโหลดหน้าคำนวณราคา</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-md">
        {error.message || "มีข้อผิดพลาดบางอย่างเกิดขึ้นในระบบ UI ใหม่"}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
      >
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );
}
