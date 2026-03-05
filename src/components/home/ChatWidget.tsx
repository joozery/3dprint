"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

export default function ChatWidget() {
    const [open, setOpen] = useState(true);

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-300/50 transition-all hover:scale-110 hover:bg-blue-700"
                aria-label="เปิดแชท"
            >
                <MessageCircle size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Chat Bubble */}
            <div className="flex w-60 flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            👋
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-tight">
                            สวัสดีครับ! <br />
                            <span className="font-normal text-slate-500 text-xs">มีอะไรให้ช่วยไหม?</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-md shadow-blue-200"
                >
                    <MessageCircle size={14} className="mr-1.5" />
                    แชทเลย
                </Button>
            </div>

            {/* Avatar Button */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-300/50 text-xl cursor-pointer hover:bg-blue-700 transition-colors">
                🤖
            </div>
        </div>
    );
}
