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
            weight: Math.max(params.weightKg, 0.1),
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
}

function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    // ถ้าขึ้นต้นด้วย 0 (เบอร์ไทย local) → เติม 66 แทน 0
    if (digits.startsWith("0") && digits.length <= 10) return "66" + digits.slice(1);
    return digits;
}

export async function createDHLShipment(params: DHLCreateParams) {
    const plannedDate = nextBusinessDay();

    const payload = {
        plannedShippingDateAndTime: plannedDate,
        pickup: { isRequested: false },
        productCode: params.productCode,
        accounts: [{ typeCode: "shipper", number: ACCOUNT }],
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
                weight: Math.max(params.weightKg, 0.1),
                dimensions: {
                    length: Math.ceil(params.length),
                    width:  Math.ceil(params.width),
                    height: Math.ceil(params.height),
                },
                description: params.item_name,
            }],
            isCustomsDeclarable: true,
            declaredValue:    params.item_value ?? 100,
            declaredValueCurrency: "USD",
            description:      params.item_name,
            incoterm:         "DAP",
            unitOfMeasurement: "metric",
            exportDeclaration: {
                lineItems: [{
                    number:      1,
                    description: params.item_name,
                    price:       params.item_value ?? 100,
                    priceCurrency: "USD",
                    quantity: { value: 1, unitOfMeasurement: "PCS" },
                    weight:   { netValue: Math.max(params.weightKg, 0.1), grossValue: Math.max(params.weightKg, 0.1) },
                    exportReasonType: "permanent",
                    manufacturerCountry: "TH",
                }],
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
            imageOptions: [{ typeCode: "label", templateName: "ECOM26_84_001" }],
        },
        customerReferences: [
            { value: (params.remark || params.item_name || "").slice(0, 50), typeCode: "CU" },
        ],
    };

    console.log("[DHL createShipment payload]", JSON.stringify(payload, null, 2));
    return dhlPost("shipments", payload);
}

export async function trackDHL(trackingNumber: string) {
    return dhlGet(`shipments/${encodeURIComponent(trackingNumber)}/tracking?trackingView=all-checkpoints`);
}
