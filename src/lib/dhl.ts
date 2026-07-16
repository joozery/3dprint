const BASE = process.env.DHL_ENV === "production"
    ? "https://express.api.dhl.com/mydhlapi"
    : "https://express.api.dhl.com/mydhlapi/test";

const SITE_ID = process.env.DHL_SITE_ID  || "";
const PASSWORD = process.env.DHL_PASSWORD || "";
const ACCOUNT  = process.env.DHL_ACCOUNT_NUMBER || "";

// default เป็นอังกฤษเสมอ — DHL ไม่รองรับภาษาไทยในงานส่งต่างประเทศ
export const DHL_SRC = {
    name:        process.env.ISHIP_SENDER_NAME    || "Septillion Co., Ltd.",
    phone:       process.env.ISHIP_SENDER_PHONE   || "021234567",
    address:     process.env.ISHIP_SENDER_ADDRESS || "388/13-14 B Avenue, Ratchaphruek Road",
    city:        "Bangkok",
    countryCode: "TH",
    zipcode:     process.env.ISHIP_SRC_ZIPCODE    || "10160",
};

function authHeader(): string {
    return "Basic " + Buffer.from(`${SITE_ID}:${PASSWORD}`).toString("base64");
}

async function dhlPost(path: string, body: object) {
    const res = await fetch(`${BASE}/${path}`, {
        method: "POST",
        headers: {
            Authorization:  authHeader(),
            "Content-Type": "application/json",
            Accept:         "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });
    return res.json();
}

async function dhlGet(path: string) {
    const res = await fetch(`${BASE}/${path}`, {
        method: "GET",
        headers: {
            Authorization: authHeader(),
            Accept:        "application/json",
        },
        cache: "no-store",
    });
    return res.json();
}

export interface DHLRateParams {
    dst_zipcode:  string;
    dst_city:     string;
    dst_country:  string;
    weightKg:     number;
    width:        number;
    length:       number;
    height:       number;
}

export interface DHLRate {
    productCode:   string;
    productName:   string;
    totalPrice:    number;
    currency:      string;
    estimatedDays: string;
}

function nextBusinessDay(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    // skip weekend
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Sun → Mon
    if (d.getDay() === 6) d.setDate(d.getDate() + 2); // Sat → Mon
    const ymd = d.toISOString().split("T")[0];
    return `${ymd}T10:00:00 GMT+07:00`;
}

export async function getDHLRates(params: DHLRateParams): Promise<DHLRate[]> {
    const plannedDate = nextBusinessDay();

    const raw = await dhlPost("rates", {
        customerDetails: {
            shipperDetails: {
                postalCode:   DHL_SRC.zipcode,
                cityName:     DHL_SRC.city,
                countryCode:  DHL_SRC.countryCode,
                addressLine1: DHL_SRC.address,
            },
            receiverDetails: {
                postalCode:  params.dst_zipcode,
                cityName:    params.dst_city,
                countryCode: params.dst_country,
            },
        },
        accounts: [{ typeCode: "shipper", number: ACCOUNT }],
        plannedShippingDateAndTime: plannedDate,
        unitOfMeasurement: "metric",
        isCustomsDeclarable: true,
        monetaryAmount: [{ typeCode: "declaredValue", value: 100, currency: "USD" }],
        packages: [{
            weight: Math.max(Math.round(params.weightKg * 1000) / 1000, 0.1),
            dimensions: {
                length: Math.ceil(params.length),
                width:  Math.ceil(params.width),
                height: Math.ceil(params.height),
            },
        }],
    });

    const products: any[] = raw?.products || [];
    return products
        .map((p: any) => {
            const priceEntry = p.totalPrice?.find((t: any) => t.priceCurrency === "THB")
                ?? p.totalPrice?.[0];
            return {
                productCode:   p.productCode,
                productName:   p.productName ?? p.productCode,
                totalPrice:    Number(priceEntry?.price ?? 0),
                currency:      priceEntry?.priceCurrency ?? "THB",
                estimatedDays: p.deliveryCapabilities?.estimatedDeliveryDateAndTime
                    ?? p.deliveryCapabilities?.deliveryTypeCode
                    ?? "-",
            };
        })
        .filter(r => r.totalPrice > 0);
}

// DHL ไม่รองรับตัวอักษรไทย/non-ASCII ในงานส่งต่างประเทศ — ใช้ภาษาอังกฤษเท่านั้น
// แปลคำวัสดุไทยที่มีในระบบก่อน แล้วตัดอักขระ non-ASCII ที่เหลือทิ้ง
const THAI_WORD_MAP: [RegExp, string][] = [
    [/เรซิ่น|เรซิน/g,  " Resin "],
    [/ทนร้อน/g,        " Heat Resistant "],
    [/สีดำ/g,          " Black "],
    [/สีเทา/g,         " Gray "],
    [/สีขาว/g,         " White "],
    [/สีใส/g,          " Clear "],
    [/สเตนเลส/g,       " Stainless Steel "],
    [/อลูมิเนียม/g,     " Aluminum "],
    [/ไทเทเนียม/g,     " Titanium "],
    [/โลหะ/g,          " Metal "],
    [/เหล็ก/g,         " Steel "],
    [/พลาสติก/g,       " Plastic "],
];
export function toEnglish(s: string): string {
    let out = s || "";
    for (const [re, en] of THAI_WORD_MAP) out = out.replace(re, en);
    return out.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}

// จำแนกวัสดุ → description + HS code สำหรับใบขนศุลกากร
// พลาสติก/TPU/เรซิน → 3926.90.99, เหล็ก/สเตนเลส → 7326.90.99,
// อลูมิเนียม → 7616.99.90, ไทเทเนียม → 8108.90.90
export function materialCustomsInfo(materialName: string): { description: string; hsCode: string } {
    const n = (materialName || "").toLowerCase();
    let hsCode = "3926.90.99"; // default: ตัวอย่างชิ้นงานทำจากพลาสติก (รวม TPU/เรซิน/ไนลอน)
    if (/titanium|tc4|ไทเทเนียม/.test(n)) {
        hsCode = "8108.90.90"; // ไทเทเนียมและของทำด้วยไทเทเนียม
    } else if (/alumin|alsi|\bal\b|อลูมิเนียม/.test(n)) {
        hsCode = "7616.99.90"; // อลูมิเนียม (รวม AL 6061, AlSi10Mg)
    } else if (/stainless|steel|sus|316|17-4|maraging|mararing|scm|inconel|metal|โลหะ|สเตนเลส|เหล็ก/.test(n)) {
        hsCode = "7326.90.99"; // เหล็ก/สเตนเลส (SUS316, 17-4PH, maraging SCM439)
    }
    // hsCode ดูจากชื่อเดิม (รองรับคำไทย) แต่ description ต้องเป็นอังกฤษล้วน
    const en = toEnglish(materialName);
    const label = en ? ` - ${en}` : "";
    return { description: `3d printed models prototype${label}`, hsCode };
}

export interface DHLLineItem {
    description: string;   // เช่น "3d printed models prototype - Nylon PA12"
    hsCode:      string;   // commodity code ฝั่งขาออก
    price:       number;   // ราคาต่อรายการ (THB)
    quantity:    number;
    weightKg:    number;
}

export interface DHLCreateParams {
    productCode:  string;
    dst_name:     string;
    dst_phone:    string;
    dst_address:  string;
    dst_city:     string;
    dst_country:  string;
    dst_zipcode:  string;
    weightKg:     number;
    width:        number;
    length:       number;
    height:       number;
    item_name:    string;
    item_value?:  number;
    remark?:      string;
    /** ใบกำกับสินค้าของบริษัทเอง (PDF base64) — ถ้าส่งมา DHL จะไม่สร้าง invoice ให้ */
    invoicePdfBase64?: string;
    /** รายการสินค้าพร้อม HS code รายวัสดุ — ถ้าส่งมา จะใช้แทน line item เดี่ยวแบบเดิม (มูลค่าเป็น THB) */
    lineItems?: DHLLineItem[];
}

// DHL รับน้ำหนักละเอียดสุด 3 ตำแหน่ง (ต้องเป็นจำนวนเท่าของ 0.001 kg)
function roundKg(kg: number, minKg = 0.001): number {
    return Math.max(Math.round(kg * 1000) / 1000, minKg);
}

// DHL จำกัด addressLine ละ 45 ตัวอักษร — ตัดที่อยู่ยาวเป็นสูงสุด 3 บรรทัด (เกิน 135 ตัวอักษรตัดทิ้ง)
// ตัดตามช่องว่างก่อน ถ้าคำเดียวยาวเกิน (เช่นที่อยู่ไทยไม่เว้นวรรค) ค่อยหั่นกลางคำ
function splitAddress(addr: string): { addressLine1: string; addressLine2?: string; addressLine3?: string } {
    const MAX = 45;
    const words = (addr || "").trim().split(/\s+/).flatMap(w => {
        const chunks: string[] = [];
        for (let i = 0; i < w.length; i += MAX) chunks.push(w.slice(i, i + MAX));
        return chunks;
    });
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
        if (!cur) cur = w;
        else if (cur.length + 1 + w.length <= MAX) cur += " " + w;
        else {
            lines.push(cur);
            cur = w;
            if (lines.length === 3) break;
        }
    }
    if (cur && lines.length < 3) lines.push(cur);
    return {
        addressLine1: lines[0] || "-",
        ...(lines[1] ? { addressLine2: lines[1] } : {}),
        ...(lines[2] ? { addressLine3: lines[2] } : {}),
    };
}

function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    // ถ้าขึ้นต้นด้วย 0 (เบอร์ไทย local) → เติม 66 แทน 0
    if (digits.startsWith("0") && digits.length <= 10) return "66" + digits.slice(1);
    return digits;
}

export async function createDHLShipment(params: DHLCreateParams) {
    const plannedDate = nextBusinessDay();
    const hasOwnInvoice = !!params.invoicePdfBase64;
    const hasLineItems = !!(params.lineItems && params.lineItems.length > 0);

    // มี lineItems → ประกาศมูลค่าจริงเป็น THB พร้อม HS code รายวัสดุ, ไม่มี → พฤติกรรมเดิม (USD)
    const declaredValue = hasLineItems
        ? params.lineItems!.reduce((s, li) => s + li.price, 0)
        : (params.item_value ?? 100);
    const declaredCurrency = hasLineItems ? "THB" : "USD";
    const contentDescription = toEnglish(hasLineItems ? params.lineItems![0].description : params.item_name)
        || "3d printed models prototype";

    const declarationLineItems = hasLineItems
        ? params.lineItems!.map((li, i) => ({
            number:      i + 1,
            description: (toEnglish(li.description) || "3d printed models prototype").slice(0, 170),
            price:       li.price,
            priceCurrency: declaredCurrency,
            quantity: { value: li.quantity, unitOfMeasurement: "PCS" },
            weight:   { netValue: roundKg(li.weightKg, 0.01), grossValue: roundKg(li.weightKg, 0.01) },
            commodityCodes: [
                { typeCode: "outbound", value: li.hsCode },
                { typeCode: "inbound",  value: li.hsCode },
            ],
            exportReasonType: "permanent",
            manufacturerCountry: "TH",
        }))
        : [{
            number:      1,
            description: toEnglish(params.item_name) || "3d printed models prototype",
            price:       params.item_value ?? 100,
            priceCurrency: declaredCurrency,
            quantity: { value: 1, unitOfMeasurement: "PCS" },
            weight:   { netValue: roundKg(params.weightKg, 0.1), grossValue: roundKg(params.weightKg, 0.1) },
            exportReasonType: "permanent",
            manufacturerCountry: "TH",
        }];

    // paperless = ส่งเอกสารศุลกากรอิเล็กทรอนิกส์ (WY) — บางเส้นทาง (เช่น VN/IN/BO) ไม่รองรับ
    const buildPayload = (paperless: boolean) => ({
        plannedShippingDateAndTime: plannedDate,
        pickup: { isRequested: false },
        productCode: params.productCode,
        // ให้ DHL ตอบกลับพร้อมค่าขนส่งเบื้องต้นตามข้อมูลที่ส่ง
        getRateEstimates: true,
        // shipper = ยืนยันบุคคลผู้ส่ง, payer = เรียกเก็บค่าขนส่ง
        accounts: [
            { typeCode: "shipper", number: ACCOUNT },
            { typeCode: "payer",   number: ACCOUNT },
        ],
        // WY = Paperless Trade (PLT) — ส่งเอกสารศุลกากรแบบอิเล็กทรอนิกส์
        ...(paperless ? { valueAddedServices: [{ serviceCode: "WY" }] } : {}),
        customerDetails: {
            shipperDetails: {
                postalAddress: {
                    postalCode:   DHL_SRC.zipcode,
                    cityName:     toEnglish(DHL_SRC.city) || "Bangkok",
                    countryCode:  DHL_SRC.countryCode,
                    ...splitAddress(toEnglish(DHL_SRC.address) || "-"),
                },
                contactInformation: {
                    companyName: toEnglish(DHL_SRC.name) || "Septillion Co., Ltd.",
                    fullName:    toEnglish(DHL_SRC.name) || "Septillion Co., Ltd.",
                    phone:       normalizePhone(DHL_SRC.phone),
                },
            },
            receiverDetails: {
                postalAddress: {
                    postalCode:   params.dst_zipcode || "",
                    cityName:     toEnglish(params.dst_city),
                    countryCode:  params.dst_country,
                    ...splitAddress(toEnglish(params.dst_address) || toEnglish(params.dst_city) || "-"),
                },
                contactInformation: {
                    companyName: toEnglish(params.dst_name) || "Customer",
                    fullName:    toEnglish(params.dst_name) || "Customer",
                    phone:       normalizePhone(params.dst_phone),
                },
            },
        },
        content: {
            packages: [{
                weight: roundKg(params.weightKg, 0.1),
                dimensions: {
                    length: Math.ceil(params.length),
                    width:  Math.ceil(params.width),
                    height: Math.ceil(params.height),
                },
                description: contentDescription,
            }],
            isCustomsDeclarable: true,
            declaredValue:    declaredValue,
            declaredValueCurrency: declaredCurrency,
            description:      contentDescription,
            incoterm:         "DAP",
            unitOfMeasurement: "metric",
            exportDeclaration: {
                lineItems: declarationLineItems,
                invoice: {
                    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
                    number: (toEnglish(params.item_name) || "INV").slice(0, 35),
                },
                exportReason: "permanent",
            },
        },
        outputImageProperties: {
            printerDPI: 300,
            encodingFormat: "pdf",
            splitInvoiceAndReceipt: true,
            imageOptions: [
                { typeCode: "label", templateName: "ECOM26_84_001" },
                // Paperless Trade (WY) บังคับให้มี invoice เสมอ:
                // แนบใบกำกับของบริษัทเอง → isRequested:false (DHL ไม่สร้าง ใช้ documentImages แทน)
                // ไม่ได้แนบ → ให้ DHL สร้าง commercial invoice จากข้อมูล lineItems
                hasOwnInvoice
                    ? { typeCode: "invoice", templateName: "COMMERCIAL_INVOICE_P_10", isRequested: false }
                    : { typeCode: "invoice", templateName: "COMMERCIAL_INVOICE_P_10", isRequested: true, invoiceType: "commercial", languageCode: "eng" },
            ],
        },
        // อัปโหลดใบกำกับสินค้าของบริษัทแนบไปกับ shipment (ทำได้เฉพาะเส้นทางที่รองรับ paperless)
        ...(paperless && hasOwnInvoice ? {
            documentImages: [{
                typeCode:    "INV",
                imageFormat: "PDF",
                content:     params.invoicePdfBase64,
            }],
        } : {}),
        customerReferences: [
            { value: (toEnglish(params.remark || "") || toEnglish(params.item_name) || "-").slice(0, 50), typeCode: "CU" },
        ],
    });

    const logPayload = (p: any) => console.log("[DHL createShipment payload]", JSON.stringify({
        ...p,
        ...(p.documentImages ? { documentImages: [{ typeCode: "INV", imageFormat: "PDF", content: `<base64 ${params.invoicePdfBase64!.length} chars>` }] } : {}),
    }, null, 2));

    // bypassPLTError=true (query param — DHL แนะนำ): ส่ง WY เป็น default ได้ทุกประเทศ
    // เส้นทางที่ไม่รองรับ PLT จะไม่ error แต่ตอบ 201 พร้อม warning 7988 ให้พิมพ์เอกสารแนบกล่องแทน
    let payload = buildPayload(true);
    logPayload(payload);
    let result = await dhlPost("shipments?bypassPLTError=true", payload);

    // กันเหนียว: บาง environment อาจยัง error 7008 → ส่งใหม่แบบไม่ใช้ WY/documentImages
    const errText = `${result?.detail || ""} ${(result?.additionalDetails || []).join(" ")}`;
    if (/7008/.test(errText) && /WY/.test(errText)) {
        console.log("[DHL] destination ไม่รองรับ Paperless Trade (WY) — retry แบบไม่ใช้ WY/documentImages");
        payload = buildPayload(false);
        logPayload(payload);
        result = await dhlPost("shipments", payload);
        if (result && typeof result === "object") (result as any).pltBypassed = true;
    }

    // warning 7988 = เส้นทางนี้ไม่ใช้ paperless → ต้องพิมพ์เอกสารทั้งหมดแนบไปกับกล่อง
    const warnings: any[] = Array.isArray(result?.warnings) ? result.warnings : [];
    if (warnings.some(w => /7988/.test(String(w)))) {
        (result as any).pltBypassed = true;
    }
    return result;
}

export async function trackDHL(trackingNumber: string) {
    return dhlGet(`shipments/${encodeURIComponent(trackingNumber)}/tracking?trackingView=all-checkpoints`);
}
