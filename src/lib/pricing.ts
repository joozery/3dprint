/**
 * แปลง print time string → นาที
 * รองรับ: "1h 23m", "8m 48s", "2h 5m 30s", "45m"
 */
export function parsePrintTimeToMinutes(printTime: string): number {
    if (!printTime || printTime === "N/A") return 0;
    let minutes = 0;
    const h = printTime.match(/(\d+)h/);
    const m = printTime.match(/(\d+)m/);
    const s = printTime.match(/(\d+)s/);
    if (h) minutes += parseInt(h[1]) * 60;
    if (m) minutes += parseInt(m[1]);
    if (s) minutes += parseInt(s[1]) / 60;
    return parseFloat(minutes.toFixed(4));
}

export interface PricingParams {
    filamentCm3: number;       // วัสดุที่ใช้จริง (cm³) รวม infill, ผนัง
    supportVolumeCm3: number;  // วัสดุ support (cm³)
    density: number;           // ความหนาแน่นวัสดุ (g/cm³)
    sellPerGram: number;       // ราคาขาย/กรัม (฿)
    printTimeMinutes: number;  // เวลาพิมพ์ (นาที)
    sellPerMinute: number;     // ราคาขาย/นาที (฿)
    setupFee: number;          // ค่า setup (฿)
    quantity: number;          // จำนวนชิ้น
    finishPrice: number;       // ราคา post-processing (฿/ชิ้น)
}

export interface PriceBreakdown {
    materialCost: number;    // ค่าวัสดุ (filament + support)
    timeCost: number;        // ค่าเวลาพิมพ์
    finishCost: number;      // ค่า finish/post-processing
    setupFee: number;        // ค่า setup
    pricePerUnit: number;    // ราคา/ชิ้น (ก่อน setup)
    totalPrice: number;      // ราคารวมทั้งหมด
    weightGrams: number;     // น้ำหนักชิ้นงาน (g)
}

/**
 * สูตรราคาแบบที่ 3: วัสดุ + เวลา + setup
 *
 * pricePerUnit = (filamentCm3 + supportCm3) × density × sellPerGram
 *             + printTimeMinutes × sellPerMinute
 *             + finishPrice
 *
 * totalPrice = pricePerUnit × quantity + setupFee
 */
export function calculatePrice(p: PricingParams): PriceBreakdown {
    const chargeableVolumeCm3 = p.filamentCm3 + p.supportVolumeCm3;
    const weightGrams   = chargeableVolumeCm3 * p.density;
    const materialCost  = weightGrams * p.sellPerGram;
    const timeCost      = p.printTimeMinutes * p.sellPerMinute;
    const finishCost    = p.finishPrice;
    const pricePerUnit  = materialCost + timeCost + finishCost;
    const totalPrice    = pricePerUnit * p.quantity + p.setupFee;

    return {
        materialCost:  parseFloat(materialCost.toFixed(2)),
        timeCost:      parseFloat(timeCost.toFixed(2)),
        finishCost:    parseFloat(finishCost.toFixed(2)),
        setupFee:      parseFloat(p.setupFee.toFixed(2)),
        pricePerUnit:  parseFloat(pricePerUnit.toFixed(2)),
        totalPrice:    parseFloat(totalPrice.toFixed(2)),
        weightGrams:   parseFloat(weightGrams.toFixed(2)),
    };
}
