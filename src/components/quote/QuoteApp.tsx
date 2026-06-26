"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const COUNTRY_CODES: Record<string, string> = {
    "Afghanistan":"AF","Albania":"AL","Algeria":"DZ","Argentina":"AR","Armenia":"AM",
    "Australia":"AU","Austria":"AT","Azerbaijan":"AZ","Bahrain":"BH","Bangladesh":"BD",
    "Belgium":"BE","Brazil":"BR","Bulgaria":"BG","Cambodia":"KH","Canada":"CA",
    "Chile":"CL","China":"CN","Colombia":"CO","Croatia":"HR","Cyprus":"CY",
    "Czechia":"CZ","Denmark":"DK","Egypt":"EG","Estonia":"EE","Ethiopia":"ET",
    "Finland":"FI","France":"FR","Georgia":"GE","Germany":"DE","Ghana":"GH",
    "Greece":"GR","Hong Kong":"HK","Hungary":"HU","Iceland":"IS","India":"IN",
    "Indonesia":"ID","Iran":"IR","Iraq":"IQ","Ireland":"IE","Israel":"IL",
    "Italy":"IT","Jamaica":"JM","Japan":"JP","Jordan":"JO","Kazakhstan":"KZ",
    "Kenya":"KE","Kuwait":"KW","Laos":"LA","Latvia":"LV","Lebanon":"LB",
    "Lithuania":"LT","Luxembourg":"LU","Malaysia":"MY","Maldives":"MV",
    "Malta":"MT","Mexico":"MX","Moldova":"MD","Mongolia":"MN","Morocco":"MA",
    "Myanmar":"MM","Nepal":"NP","Netherlands":"NL","New Zealand":"NZ",
    "Nigeria":"NG","North Korea":"KP","Norway":"NO","Oman":"OM","Pakistan":"PK",
    "Palestine":"PS","Peru":"PE","Philippines":"PH","Poland":"PL","Portugal":"PT",
    "Qatar":"QA","Romania":"RO","Russia":"RU","Saudi Arabia":"SA","Serbia":"RS",
    "Singapore":"SG","Slovakia":"SK","Slovenia":"SI","Somalia":"SO",
    "South Africa":"ZA","South Korea":"KR","Spain":"ES","Sri Lanka":"LK",
    "Sweden":"SE","Switzerland":"CH","Syria":"SY","Taiwan":"TW","Thailand":"TH",
    "Tunisia":"TN","Turkey":"TR","Uganda":"UG","Ukraine":"UA",
    "United Arab Emirates":"AE","United Kingdom":"GB","United States":"US",
    "Uruguay":"UY","Uzbekistan":"UZ","Venezuela":"VE","Vietnam":"VN",
    "Yemen":"YE","Zambia":"ZM","Zimbabwe":"ZW",
};
import { Upload, Info, Trash2, ChevronDown, CheckCircle2, AlertCircle, Layers, Plus, Lock, History, User, ShoppingCart, ChevronRight, RotateCcw, ZoomIn, ZoomOut, Move, Check, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Viewer3D } from "./Viewer3D";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface QuoteAppProps {
    quotes: any[];
    onAdd: (q: any) => void;
    onUpdate: (q: any) => void;
    onRemove: (id: string) => void;
}

export function QuoteApp({ quotes, onAdd, onUpdate, onRemove }: QuoteAppProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { t } = useLanguage();
    const [activeId, setActiveId] = useState<string | null>(quotes.length > 0 ? quotes[0]._id : null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(quotes.map(q => q._id)));
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState("");
    const [uploadPhase, setUploadPhase] = useState<"upload" | "processing">("upload");
    const [isDragging, setIsDragging] = useState(false);
    const [debugStack, setDebugStack] = useState<string | null>(null);

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountValue: number } | null>(null);
    const [couponError, setCouponError] = useState("");
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const [rawFiles, setRawFiles] = useState<Record<string, File>>({});
    const [dbMaterials, setDbMaterials] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState("shaded");
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);
    const [userAddresses, setUserAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [loadingShippingRates, setLoadingShippingRates] = useState(false);
    const [selectedCourierCode, setSelectedCourierCode] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const viewerRef = useRef<any>(null);

    const activeQuote = quotes.find(q => q._id === activeId);

    // Sync activeId when quotes list changes
    useEffect(() => {
        if (quotes.length > 0 && !activeId) {
            setActiveId(quotes[0]._id);
        }
    }, [quotes, activeId]);

    const prevQuoteIdsRef = useRef<Set<string>>(new Set(quotes.map(q => q._id)));

    // Auto-select newly added quotes; remove deleted ones
    useEffect(() => {
        const currentIds = new Set(quotes.map(q => q._id));
        setSelectedIds(prev => {
            const next = new Set<string>(prev);
            prev.forEach(id => { if (!currentIds.has(id)) next.delete(id); });
            currentIds.forEach(id => { if (!prevQuoteIdsRef.current.has(id)) next.add(id); });
            return next;
        });
        prevQuoteIdsRef.current = currentIds;
    }, [quotes]);

    // Load materials and user addresses
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Materials
                const matRes = await fetch('/api/admin/materials');
                const matData = await matRes.json();
                if (Array.isArray(matData)) setDbMaterials(matData.filter((m: any) => m.isActive !== false));
                else if (matData.success && matData.materials) setDbMaterials(matData.materials.filter((m: any) => m.isActive !== false));

                // Fetch User Addresses if logged in
                if (session) {
                    const profileRes = await fetch('/api/profile/billing');
                    const profileData = await profileRes.json();
                    if (profileData.user?.shippingAddresses) {
                        const addrs = profileData.user.shippingAddresses;
                        setUserAddresses(addrs);
                        const def = addrs.find((a: any) => a.isDefault);
                        if (def) setSelectedAddressId(String(def._id));
                        else if (addrs.length > 0) setSelectedAddressId(String(addrs[0]._id));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();
    }, [session]);

    // Fetch real shipping rates when address or quotes change
    useEffect(() => {
        const addr = userAddresses.find(a => String(a._id) === String(selectedAddressId));
        const sel = quotes.filter(q => selectedIds.has(q._id));
        if (!addr || sel.length === 0) { setShippingRates([]); return; }

        const isIntl = !!addr.isInternational;
        const zipCode = addr.zipCode || "";

        if (!isIntl && zipCode.length !== 5) { setShippingRates([]); return; }
        if (isIntl && !addr.subDistrict?.trim()) { setShippingRates([]); return; }

        const weight = sel.reduce((s: number, q: any) => s + (q.weightGrams || 0), 0);
        const maxW = Math.max(...sel.map((q: any) => (q.dimensions?.x || 10) / 10));
        const maxL = Math.max(...sel.map((q: any) => (q.dimensions?.y || 10) / 10));
        const maxH = sel.reduce((s: number, q: any) => s + (q.dimensions?.z || 5) / 10, 0);

        const body = isIntl ? {
            countryCode: COUNTRY_CODES[addr.province] || "US",
            dst_city:    addr.subDistrict,
            dst_zipcode: zipCode,
            weightKg: Math.max(weight / 1000, 0.1),
            width: Math.ceil(maxW), length: Math.ceil(maxL), height: Math.ceil(maxH),
        } : {
            countryCode:  "TH",
            dst_zipcode:  zipCode,
            dst_province: addr.province || "",
            dst_amphure:  addr.district || "",
            dst_district: addr.subDistrict || "",
            weightKg: Math.max(weight / 1000, 0.1),
            width: Math.ceil(maxW), length: Math.ceil(maxL), height: Math.ceil(maxH),
        };

        setLoadingShippingRates(true);
        setShippingRates([]);
        fetch("/api/shipping/rates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then(r => r.json())
            .then(d => {
                if (d.rates && d.rates.length > 0) {
                    setShippingRates(d.rates);
                    setSelectedCourierCode(prev => d.rates.find((r: any) => r.courier_code === prev) ? prev : d.rates[0].courier_code);
                }
            })
            .catch(() => {})
            .finally(() => setLoadingShippingRates(false));
    }, [selectedAddressId, userAddresses, quotes.length]);

    const processFiles = async (files: FileList | File[]) => {
        if (!files || files.length === 0) return;

        if (!session) {
            router.push('/login?callbackUrl=/quote');
            return;
        }

        setUploading(true);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setCurrentFile(file.name);
            setProgress(0);
            setUploadPhase("upload");

            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await axios.post("/api/quote/upload", formData, {
                    onUploadProgress: (progressEvent) => {
                        const total = progressEvent.total || file.size || 1;
                        const p = Math.round((progressEvent.loaded * 100) / total);
                        setProgress(p);
                        // อัปโหลดถึง 100% แล้ว แต่ server ยังต้อง slice ไฟล์ (PrusaSlicer) ต่อ ~10-40s
                        if (p >= 100) setUploadPhase("processing");
                    }
                });

                if (res.data.success) {
                    const newQuote = res.data.data;
                    onAdd(newQuote);
                    setRawFiles(prev => ({ ...prev, [newQuote._id]: file }));
                    setActiveId(newQuote._id);
                }
            } catch (err: any) {
                console.error("Upload failed", err);
                alert(err.response?.data?.message || t.quote.uploadError);
            }
        }
        setUploading(false);
        setCurrentFile("");
        setUploadPhase("upload");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        await processFiles(files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        await processFiles(files);
    };

    const deleteQuote = async (id: string) => {
        try {
            await axios.delete(`/api/quote/${id}`);
            onRemove(id);
            if (activeId === id) {
                const remaining = quotes.filter(q => q._id !== id);
                setActiveId(remaining.length > 0 ? remaining[0]._id : null);
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert("ไม่สามารถลบไฟล์ได้ กรุณาลองใหม่อีกครั้ง");
        }
    };

    const patchTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const patchQuote = async (id: string, updates: any, opts?: { debounceMs?: number }) => {
        try {
            // Update local state first for responsiveness
            const current = quotes.find(q => q._id === id);
            if (!current) return;
            const updated = { ...current, ...updates };
            
            // Recalculate price: วัสดุ + เวลา + setup
            if (updates.material || updates.technology || updates.quantity || updates.finish || updates.infill !== undefined) {
                const mat = dbMaterials.find(m => m._id === (updates.material || current.material));
                if (mat) {
                    const qty           = updates.quantity ?? current.quantity ?? 1;
                    const supportCm3    = current.supportVolumeCm3 || 0;
                    const density       = mat.density               || 1.15;
                    const sellPerGram   = mat.pricing?.sellPerGram   || 1;
                    const sellPerMinute = mat.pricing?.sellPerMinute || 0;
                    const setupFee      = mat.pricing?.setupFee      || 0;

                    // infill เป็น concept เฉพาะ FDM — เก็บค่าที่ user ปรับไว้เสมอ แต่ใช้คำนวณราคาจริง
                    // เฉพาะตอน technology = fdm เท่านั้น เทคโนโลยีอื่น (MJF/SLA/SLS ฯลฯ) ถือว่าทึบเต็มเนื้อ (100%)
                    // mirrors server logic ใน /api/quote/[id]/route.ts
                    const BASE_INFILL          = 20;
                    const MAX_INFILL           = 100;
                    const finalTechnology      = (updates.technology || current.technology || "sla").toLowerCase();
                    const finalInfill          = updates.infill ?? current.infill ?? BASE_INFILL;
                    const pricingInfill        = finalTechnology === "fdm" ? finalInfill : MAX_INFILL;
                    const shellVolumeCm3       = current.shellVolumeCm3 ?? 0;
                    const infillSlopeCm3PerPct = current.infillSlopeCm3PerPercent ?? 0;

                    let filamentCm3: number;
                    if (shellVolumeCm3 > 0 || infillSlopeCm3PerPct > 0) {
                        // ไม่บวก supportCm3 ที่นี่ — chargeableVol ด้านล่างจะบวกให้เอง
                        filamentCm3 = shellVolumeCm3 + infillSlopeCm3PerPct * pricingInfill;
                    } else {
                        // fallback สำหรับ quote เก่าก่อนมี double-slice
                        // ห้ามใช้ current.filamentCm3 เป็น base — มันคือผลลัพธ์จากการคำนวณ infill ครั้งก่อน
                        // ถ้าใช้จะพอกพูนค่าซ้อนกันทุกครั้งที่ลาก slider (บั๊กราคาพุ่งจาก 700 เป็น 70,000)
                        const baseFilamentCm3 = current.baseFilamentCm3 || current.volumeCm3 || 10;
                        const volumeCm3       = current.volumeCm3 || 0;
                        const approxShell     = Math.max(0, baseFilamentCm3 - volumeCm3 * (BASE_INFILL / 100));
                        filamentCm3 = approxShell + volumeCm3 * (pricingInfill / 100);
                    }

                    // print time: ใช้ shellPrintTimeMinutes + timeSlopePerPercent จาก double-slice เช่นกัน
                    const parseMins = (s: string) => {
                        if (!s || s === "N/A") return 0;
                        let m = 0;
                        const h = s.match(/(\d+)h/); const min = s.match(/(\d+)m/); const sec = s.match(/(\d+)s/);
                        if (h) m += parseInt(h[1]) * 60;
                        if (min) m += parseInt(min[1]);
                        if (sec) m += parseInt(sec[1]) / 60;
                        return m;
                    };
                    const shellPrintTimeMinutes = current.shellPrintTimeMinutes ?? 0;
                    const timeSlopePerPct       = current.timeSlopePerPercent ?? 0;
                    const basePrintMins         = current.basePrintTimeMinutes || parseMins(current.printTime || "0m");

                    let printTimeMinutes: number;
                    if (shellPrintTimeMinutes > 0 && timeSlopePerPct > 0) {
                        printTimeMinutes = shellPrintTimeMinutes + timeSlopePerPct * pricingInfill;
                    } else {
                        printTimeMinutes = basePrintMins * (0.70 + 0.30 * (pricingInfill / BASE_INFILL));
                    }

                    // finish price
                    const finishId = updates.finish || current.finish || "standard";
                    let finishPrice = 0;
                    if (finishId !== "standard") {
                        const proc = mat.postProcessing?.find((p: any) => p.name === finishId);
                        if (proc) finishPrice = proc.sellPrice || 0;
                    }

                    const chargeableVol = filamentCm3 + supportCm3;
                    const weight        = chargeableVol * density;
                    const materialCost  = weight * sellPerGram;
                    const timeCost      = printTimeMinutes * sellPerMinute;
                    const pricePerUnit  = materialCost + timeCost + finishPrice;
                    const totalPrice    = pricePerUnit * qty + setupFee;

                    updated.priceDetail = {
                        totalPrice:   parseFloat(totalPrice.toFixed(2)),
                        pricePerUnit: parseFloat(pricePerUnit.toFixed(2)),
                        materialCost: parseFloat(materialCost.toFixed(2)),
                        timeCost:     parseFloat(timeCost.toFixed(2)),
                        finishCost:   parseFloat(finishPrice.toFixed(2)),
                        setupFee:     parseFloat(setupFee.toFixed(2)),
                    };
                    updated.filamentCm3 = filamentCm3;
                    if (updates.infill !== undefined) updated.infill = finalInfill;
                    // อัพเดต materialName ทุกครั้งที่มีการเปลี่ยนวัสดุ
                    if (updates.material || updates.technology) {
                        updated.materialName = mat.name || "";
                    }
                }
            }
            
            onUpdate(updated);

            // Persist to server. ยกเลิก write รอบก่อนหน้าของ quote เดียวกันเสมอ (ทั้งแบบ debounce และไม่)
            // เพื่อไม่ให้ request เก่าที่ตอบกลับช้ากว่า ทับค่าล่าสุดในฐานข้อมูล (เคยเกิดตอนลาก infill slider เร็วๆ)
            if (patchTimers.current[id]) {
                clearTimeout(patchTimers.current[id]);
                delete patchTimers.current[id];
            }

            const sendPatch = () => axios.patch(`/api/quote/${id}`, updates).catch(err => console.error("Failed to update quote", err));

            if (opts?.debounceMs) {
                patchTimers.current[id] = setTimeout(sendPatch, opts.debounceMs);
            } else {
                await sendPatch();
            }
        } catch (err) {
            console.error("Failed to update quote", err);
        }
    };

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const allSelected = quotes.length > 0 && quotes.every(q => selectedIds.has(q._id));
    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds(new Set());
        else setSelectedIds(new Set(quotes.map(q => q._id)));
    };

    const handlePlaceOrder = async () => {
        if (!isTermsAccepted) return;
        const selected = quotes.filter(q => selectedIds.has(q._id));
        if (selected.length === 0) {
            import("sonner").then(m => m.toast.error("กรุณาเลือกอย่างน้อย 1 ไฟล์"));
            return;
        }
        const ids = selected.map(q => q._id).join(',');
        const addrId = selectedAddressId && selectedAddressId !== "undefined" ? selectedAddressId : "";
        const url = `/checkout?addressId=${addrId}&ids=${ids}&courier=${selectedCourierCode}${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ''}`;
        router.push(url);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setValidatingCoupon(true);
        setCouponError("");

        try {
            const totalPrice = quotes.filter(q => selectedIds.has(q._id)).reduce((sum, q) => sum + (q.priceDetail?.totalPrice || 0), 0);
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, orderValue: totalPrice })
            });
            const data = await res.json();

            if (data.success) {
                setAppliedCoupon({
                    code: data.coupon.code,
                    discountValue: data.discountValue
                });
                setCouponCode("");
            } else {
                setCouponError(data.error || "เกิดข้อผิดพลาด");
            }
        } catch (err) {
            setCouponError("ตรวจสอบคูปองไม่สำเร็จ");
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
    };

    const handleGetQuotation = async () => {
        if (!session) {
            router.push('/login?callbackUrl=/quote');
            return;
        }
        const ids = quotes.filter(q => selectedIds.has(q._id)).map(q => q._id).filter(Boolean);
        if (ids.length === 0) {
            import("sonner").then(m => m.toast.error("กรุณาเลือกอย่างน้อย 1 ไฟล์"));
            return;
        }
        try {
            const res = await fetch("/api/quote/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");
            router.push(`/quote/request?ids=${data.ids.join(",")}`);
        } catch (err: any) {
            alert(err.message || "เกิดข้อผิดพลาด");
        }
    };

    const handleSaveToCart = () => {
        import("sonner").then(m => m.toast.success("บันทึกลงตะกร้าแล้ว!", {
            description: "ชิ้นงานของคุณถูกบันทึกไว้แล้ว สามารถกลับมาดำเนินการต่อได้ภายหลัง"
        }));
    };

    const handleCopyToAll = async () => {
        if (!activeQuote || quotes.length <= 1) return;
        const others = quotes.filter(q => q._id !== activeQuote._id);
        for (const q of others) {
            await patchQuote(q._id, {
                technology: activeQuote.technology,
                material: activeQuote.material,
                color: activeQuote.color,
                finish: activeQuote.finish,
                quantity: activeQuote.quantity,
                deliverySpeed: activeQuote.deliverySpeed,
            });
        }
        import("sonner").then(m => m.toast.success("คัดลอกการตั้งค่าสำเร็จ!", {
            description: `คัดลอกไปยัง ${others.length} ชิ้นงานแล้ว`
        }));
    };

    const getModelColor = (tech: string, matId: string) => {
        const getColorHex = (colorName: string) => {
            const name = colorName.toLowerCase().trim();
            if (name.includes('black') || name.includes('ดำ')) return '#222';
            if (name.includes('grey') || name.includes('gray') || name.includes('เทา')) return '#888';
            if (name.includes('blue') || name.includes('น้ำเงิน') || name.includes('ฟ้า')) return '#3b82f6';
            if (name.includes('green') || name.includes('เขียว')) return '#22c55e';
            if (name.includes('yellow') || name.includes('เหลือง')) return '#fbbf24';
            if (name.includes('red') || name.includes('แดง')) return '#ef4444';
            if (name.includes('orange') || name.includes('ส้ม')) return '#f97316';
            if (name.includes('purple') || name.includes('ม่วง')) return '#a855f7';
            if (name.includes('pink') || name.includes('ชมพู')) return '#ec4899';
            if (name.includes('brown') || name.includes('น้ำตาล')) return '#78350f';
            if (name.includes('transparent') || name.includes('ใส')) return 'rgba(255, 255, 255, 0.5)';
            return '#fff';
        };

        if (activeQuote?.color) return getColorHex(activeQuote.color);
        const mat = dbMaterials.find(m => m._id === matId);
        if (mat) {
            if (mat.colorOptions && mat.colorOptions.length > 0) return mat.colorOptions[0].hex;
            if (mat.colors && mat.colors.length > 0) return getColorHex(mat.colors[0]);
        }
        if (tech.toLowerCase() === 'sla') return '#94a3b8';
        return '#3b82f6';
    };

    // Dynamic technologies derived from active materials in DB
    const technologies = Array.from(
        new Set(dbMaterials.map((m: any) => m.technology?.toLowerCase()).filter(Boolean))
    ).map((tech: any) => ({ id: tech, name: tech.toUpperCase() }));

    const selectedQuotes = quotes.filter(q => selectedIds.has(q._id));
    const totalPrice = selectedQuotes.reduce((sum, q) => sum + (q.priceDetail?.totalPrice || 0), 0);
    const SETUP_FEE = 150;
    const COUPON_DISCOUNT = appliedCoupon ? appliedCoupon.discountValue : 0;
    const taxableAmount = totalPrice + SETUP_FEE - COUPON_DISCOUNT;
    const vat = taxableAmount * 0.07;
    const selectedRate = shippingRates.find(r => r.courier_code === selectedCourierCode) || shippingRates[0] || null;
    const deliveryCost = selectedRate ? selectedRate.total_price : 0;
    const finalPrice = Math.max(0, taxableAmount + vat + deliveryCost);

    const brandPrimary = "#2563eb";
    const brandPrimaryDeep = "#1d4ed8";
    const bgMain = "oklch(0.985 0.004 310)";
    const bgSidebar = "oklch(0.97 0.006 310)";
    const lineBorder = "oklch(0.88 0.012 310)";

    return (
        <div className="h-full w-full flex flex-col text-slate-900 font-sans overflow-hidden" style={{ fontFamily: 'Sarabun, sans-serif', backgroundColor: bgMain }}>
            {/* 3. MAIN GRID */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px_280px] xl:grid-cols-[280px_1fr_340px_300px] overflow-hidden">
                
                {/* 3.1 SIDEBAR: Files */}
                <aside className="flex flex-col overflow-hidden" style={{ backgroundColor: bgSidebar, borderRight: `1px solid ${lineBorder}` }}>
                    <div className="p-4 bg-white" style={{ borderBottom: `1px solid ${lineBorder}` }}>
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                                {t.quote.filesLabel} · <span className="text-blue-500">{selectedIds.size}</span>/{quotes.length}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {quotes.length > 0 && (
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-[9px] font-black px-2 py-1 border border-slate-200 rounded text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all uppercase tracking-wider"
                                    >
                                        {allSelected ? "ยกเลิก" : "เลือกทั้งหมด"}
                                    </button>
                                )}
                                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-2 py-1 text-[10px] bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-bold transition-all">
                                    <Plus className="w-3 h-3" /> {t.quote.addFile}
                                </button>
                            </div>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept=".stl,.3mf,.obj,.step,.stp" />
                        </div>
                        <button
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            disabled={uploading}
                            className={cn(
                                "w-full py-8 px-3 border-[1.5px] border-dashed rounded-xl flex flex-col items-center gap-2 transition-all",
                                isDragging ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300",
                                uploading ? "cursor-default" : "text-slate-400"
                            )}
                        >
                            {uploading ? (
                                <>
                                    <div className="w-full flex items-center justify-between text-[11px] font-black text-slate-700">
                                        <span className="truncate max-w-[140px]">{currentFile}</span>
                                        <span className="tabular-nums text-blue-600">{progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-200", uploadPhase === "processing" ? "bg-amber-400 animate-pulse" : "bg-blue-500")}
                                            style={{ width: uploadPhase === "processing" ? "100%" : `${progress}%` }}
                                        />
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                        {uploadPhase === "processing" ? "กำลังวิเคราะห์ไฟล์ 3D (slicing)... อาจใช้เวลาถึง 1 นาที" : "กำลังอัปโหลด..."}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-7 h-7 opacity-20" />
                                    <div className="text-[11px] font-bold text-slate-600">{t.quote.dropOrSelect}</div>
                                    <div className="text-[9px] font-mono tracking-wide opacity-50 uppercase">{t.quote.fileFormats}</div>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
                        {quotes.map(q => {
                            const isSelected = selectedIds.has(q._id);
                            return (
                                <div key={q._id} onClick={() => setActiveId(q._id)} className={cn("flex items-center gap-2.5 p-3 cursor-pointer rounded-xl border transition-all group relative", activeId === q._id ? "bg-white border-slate-200 shadow-lg shadow-slate-100 ring-1 ring-slate-100" : "border-transparent hover:bg-slate-50")}>
                                    {/* Checkbox */}
                                    <button
                                        onClick={(e) => toggleSelect(q._id, e)}
                                        className={cn(
                                            "w-5 h-5 rounded-[5px] border-2 shrink-0 flex items-center justify-center transition-all",
                                            isSelected
                                                ? "bg-blue-600 border-blue-600"
                                                : "border-slate-300 bg-white hover:border-blue-400"
                                        )}
                                    >
                                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                    </button>
                                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-all", activeId === q._id ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-300")}>
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={cn("text-[12px] font-black truncate", activeId === q._id ? "text-slate-900" : isSelected ? "text-slate-700" : "text-slate-400")}>{q.originalName}</div>
                                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5 font-bold uppercase">
                                            <span className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-blue-500" : "bg-slate-200")}></span>
                                            {q.volumeCm3?.toFixed(1) || "-"} cm³ · ×{q.quantity || 1}
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteQuote(q._id); }} className="p-1.5 text-slate-200 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-4 bg-white flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-tighter" style={{ borderTop: `1px solid ${lineBorder}` }}>
                        <Lock className="w-3.5 h-3.5" /> {t.quote.sslNote}
                    </div>
                </aside>

                {/* 3.2 VIEWER: Center */}
                <main className="flex flex-col overflow-hidden bg-white relative" style={{ borderRight: `1px solid ${lineBorder}` }}>
                    {activeQuote ? (
                        <>
                            <div className="p-2.5 px-4 flex items-center justify-between bg-white z-10 flex-wrap gap-2.5" style={{ borderBottom: `1px solid ${lineBorder}` }}>
                                <div className="flex items-center gap-2 min-w-0">
                                    <Layers className="w-3.5 h-3.5 opacity-40 shrink-0" />
                                    <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[200px] xl:max-w-[300px]">
                                        {activeQuote.originalName}
                                    </span>
                                    <span className="shrink-0 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-[3px] text-[10px] font-mono tracking-wide">
                                        {((activeQuote.volumeCm3 || 10) * 4).toFixed(1)} KB
                                    </span>
                                </div>
                                <div className="flex-1"></div>
                                <div className="flex rounded-md overflow-hidden shrink-0 border" style={{ borderColor: lineBorder }}>
                                    {['Shaded', 'Wireframe', 'ความหนาผนัง', 'ขนาด'].map((mode, index) => (
                                        <button 
                                            key={mode} 
                                            onClick={() => setViewMode(mode.toLowerCase())} 
                                            className={cn(
                                                "px-2.5 py-1.5 text-[11px] transition-colors whitespace-nowrap",
                                                viewMode === mode.toLowerCase() 
                                                    ? "bg-[#8848a8] text-white font-semibold" 
                                                    : "bg-transparent text-slate-700 font-medium hover:bg-slate-50",
                                                index !== 3 ? "border-r" : ""
                                            )}
                                            style={{ borderColor: index !== 3 ? lineBorder : 'transparent', textTransform: 'uppercase' }}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 relative bg-[#f8f9fa] overflow-hidden flex items-center justify-center">
                                {/* SVG Grid Background from HTML */}
                                <svg viewBox="-120 -120 240 240" width="100%" height="100%" className="absolute inset-0 pointer-events-none" style={{ display: 'block' }}>
                                    <defs>
                                        <pattern id="dotgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <circle cx="10" cy="10" r="1" fill="rgba(30,36,51,0.15)"></circle>
                                        </pattern>
                                    </defs>
                                    <rect x="-120" y="-120" width="240" height="240" fill="url(#dotgrid)"></rect>
                                    <line x1="-120" y1="0" x2="120" y2="0" stroke="rgba(30,36,51,0.08)" strokeWidth="0.5"></line>
                                    <line x1="0" y1="-120" x2="0" y2="120" stroke="rgba(30,36,51,0.08)" strokeWidth="0.5"></line>
                                    <ellipse cx="0" cy="55" rx="55" ry="8" fill="rgba(30,36,51,0.12)"></ellipse>
                                </svg>
                                
                                <div className="w-full h-full z-10 relative">
                                    <Viewer3D 
                                        ref={viewerRef}
                                        key={activeQuote._id}
                                        file={rawFiles[activeQuote._id]} 
                                        fileUrl={activeQuote.fileUrl} 
                                        fileName={activeQuote.originalName} 
                                        color={getModelColor(activeQuote.technology || 'sla', activeQuote.material || '')}
                                        viewMode={viewMode}
                                    />
                                </div>
                                
                                {/* Viewer Overlays - Left Tool Buttons */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                                    <button 
                                        onClick={() => viewerRef.current?.resetView()}
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => viewerRef.current?.zoomIn()}
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <ZoomIn className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => viewerRef.current?.zoomOut()}
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <ZoomOut className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        className="w-[30px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                                    >
                                        <Move className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Viewer Overlays - Right Tool Buttons */}
                                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-20">
                                    <div 
                                        onClick={() => viewerRef.current?.setView('ISO')}
                                        className="h-[30px] px-2 bg-white/90 border border-slate-200 rounded-[4px] text-slate-50 flex items-center justify-center text-[10px] font-mono tracking-widest cursor-pointer hover:bg-white"
                                    >
                                        ISO
                                    </div>
                                    <div className="flex gap-1">
                                        {['X', 'Y', 'Z'].map(axis => (
                                            <button 
                                                key={axis} 
                                                onClick={() => viewerRef.current?.setView(axis)}
                                                className="w-[28px] h-[30px] bg-white/90 border border-slate-200 rounded-[4px] text-slate-700 flex items-center justify-center hover:bg-white transition-colors font-mono text-[10px] font-bold cursor-pointer"
                                            >
                                                {axis}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Viewer Overlays - Bounding Box */}
                                <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded-[4px] p-2.5 px-3 z-20 flex flex-col gap-[3px] text-slate-800 font-mono text-[10px] tracking-[0.5px]">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">Bounding box</div>
                                    <div>X &nbsp; {activeQuote.dimensions?.x?.toFixed(1) || "0.0"} mm</div>
                                    <div>Y &nbsp; {activeQuote.dimensions?.y?.toFixed(1) || "0.0"} mm</div>
                                    <div>Z &nbsp; {activeQuote.dimensions?.z?.toFixed(1) || "0.0"} mm</div>
                                </div>

                                {/* Wall Thickness Legend - only when in thickness mode */}
                                {viewMode === 'ความหนาผนัง' && (
                                    <div className="absolute bottom-3 right-3 bg-white/95 border border-slate-200 rounded-[4px] p-2.5 px-3 z-20 text-[9px] font-mono">
                                        <div className="text-slate-400 uppercase tracking-widest mb-1.5">ความหนาผนัง</div>
                                        <div
                                            style={{
                                                width: 100,
                                                height: 8,
                                                borderRadius: 2,
                                                background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6)'
                                            }}
                                        />
                                        <div className="flex justify-between mt-1 text-slate-500">
                                            <span>&lt;0.8</span>
                                            <span>1.2</span>
                                            <span>&gt;2 mm</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white">
                            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6">
                                <Upload className="w-10 h-10 opacity-10 text-slate-900" />
                            </div>
                            <p className="text-xs font-black text-slate-300 tracking-[0.2em] uppercase">Ready to Print</p>
                        </div>
                    )}
                </main>

                {/* 3.3 CONFIG: Right 1 */}
                <aside className="border-l border-slate-200 overflow-y-auto bg-white flex flex-col no-scrollbar">
                    <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                        <div>
                            <div className="text-[11px] font-black tracking-widest uppercase text-slate-300">CONFIGURATION</div>
                            <div className="text-[14px] font-black mt-0.5">{t.quote.configTitle}</div>
                        </div>
                        <button onClick={handleCopyToAll} disabled={quotes.length <= 1} className="text-[10px] font-black tracking-widest px-3 py-2 border border-slate-200 rounded-lg text-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all uppercase disabled:opacity-30 disabled:cursor-not-allowed">{t.quote.copyToAll}</button>
                    </div>
                    {activeQuote ? (
                        <div className="p-6 pb-32 space-y-10">
                            {/* Process */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.processLabel}
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {technologies.map(tech => (
                                        <button key={tech.id} onClick={() => patchQuote(activeQuote._id, { technology: tech.id })} className={cn("py-2.5 text-[11px] font-black rounded-lg border transition-all uppercase tracking-tighter", (activeQuote.technology || 'sla') === tech.id ? "bg-[#2563eb] text-white border-[#2563eb] shadow-sm" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300")}>{tech.id}</button>
                                    ))}
                                </div>

                            </div>

                            {/* Material */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.materialLabel}
                                </div>
                                <div className="space-y-4">
                                    {dbMaterials.filter(m => m.technology?.toLowerCase() === (activeQuote.technology || 'sla').toLowerCase()).map(mat => (
                                        <div key={mat._id} className="space-y-4">
                                            <div onClick={() => patchQuote(activeQuote._id, { material: mat._id })} className={cn("w-full text-left p-5 rounded-[20px] border transition-all relative overflow-hidden group cursor-pointer", (activeQuote.material || '') === mat._id ? "bg-[#2563eb] text-white border-[#2563eb] shadow-md" : "bg-white border-slate-100 hover:border-slate-200 shadow-sm")}>
                                                <div className="flex justify-between items-start mb-2.5">
                                                    <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em]", (activeQuote.material || '') === mat._id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400")}>{(activeQuote.technology || 'sla')}</span>
                                                </div>
                                                <div className="text-[16px] font-black tracking-tight">{mat.name}</div>
                                                <div className={cn("text-[12px] mt-1.5 opacity-80 truncate font-medium leading-relaxed", (activeQuote.material || '') === mat._id ? "text-white" : "text-slate-400")}>{mat.description || 'คุณภาพระดับอุตสาหกรรม'}</div>
                                                
                                                {(activeQuote.material || '') === mat._id && (mat.tdsLink || mat.sdsLink) && (
                                                    <div className="flex gap-2 mt-5">
                                                        {mat.tdsLink && (
                                                            <button onClick={(e) => { e.stopPropagation(); window.open(mat.tdsLink, '_blank'); }} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-[11px] font-black flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"><Info className="w-3.5 h-3.5" /> TDS</button>
                                                        )}
                                                        {mat.sdsLink && (
                                                            <button onClick={(e) => { e.stopPropagation(); window.open(mat.sdsLink, '_blank'); }} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-[11px] font-black flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"><Info className="w-3.5 h-3.5" /> SDS</button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.colorLabel}
                                </div>
                            <div className="flex flex-wrap gap-3">
                                    {(() => {
                                        const mat = dbMaterials.find(m => m._id === (activeQuote.material || ''));
                                        if (mat && mat.colorOptions && mat.colorOptions.length > 0) {
                                            return mat.colorOptions.map((co: any) => {
                                                const isLightColor = co.hex.toLowerCase() === '#ffffff' || co.name.toLowerCase().includes('white') || co.name.includes('ขาว') || co.name.includes('ใส') || co.name.toLowerCase().includes('transparent');
                                                return (
                                                    <button key={co.name} onClick={() => patchQuote(activeQuote._id, { color: co.name })} className={cn("w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center relative shadow-md", activeQuote.color === co.name ? "border-[#2563eb] ring-4 ring-blue-50" : "border-white outline outline-1 outline-slate-100")} style={{ backgroundColor: co.hex }} title={co.name}>
                                                        {activeQuote.color === co.name && <Check className={cn("w-5 h-5 drop-shadow-lg", isLightColor ? "text-slate-900" : "text-white")} />}
                                                    </button>
                                                )
                                            });
                                        }

                                        return (mat?.colors || ['White', 'Black', 'Grey', 'Blue', 'Green', 'Yellow', 'Red']).map((c: string) => {
                                            const getColorHex = (colorName: string) => {
                                                const name = colorName.toLowerCase().trim();
                                                if (name.includes('black') || name.includes('ดำ')) return '#222';
                                                if (name.includes('grey') || name.includes('gray') || name.includes('เทา')) return '#888';
                                                if (name.includes('blue') || name.includes('น้ำเงิน') || name.includes('ฟ้า')) return '#3b82f6';
                                                if (name.includes('green') || name.includes('เขียว')) return '#22c55e';
                                                if (name.includes('yellow') || name.includes('เหลือง')) return '#fbbf24';
                                                if (name.includes('red') || name.includes('แดง')) return '#ef4444';
                                                if (name.includes('orange') || name.includes('ส้ม')) return '#f97316';
                                                if (name.includes('purple') || name.includes('ม่วง')) return '#a855f7';
                                                if (name.includes('pink') || name.includes('ชมพู')) return '#ec4899';
                                                if (name.includes('brown') || name.includes('น้ำตาล')) return '#78350f';
                                                if (name.includes('transparent') || name.includes('ใส')) return 'rgba(255, 255, 255, 0.5)';
                                                return '#fff';
                                            };
                                            const isLightColor = c.toLowerCase().includes('white') || c.includes('ขาว') || c.includes('ใส') || c.toLowerCase().includes('yellow') || c.includes('เหลือง') || c.toLowerCase().includes('transparent');
                                            return (
                                            <button key={c} onClick={() => patchQuote(activeQuote._id, { color: c })} className={cn("w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center relative shadow-md", activeQuote.color === c ? "border-[#2563eb] ring-4 ring-blue-50" : "border-white outline outline-1 outline-slate-100")} style={{ backgroundColor: getColorHex(c) }} title={c}>
                                                {activeQuote.color === c && <Check className={cn("w-5 h-5 drop-shadow-lg", isLightColor ? "text-slate-900" : "text-white")} />}
                                            </button>
                                        )});
                                    })()}
                                </div>
                            </div>

                            {/* Finish — dynamic from selected material's postProcessing */}
                            {(() => {
                                const activeMat = dbMaterials.find((m: any) => m._id === (activeQuote.material || ''));
                                const postProcessingOpts: any[] = activeMat?.postProcessing || [];
                                const standardOption = { id: 'standard', label: t.quote.finishStandard, price: t.quote.finishStandardPrice };
                                const allOptions = [standardOption, ...postProcessingOpts.map((p: any) => ({
                                    id: p.name,
                                    label: p.name,
                                    price: p.sellPrice > 0 ? `฿${p.sellPrice.toLocaleString()}` : t.quote.finishStandardPrice,
                                }))];
                                return (
                                    <div>
                                        <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                            {t.quote.finishLabel}
                                        </div>
                                        <div className="space-y-2">
                                            {allOptions.map(f => {
                                                const isActive = (activeQuote.finish || 'standard') === f.id;
                                                return (
                                                    <button key={f.id} onClick={() => patchQuote(activeQuote._id, { finish: f.id })} className={cn("w-full flex justify-between items-center p-4 text-[13px] font-black rounded-xl border transition-all", isActive ? "bg-[#2563eb] text-white border-[#2563eb] shadow-lg shadow-blue-100" : "bg-white text-slate-700 border-slate-100 hover:border-slate-200")}>
                                                        <span>{f.label}</span>
                                                        <span className={cn("text-[11px] font-mono font-black uppercase tracking-tight", isActive ? "text-white/60" : "text-slate-300")}>{f.price}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Infill — FDM only */}
                            {(activeQuote.technology || 'sla').toLowerCase() === 'fdm' && (() => {
                                const PRESETS = [
                                    { value: 10, label: "10%", desc: "เบา" },
                                    { value: 20, label: "20%", desc: "ปกติ" },
                                    { value: 50, label: "50%", desc: "แน่น" },
                                    { value: 100, label: "100%", desc: "Solid" },
                                ];
                                const currentInfill = activeQuote.infill ?? 20;
                                const infillColor = currentInfill <= 20 ? "#60a5fa" : currentInfill <= 50 ? "#2563eb" : currentInfill <= 75 ? "#1d4ed8" : "#1e3a8a";
                                return (
                                    <div>
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-[12px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                                Infill
                                                <span className="text-[10px] font-bold text-slate-400 normal-case tracking-normal">ความหนาแน่นภายใน</span>
                                            </div>
                                            <span className="text-[20px] font-black tabular-nums" style={{ color: infillColor }}>{currentInfill}%</span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{ width: `${currentInfill}%`, backgroundColor: infillColor }}
                                            />
                                        </div>

                                        {/* Slider */}
                                        <input
                                            type="range"
                                            min={5} max={100} step={5}
                                            value={currentInfill}
                                            onChange={e => patchQuote(activeQuote._id, { infill: Number(e.target.value) }, { debounceMs: 400 })}
                                            className="w-full accent-blue-600 mb-3 cursor-pointer"
                                        />

                                        {/* Quick presets */}
                                        <div className="grid grid-cols-4 gap-1">
                                            {PRESETS.map(p => {
                                                const isActive = currentInfill === p.value;
                                                return (
                                                    <button
                                                        key={p.value}
                                                        onClick={() => patchQuote(activeQuote._id, { infill: p.value })}
                                                        className={cn(
                                                            "flex flex-col items-center py-1.5 rounded-lg border text-center transition-all",
                                                            isActive
                                                                ? "bg-[#2563eb] border-[#2563eb] text-white"
                                                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                                                        )}
                                                    >
                                                        <span className="text-[11px] font-black">{p.label}</span>
                                                        <span className={cn("text-[9px]", isActive ? "text-white/70" : "text-slate-400")}>{p.desc}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Label */}
                                        <p className="text-[10px] text-slate-400 mt-2">
                                            {currentInfill <= 15 ? "เหมาะกับชิ้นงานที่ไม่ต้องรับแรง" :
                                             currentInfill <= 30 ? "มาตรฐานทั่วไป สมดุลน้ำหนัก-ความแข็งแรง" :
                                             currentInfill <= 60 ? "แข็งแรง เหมาะกับชิ้นงานใช้งานจริง" :
                                             "แข็งแรงสูงสุด น้ำหนักมากขึ้น ใช้เวลาพิมพ์นานขึ้น"}
                                        </p>
                                    </div>
                                );
                            })()}

                            {/* Section 5: Quantity & Delivery */}
                            <div>
                                <div className="text-[12px] font-black mb-4 flex items-center gap-2 text-slate-900 uppercase tracking-tight">
                                    {t.quote.qtyDeliveryLabel}
                                </div>

                                {/* Quantity Stepper */}
                                <div className="mb-5">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.quote.qtyLabel}</div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => patchQuote(activeQuote._id, { quantity: Math.max(1, (activeQuote.quantity || 1) - 1) })}
                                            className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 font-black text-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                                        >
                                            &minus;
                                        </button>
                                        <span className="text-[20px] font-black text-slate-900 w-8 text-center tabular-nums">
                                            {activeQuote.quantity || 1}
                                        </span>
                                        <button
                                            onClick={() => patchQuote(activeQuote._id, { quantity: (activeQuote.quantity || 1) + 1 })}
                                            className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 font-black text-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>


                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[11px] text-slate-200 font-black uppercase tracking-widest">Select Item</div>
                    )}
                </aside>

                {/* 3.4 PRICE: Right 2 */}
                <aside className="border-l border-slate-200 bg-[#fafafa] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="text-[10px] font-black tracking-widest uppercase text-slate-300">{t.quote.priceBreakdown}</div>
                        <div className="text-[12px] font-black mt-0.5">{t.quote.priceBreakdown}</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="p-3 space-y-3">
                            {selectedQuotes.length === 0 && (
                                <div className="text-center py-6 text-[11px] text-slate-300 font-bold uppercase tracking-widest">ยังไม่ได้เลือกไฟล์</div>
                            )}
                            {selectedQuotes.map(q => (
                                <div key={q._id} className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 pr-2">
                                            <div className="text-[11px] font-black truncate text-slate-800">{q.originalName}</div>
                                            <div className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter leading-none">
                                                {q.technology} · {q.materialName || 'Nylon PA12'} · {q.color} · ×{q.quantity || 1}
                                                {(q.technology || '').toLowerCase() === 'fdm' && q.infill != null && (
                                                    <> · Infill {q.infill}%</>
                                                )}
                                                {q.finish && q.finish !== 'standard' && (
                                                    <> · {q.finish}</>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-[12px] font-mono font-black text-slate-800">฿{q.priceDetail?.totalPrice?.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-300 mt-1">
                                        <span>฿{q.priceDetail?.pricePerUnit?.toLocaleString() || "0"}{t.quote.perPiece}</span>
                                        {q.finish === 'sanded' && <span className="text-[#2563eb]">+ {t.quote.finishSanded}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-4 space-y-1.5 font-mono text-[11px] font-black">
                            <div className="flex justify-between text-slate-700"><span>Subtotal</span><span>฿{totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            <div className="flex justify-between text-slate-300 font-bold"><span>{t.quote.setupFee}</span><span>฿150.00</span></div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-[#2563eb]"><span>{appliedCoupon.code} {t.quote.coupon}</span><span>-฿{appliedCoupon.discountValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                            )}
                            <div className="flex justify-between text-slate-300 font-bold"><span>VAT 7%</span><span>฿{vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        </div>

                        <div className="p-3 mt-2">
                            <div className="text-[8px] font-black tracking-widest uppercase text-slate-300 mb-2">{t.quote.coupon}</div>
                            {appliedCoupon ? (
                                <div className="flex gap-2">
                                    <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 bg-blue-50/50 border border-blue-100 rounded-lg shadow-sm">
                                        <ShoppingCart className="w-3 h-3 text-[#2563eb] shrink-0" />
                                        <div className="flex-1 text-[10px] font-black tracking-[0.15em] text-slate-700">{appliedCoupon.code}</div>
                                        <span className="text-[7px] font-black text-[#2563eb] bg-blue-100 px-1 py-0.5 rounded uppercase">ACTIVE</span>
                                    </div>
                                    <button onClick={handleRemoveCoupon} className="px-2 text-[9px] font-black text-slate-400 hover:text-red-500 uppercase transition-all">{t.quote.removeBtn}</button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm focus-within:border-blue-500 transition-all">
                                            <ShoppingCart className="w-3 h-3 text-slate-400 shrink-0" />
                                            <input 
                                                type="text" 
                                                value={couponCode} 
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="ENTER CODE"
                                                className="flex-1 bg-transparent border-none outline-none text-[10px] font-black tracking-[0.1em] text-slate-700 placeholder:text-slate-300 uppercase" 
                                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleApplyCoupon}
                                            disabled={validatingCoupon || !couponCode}
                                            className="px-3 text-[9px] font-black text-white bg-slate-800 rounded-lg hover:bg-black disabled:bg-slate-300 disabled:text-slate-500 uppercase transition-all"
                                        >
                                            {validatingCoupon ? "..." : "APPLY"}
                                        </button>
                                    </div>
                                    {couponError && <div className="text-[9px] font-bold text-red-500 mt-1">{couponError}</div>}
                                </div>
                            )}
                        </div>

                        {/* Shipping Address Selection */}
                        <div className="p-3 border-t border-slate-100 bg-white relative">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 shrink-0 text-blue-600" />
                                <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{t.quote.shippingAddr}</div>
                            </div>

                            <div className="relative">
                                {userAddresses.length > 0 ? (
                                    <>
                                        <button 
                                            onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                                            className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[12px] font-black text-slate-700 hover:bg-slate-100 transition-all shadow-sm active:scale-[0.98]"
                                        >
                                            <div className="flex flex-col items-start gap-0.5 min-w-0">
                                                <span className="text-slate-900 font-black truncate w-full text-left">
                                                    {userAddresses.find(a => a._id === selectedAddressId)?.label || t.quote.selectAddr}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate w-full text-left">
                                                    {userAddresses.find(a => a._id === selectedAddressId)?.receiverName || session?.user?.name}
                                                </span>
                                            </div>
                                            <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-300 shrink-0 ml-2", showAddressDropdown && "rotate-180")} />
                                        </button>

                                        {showAddressDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-[60]" onClick={() => setShowAddressDropdown(false)}></div>
                                                <div className="absolute bottom-full left-0 right-0 mb-2 z-[70] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                    <div className="p-2 space-y-1 max-h-[250px] overflow-y-auto no-scrollbar">
                                                        {userAddresses.map((addr, idx) => (
                                                            <button
                                                                key={addr._id ? String(addr._id) : idx}
                                                                onClick={() => {
                                                                    setSelectedAddressId(String(addr._id));
                                                                    setShowAddressDropdown(false);
                                                                    patchQuote(activeQuote?._id, { shipping: addr });
                                                                }}
                                                                className={cn(
                                                                    "w-full flex flex-col items-start p-3 rounded-xl transition-all",
                                                                    selectedAddressId === addr._id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"
                                                                )}
                                                            >
                                                                <div className="text-[12px] font-black flex items-center gap-2">
                                                                    {addr.label}
                                                                    {addr.isDefault && <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full uppercase">Default</span>}
                                                                </div>
                                                                <div className="text-[10px] font-bold opacity-60 mt-0.5 text-left line-clamp-1">
                                                                    {addr.address}, {addr.subDistrict}, {addr.district}, {addr.province} {addr.zipCode}
                                                                </div>
                                                            </button>
                                                        ))}
                                                        <button 
                                                            onClick={() => router.push('/profile/account')}
                                                            className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-blue-600 transition-all border-t border-slate-50 mt-1"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                            <span className="text-[11px] font-black">{t.quote.manageAddr}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => router.push('/profile/account')}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl px-3.5 py-4 text-[11px] font-black text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> {t.quote.addAddr}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Delivery Channels */}
                        <div className="p-3 border-t border-slate-100 bg-white relative">
                            <div className="flex items-center gap-2 mb-2">
                                <Truck className="w-4 h-4 shrink-0 text-blue-600" />
                                <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{t.quote.shippingChannel}</div>
                            </div>

                            {loadingShippingRates ? (
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 py-2.5 px-3.5 bg-slate-50 rounded-xl">
                                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                    กำลังโหลดราคาขนส่ง...
                                </div>
                            ) : !selectedAddressId ? (
                                <div className="text-[11px] text-slate-400 py-2.5 px-3.5 bg-slate-50 rounded-xl">
                                    เลือกที่อยู่จัดส่งก่อนเพื่อดูค่าขนส่ง
                                </div>
                            ) : shippingRates.length === 0 ? (
                                <div className="text-[11px] text-slate-400 py-2.5 px-3.5 bg-slate-50 rounded-xl">
                                    ไม่พบราคาขนส่งสำหรับที่อยู่นี้
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
                                        className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 text-[12px] font-black text-slate-700 hover:bg-slate-100 transition-all shadow-sm active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-2">
                                            {selectedRate?.logo && (
                                                <img src={selectedRate.logo} alt={selectedRate.courier_name}
                                                    className="w-8 h-6 object-contain rounded border border-slate-100 bg-white p-0.5 shrink-0"
                                                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                            )}
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-blue-600 font-black">{selectedRate?.courier_name || "-"}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">~{selectedRate?.estimate_days} วัน</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-slate-900">฿{(selectedRate?.total_price || 0).toFixed(2)}</span>
                                            <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-300", showDeliveryDropdown && "rotate-180")} />
                                        </div>
                                    </button>

                                    {showDeliveryDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowDeliveryDropdown(false)}></div>
                                            <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                <div className="p-2 space-y-1">
                                                    {shippingRates.map(r => (
                                                        <button
                                                            key={r.courier_code}
                                                            onClick={() => {
                                                                setSelectedCourierCode(r.courier_code);
                                                                setShowDeliveryDropdown(false);
                                                            }}
                                                            className={cn(
                                                                "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                                                selectedCourierCode === r.courier_code ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {r.logo && (
                                                                    <img src={r.logo} alt={r.courier_name}
                                                                        className="w-8 h-6 object-contain rounded border border-slate-100 bg-white p-0.5 shrink-0"
                                                                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                                                )}
                                                                <div className="flex flex-col items-start">
                                                                    <div className="text-[12px] font-black">{r.courier_name}</div>
                                                                    <div className="text-[10px] font-bold opacity-60">
                                                                        {r.estimate_days?.includes("-") ? `ถึง ${r.estimate_days}` : `~${r.estimate_days} วัน`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-[12px] font-mono font-black">฿{r.total_price.toFixed(2)}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Checkout Footer */}
                    <div className="shrink-0">
                        <div className="p-4 bg-[#1d4ed8] text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">TOTAL · {t.quote.total}</div>
                                <div className="text-[8px] font-black opacity-30 mt-0.5 tracking-widest uppercase">{t.quote.inclVat}</div>
                            </div>
                            <div className="text-[26px] font-mono font-black tracking-tighter relative z-10 leading-none">฿{finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                        </div>
                        <div className="p-3 bg-white border-t border-slate-100">
                            <div className="flex items-start gap-2 text-[10px] text-slate-400 mb-3 cursor-pointer group">
                                <input 
                                    id="terms-checkbox"
                                    type="checkbox" 
                                    checked={isTermsAccepted}
                                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                    className="mt-0.5 w-3 h-3 accent-[#2563eb] rounded border-slate-300 cursor-pointer" 
                                />
                                <label htmlFor="terms-checkbox" className="group-hover:text-slate-600 transition-colors leading-relaxed cursor-pointer">
                                    {t.quote.termsCheck} <span 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowTermsModal(true);
                                        }}
                                        className="text-slate-900 font-black underline decoration-slate-200 underline-offset-4 hover:decoration-[#2563eb]"
                                    >
                                        {t.quote.termsLink}
                                    </span>
                                </label>
                            </div>
                            <button 
                                onClick={handlePlaceOrder}
                                disabled={!isTermsAccepted}
                                className={cn(
                                    "w-full py-2.5 rounded-xl font-black text-[11px] transition-all tracking-[0.2em] uppercase mb-3 shadow-sm",
                                    isTermsAccepted ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.98]" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                {t.quote.placeOrder} · Place order
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={handleGetQuotation} className="py-2 text-[10px] font-black border border-slate-100 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-400 transition-all uppercase tracking-widest shadow-sm"><Info className="w-3.5 h-3.5 opacity-50" /> {t.quote.quotation}</button>
                                <button onClick={handleSaveToCart} className="py-2 text-[10px] font-black border border-slate-100 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-400 transition-all uppercase tracking-widest shadow-sm"><ShoppingCart className="w-3.5 h-3.5 opacity-50" /> {t.quote.saveCart}</button>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>

            {/* Terms of Use Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTermsModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{t.quote.termsTitle}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.quote.termsSub}</p>
                            </div>
                            <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><Plus className="w-6 h-6 rotate-45" /></button>
                        </div>
                        <div className="p-8 overflow-y-auto text-slate-600 text-[13px] leading-relaxed space-y-6">
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS1Title}</h4>
                                <p>{t.quote.termsS1Body}</p>
                            </section>
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS2Title}</h4>
                                <p>{t.quote.termsS2Body}</p>
                            </section>
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS3Title}</h4>
                                <p>{t.quote.termsS3Body}</p>
                            </section>
                            <section>
                                <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight">{t.quote.termsS4Title}</h4>
                                <p>{t.quote.termsS4Body}</p>
                            </section>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                                onClick={() => setShowTermsModal(false)}
                                className="flex-1 py-3 px-6 rounded-xl font-black text-[12px] text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                            >
                                {t.quote.cancelBtn}
                            </button>
                            <button 
                                onClick={() => {
                                    setIsTermsAccepted(true);
                                    setShowTermsModal(false);
                                }}
                                className="flex-[2] py-3 px-6 bg-[#2563eb] text-white rounded-xl font-black text-[12px] hover:bg-[#1d4ed8] shadow-lg shadow-blue-200 transition-all uppercase tracking-widest"
                            >
                                {t.quote.acceptBtn}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
