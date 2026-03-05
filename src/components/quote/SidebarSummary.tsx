"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Ticket } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarSummaryProps {
    quotes: any[];
}

export function SidebarSummary({ quotes }: SidebarSummaryProps) {
    const [agreed, setAgreed] = useState(true);
    const router = useRouter();

    const totalPrice = quotes.reduce((sum, q) => sum + (q?.priceDetail?.totalPrice || 0), 0);
    const weight = quotes.reduce((sum, q) => sum + (q?.weightGrams || 0), 0);
    const hasQuotes = quotes.length > 0;

    return (
        <div className="space-y-4 sticky top-24">
            {/* Charge Details */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">รายละเอียดราคา</h2>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">ราคาสุทธิ</span>
                    <span className="text-2xl font-bold text-orange-600">
                        {totalPrice > 0 ? `฿${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "--"}
                    </span>
                </div>
                {quotes.length > 1 && (
                    <p className="text-xs text-slate-400 mb-2">{quotes.length} รายการ · เฉลี่ย ฿{(totalPrice / quotes.length).toFixed(2)}/ชิ้น</p>
                )}
                <p className="text-[10px] text-slate-400 mb-6">
                    อาจมีค่าใช้จ่ายเพิ่มเติมสำหรับ <span className="underline cursor-pointer">กรณีพิเศษ</span>
                </p>

                <div className="flex items-start space-x-2 mb-6">
                    <Checkbox
                        id="terms"
                        checked={agreed}
                        onCheckedChange={(val) => setAgreed(!!val)}
                        className="mt-1"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-500 leading-tight">
                        ฉันยอมรับ <span className="text-blue-600 hover:underline cursor-pointer font-medium">เงื่อนไขการใช้งาน</span> ของ 3DEV
                    </label>
                </div>

                <div className="space-y-3">
                    <Button
                        disabled={!hasQuotes || !agreed}
                        onClick={() => router.push("/checkout")}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-base font-bold rounded-full shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                    >
                        สั่งพิมพ์เลย
                    </Button>
                    <Button
                        variant="outline"
                        disabled={!hasQuotes}
                        className="w-full py-6 text-base font-bold rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    >
                        บันทึกลงตะกร้า
                    </Button>
                </div>
            </div>

            {/* Shipping Estimate */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1 mb-1">
                    ประมาณการค่าส่ง <Info className="w-3 h-3 text-slate-400" />
                </h3>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">น้ำหนัก <Info className="w-3 h-3 inline text-slate-300" /></span>
                    <span className="font-bold text-slate-900">
                        {weight > 0 ? `${weight.toFixed(2)} g` : "--"}
                    </span>
                </div>
            </div>

            {/* Coupons */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        คูปองส่วนลด <Info className="w-3 h-3 text-slate-400" />
                    </h3>
                    <div className="flex gap-1">
                        <div className="text-[9px] font-bold border border-orange-200 text-orange-500 px-1 rounded bg-orange-50">ลด ฿25.00</div>
                        <div className="text-[9px] font-bold border border-orange-200 text-orange-500 px-1 rounded bg-orange-50">ลด ฿25.00</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
