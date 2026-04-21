"use client";

import { useState } from "react";
import { FileBox, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserFilesTable({ fileDetails, totalFiles }: { fileDetails: any[], totalFiles: number }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalFiles / itemsPerPage);

  const paginatedFiles = fileDetails.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800">รายการไฟล์โมเดล (ทั้งหมด {totalFiles} ไฟล์)</h3>
      </div>
      <div className="p-0 overflow-x-auto">
        {fileDetails.length > 0 ? (
          <>
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">ลำดับ</th>
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">ชื่อไฟล์</th>
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold text-center">ประเภท</th>
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold text-center">ปริมาตร/พื้นที่</th>
                  <th className="px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold text-right">วันที่อัปโหลด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {paginatedFiles.map((f: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-slate-400 text-xs text-center w-12">
                      {(page - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <FileBox size={14} className="text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700 truncate max-w-[200px]" title={f.name}>{f.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-medium">
                        {f.technology?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center text-slate-500 text-xs">
                      {f.volumeCm3 ? `${f.volumeCm3.toFixed(2)} cm³` : "-"} <span className="text-[10px] text-slate-300 ml-1">(~{f.estimatedMb}MB)</span>
                    </td>
                    <td className="px-6 py-3 text-right text-slate-400 text-xs">
                      {new Date(f.date).toLocaleDateString('th-TH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                <p className="text-slate-400 text-xs">
                  หน้า <span className="font-semibold text-slate-600">{page}</span> / {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-200 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-200 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-10 text-center text-slate-500 text-sm">
            ผู้ใช้นี้ยังไม่มีการอัปโหลดไฟล์
          </div>
        )}
      </div>
    </div>
  );
}
