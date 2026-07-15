const BASE = process.env.DHL_ENV === "production"
    ? "https://express.api.dhl.com/mydhlapi"
    : "https://express.api.dhl.com/mydhlapi/test";

const SITE_ID = process.env.DHL_SITE_ID  || "";
const PASSWORD = process.env.DHL_PASSWORD || "";
const ACCOUNT  = process.env.DHL_ACCOUNT_NUMBER || "";

export const DHL_SRC = {
    name:        process.env.ISHIP_SENDER_NAME    || "บริษัท เซปทิลเลียน จำกัด",
    phone:       process.env.ISHIP_SENDER_PHONE   || "021234567",
    address:     process.env.ISHIP_SENDER_ADDRESS || "388/13-14 บีอเวนิว ถ.ราชพฤกษ์",
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
    const label = materialName ? ` - ${materialName}` : "";
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
    const contentDescription = hasLineItems ? params.lineItems![0].description : params.item_name;

    const declarationLineItems = hasLineItems
        ? params.lineItems!.map((li, i) => ({
            number:      i + 1,
            description: li.description.slice(0, 170),
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
            description: params.item_name,
            price:       params.item_value ?? 100,
            priceCurrency: declaredCurrency,
            quantity: { value: 1, unitOfMeasurement: "PCS" },
            weight:   { netValue: roundKg(params.weightKg, 0.1), grossValue: roundKg(params.weightKg, 0.1) },
            exportReasonType: "permanent",
            manufacturerCountry: "TH",
        }];

    const payload = {
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
        valueAddedServices: [{ serviceCode: "WY" }],
        customerDetails: {
            shipperDetails: {
                postalAddress: {
                    postalCode:   DHL_SRC.zipcode,
                    cityName:     DHL_SRC.city,
                    countryCode:  DHL_SRC.countryCode,
                    addressLine1: DHL_SRC.address,
                },
                contactInformation: {
                    companyName: DHL_SRC.name,
                    fullName:    DHL_SRC.name,
                    phone:       normalizePhone(DHL_SRC.phone),
                },
            },
            receiverDetails: {
                postalAddress: {
                    postalCode:   params.dst_zipcode || "",
                    cityName:     params.dst_city    || "",
                    countryCode:  params.dst_country,
                    addressLine1: params.dst_address || params.dst_city || "-",
                },
                contactInformation: {
                    companyName: params.dst_name || "Customer",
                    fullName:    params.dst_name || "Customer",
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
                    number: params.item_name.slice(0, 35),
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
        // อัปโหลดใบกำกับสินค้าของบริษัทแนบไปกับ shipment
        ...(hasOwnInvoice ? {
            documentImages: [{
                typeCode:    "INV",
                imageFormat: "PDF",
                content:     params.invoicePdfBase64,
            }],
        } : {}),
        customerReferences: [
            { value: (params.remark || params.item_name || "").slice(0, 50), typeCode: "CU" },
        ],
    };

    console.log("[DHL createShipment payload]", JSON.stringify({
        ...payload,
        ...(hasOwnInvoice ? { documentImages: [{ typeCode: "INV", imageFormat: "PDF", content: `<base64 ${params.invoicePdfBase64!.length} chars>` }] } : {}),
    }, null, 2));
    return dhlPost("shipments", payload);
}

export async function trackDHL(trackingNumber: string) {
    return dhlGet(`shipments/${encodeURIComponent(trackingNumber)}/tracking?trackingView=all-checkpoints`);
}
