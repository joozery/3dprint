"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Search } from "lucide-react";

export default function SlipViewerButton({ slipUrl }: { slipUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all"
      >
        <Search size={16} />
        ดูสลิปโอนเงิน (Popup)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
              <h3 className="font-bold text-slate-800 text-lg">หลักฐานการชำระเงิน</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative flex-1 bg-slate-100 p-4 min-h-[400px] overflow-auto flex justify-center">
              <img 
                src={slipUrl} 
                alt="Payment Slip" 
                className="max-w-full h-auto object-contain rounded-xl shadow-sm"
              />
            </div>
            
            {/* Footer Options */}
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
               <a 
                 href={slipUrl} 
                 target="_blank" 
                 rel="noreferrer"
                 className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-100 transition-colors"
               >
                 เปิดรูปภาพในแท็บใหม่
               </a>
               <button 
                 onClick={() => setIsOpen(false)}
                 className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors"
               >
                 ปิดหน้าต่าง
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
