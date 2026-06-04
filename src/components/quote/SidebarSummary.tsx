"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Loader2, FileText, ShoppingCart, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SidebarSummaryProps {
    quotes: any[];
}

export function SidebarSummary({ quotes }: SidebarSummaryProps) {
    const [agreed, setAgreed] = useState(true);
    const [requestLoading, setRequestLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const router = useRouter();
    const { data: session } = useSession();
    const { t } = useLanguage();

    const totalPrice = quotes.reduce((sum, q) => sum + (q?.priceDetail?.totalPrice || 0), 0);
    const weight = quotes.reduce((sum, q) => sum + (q?.weightGrams || 0), 0);
    const hasQuotes = quotes.length > 0;

    // ── ขอใบเสนอราคา ──────────────────────────────────────────────
    const handleRequestQuote = async () => {
        if (!hasQuotes || !agreed) return;

        // ถ้ายังไม่ login
        if (!session?.user) {
            router.push("/login?callbackUrl=/quote");
            return;
        }

        setRequestLoading(true);
        setFeedback(null);

        try {
            const ids = quotes.map((q: any) => q._id).filter(Boolean);
            const res = await fetch("/api/quote/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

            // redirect ไปหน้ากรอกข้อมูลพร้อม ids
            const idsParam = data.ids.join(",");
            router.push(`/quote/request?ids=${idsParam}`);
        } catch (err: any) {
            setFeedback({ text: err.message, type: "error" });
        } finally {
            setRequestLoading(false);
        }
    };

    return (
        <div className="space-y-4 sticky top-24">
            {/* Charge Details */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{t.quote.priceDetail}</h2>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">{t.quote.netPrice}</span>
                    <span className="text-2xl font-bold text-orange-600">
                        {totalPrice > 0 ? `฿${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "--"}
                    </span>
                </div>
                {quotes.length > 1 && (
                    <p className="text-xs text-slate-400 mb-2">{quotes.length} {t.quote.filesLabel} · ฿{(totalPrice / quotes.length).toFixed(2)}{t.quote.perPiece}</p>
                )}
                <p className="text-[10px] text-slate-400 mb-6">
                    {t.quote.extraNote} <span className="underline cursor-pointer">{t.quote.termsLink}</span>
                </p>

                {/* Terms */}
                <div className="flex items-start space-x-2 mb-5">
                    <Checkbox
                        id="terms"
                        checked={agreed}
                        onCheckedChange={(val) => setAgreed(!!val)}
                        className="mt-1"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-500 leading-tight">
                        {t.quote.termsCheck} <span className="text-blue-600 hover:underline cursor-pointer font-medium">{t.quote.termsLink}</span> {""}ของ PrintMyDesign
                    </label>
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`flex items-start gap-2 p-3 rounded-lg mb-4 text-xs ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                        {feedback.type === "success"
                            ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                            : <AlertCircle size={14} className="shrink-0 mt-0.5" />}
                        <span className="leading-relaxed">{feedback.text}</span>
                    </div>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                    {/* Request Quote — primary action */}
                    <button
                        disabled={!hasQuotes || !agreed || requestLoading}
                        onClick={handleRequestQuote}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-200 disabled:opacity-40 disabled:shadow-none transition-all active:scale-95"
                    >
                        {requestLoading
                            ? <Loader2 size={16} className="animate-spin" />
                            : <FileText size={16} />}
                        {requestLoading ? t.quote.sending : t.quote.requestQuote}
                    </button>

                    {/* Order Now */}
                    <Button
                        disabled={!hasQuotes || !agreed}
                        onClick={() => router.push("/checkout")}
                        className="w-full py-6 text-base font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-none disabled:opacity-40"
                    >
                        <ShoppingBag size={16} className="mr-2" />
                        {t.quote.orderNow}
                    </Button>

                    {/* Save to Cart */}
                    <Button
                        variant="outline"
                        disabled={!hasQuotes}
                        onClick={() => {
                            import("sonner").then(m => m.toast.success(t.quote.saveToCart + "!", { 
                                description: t.quote.loginRequired
                            }));
                        }}
                        className="w-full py-6 text-base font-bold rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-40"
                    >
                        <ShoppingCart size={16} className="mr-2" />
                        {t.quote.saveToCart}
                    </Button>
                </div>

                {/* Login hint */}
                {!session?.user && hasQuotes && (
                    <p className="text-center text-[10px] text-slate-400 mt-3">
                        {t.quote.loginRequired}
                    </p>
                )}
            </div>

            {/* Shipping Estimate */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1 mb-1">
                    {t.quote.shippingEstimate} <Info className="w-3 h-3 text-slate-400" />
                </h3>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{t.quote.weightLabel} <Info className="w-3 h-3 inline text-slate-300" /></span>
                    <span className="font-bold text-slate-900">
                        {weight > 0 ? `${weight.toFixed(2)} g` : "--"}
                    </span>
                </div>
            </div>

            {/* Coupons */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        {t.quote.discountCoupon} <Info className="w-3 h-3 text-slate-400" />
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
