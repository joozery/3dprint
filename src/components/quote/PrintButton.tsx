"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg text-sm font-semibold shadow-sm transition-all"
    >
      <Printer size={16} /> พิมพ์เอกสาร
    </button>
  );
}
