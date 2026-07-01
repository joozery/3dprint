"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Loader2, FileText, ShoppingCart, ShoppingBag, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
    const weight     = quotes.reduce((sum, q) => sum + (q?.weightGrams || 0), 0);
    const hasQuotes  = quotes.length > 0;

    // ── Shipping estimate ──────────────────────────────────────────
    const [country, setCountry]         = useState("TH");
    const [zipcode, setZipcode]         = useState("");
    const [intlCity, setIntlCity]       = useState("");
    const [intlPostal, setIntlPostal]   = useState("");
    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [loadingRates, setLoadingRates]   = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isIntl = country !== "TH";

    const fetchRates = (overrides?: object) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            // ใช้ default dimensions ถ้ายังไม่มีไฟล์
            const maxW     = quotes.length > 0 ? Math.max(...quotes.map((q: any) => (q.dimensions?.x || 10) / 10)) : 10;
            const maxL     = quotes.length > 0 ? Math.max(...quotes.map((q: any) => (q.dimensions?.y || 10) / 10)) : 10;
            const maxH     = quotes.length > 0 ? quotes.reduce((s: number, q: any) => s + (q.dimensions?.z || 5) / 10, 0) : 5;
            const weightKg = Math.max(weight / 1000, 0.1);
            const dims     = { width: Math.ceil(maxW), length: Math.ceil(maxL), height: Math.ceil(maxH) };
            setLoadingRates(true);
            setShippingRates([]);

            console.log("[SidebarSummary] fetchRates isIntl=", isIntl, "country=", country);
            if (isIntl) {
                // International: DHL + FedEx in parallel
                const dhlReq = fetch("/api/shipping/rates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        countryCode: country,
                        dst_zipcode: intlPostal || "",
                        dst_city:    intlCity   || "",
                        weightKg, ...dims, ...overrides,
                    }),
                }).then(r => r.json()).catch(() => ({ rates: [] }));

                const fedexReq = fetch("/api/fedex/rates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        dst_country:  country,
                        dst_zipcode:  intlPostal || "",
                        dst_city:     intlCity   || "",
                        dst_province: "",
                        weightKg, ...dims, ...overrides,
                    }),
                }).then(r => r.json()).catch(() => ({ rates: [] }));

                Promise.all([dhlReq, fedexReq]).then(([dhl, fedex]) => {
                    const dhlRates   = dhl.rates  || [];
                    const fedexRates = (fedex.rates || []).map((r: any) => ({
                        courier_code:  `fedex:${r.serviceType}`,
                        courier_name:  `FedEx ${r.serviceName}`,
                        logo:          "/shipping/fedex.png",
                        total_price:   r.totalPrice,
                        estimate_days: r.estimatedDays,
                    }));
                    setShippingRates([...dhlRates, ...fedexRates]);
                }).finally(() => setLoadingRates(false));
            } else {
                // Domestic TH: iShip only
                fetch("/api/shipping/rates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        countryCode:  "TH",
                        dst_zipcode:  zipcode,
                        dst_city:     "",
                        dst_province: "",
                        dst_amphure:  "",
                        dst_district: "",
                        weightKg, ...dims, ...overrides,
                    }),
                })
                    .then(r => r.json())
                    .then(d => { if (d.rates) setShippingRates(d.rates); })
                    .catch(() => {})
                    .finally(() => setLoadingRates(false));
            }
        }, 600);
    };

    useEffect(() => {
        setShippingRates([]);
        setZipcode("");
        setIntlCity("");
        setIntlPostal("");
    }, [country]);

    useEffect(() => {
        if (!isIntl && zipcode.length === 5) fetchRates();
    }, [zipcode, weight]);

    useEffect(() => {
        if (isIntl && intlCity.trim().length >= 2) fetchRates();
    }, [intlCity, intlPostal, weight]);

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
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1 mb-3">
                    {t.quote.shippingEstimate} <Info className="w-3 h-3 text-slate-400" />
                </h3>

                {/* Weight row */}
                <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-500">{t.quote.weightLabel}</span>
                    <span className="font-bold text-slate-900">
                        {weight > 0 ? `${weight.toFixed(2)} g` : "--"}
                    </span>
                </div>

                {/* Country selector */}
                <div className="mb-2">
                    <select
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors bg-white"
                    >
                        <option value="TH">🇹🇭 ไทย (ในประเทศ)</option>
                        <option value="US">🇺🇸 United States</option>
                        <option value="GB">🇬🇧 United Kingdom</option>
                        <option value="JP">🇯🇵 Japan</option>
                        <option value="CN">🇨🇳 China</option>
                        <option value="SG">🇸🇬 Singapore</option>
                        <option value="MY">🇲🇾 Malaysia</option>
                        <option value="AU">🇦🇺 Australia</option>
                        <option value="DE">🇩🇪 Germany</option>
                        <option value="FR">🇫🇷 France</option>
                        <option value="CA">🇨🇦 Canada</option>
                        <option value="KR">🇰🇷 South Korea</option>
                        <option value="HK">🇭🇰 Hong Kong</option>
                        <option value="TW">🇹🇼 Taiwan</option>
                        <option value="AE">🇦🇪 UAE</option>
                        <option value="IN">🇮🇳 India</option>
                        <option value="NL">🇳🇱 Netherlands</option>
                        <option value="IT">🇮🇹 Italy</option>
                        <option value="ES">🇪🇸 Spain</option>
                        <option value="CH">🇨🇭 Switzerland</option>
                        <option value="ID">🇮🇩 Indonesia</option>
                        <option value="VN">🇻🇳 Vietnam</option>
                        <option value="PH">🇵🇭 Philippines</option>
                    </select>
                </div>

                {/* Zipcode input (TH) */}
                {!isIntl && (
                    <div className="mb-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="กรอกรหัสไปรษณีย์ปลายทาง"
                            value={zipcode}
                            onChange={e => setZipcode(e.target.value.replace(/\D/g, ""))}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                        />
                    </div>
                )}

                {/* City + Postal (International) */}
                {isIntl && (
                    <div className="space-y-2 mb-2">
                        <input
                            type="text"
                            placeholder="City / เมือง *"
                            value={intlCity}
                            onChange={e => setIntlCity(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Postal code (optional)"
                            value={intlPostal}
                            onChange={e => setIntlPostal(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                        />
                        <button
                            onClick={() => { if (intlCity.trim()) fetchRates(); }}
                            className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors"
                        >
                            คำนวณราคาขนส่ง
                        </button>
                        <p className="text-[10px] text-amber-600">ส่งผ่าน DHL Express & FedEx</p>
                    </div>
                )}

                {/* Rates result */}
                {loadingRates && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                        <RefreshCw size={12} className="animate-spin" /> กำลังโหลดราคาขนส่ง...
                    </div>
                )}

                {!loadingRates && shippingRates.length > 0 && (
                    <div className="space-y-1.5 mt-1">
                        {shippingRates.map(r => (
                            <div key={r.courier_code} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                    {r.logo && (
                                        <img src={r.logo} alt={r.courier_name}
                                            className="w-8 h-6 object-contain rounded border border-slate-100 bg-white p-0.5"
                                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                    )}
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{r.courier_name}</p>
                                        <p className="text-[10px] text-slate-400">
                                            {isIntl ? r.estimate_days : `~${r.estimate_days} วัน`}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-slate-800">฿{r.total_price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                {!loadingRates && (
                    (!isIntl && zipcode.length === 5) ||
                    (isIntl && intlCity.trim().length >= 2)
                ) && shippingRates.length === 0 && (
                    <p className="text-[10px] text-slate-400 mt-1">ไม่พบราคาขนส่งสำหรับที่อยู่นี้</p>
                )}
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
