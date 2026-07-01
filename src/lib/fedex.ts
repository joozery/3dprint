const BASE = process.env.FEDEX_ENV === "production"
    ? "https://apis.fedex.com"
    : "https://apis-sandbox.fedex.com";

const CLIENT_ID      = process.env.FEDEX_API_KEY       || "";
const CLIENT_SECRET  = process.env.FEDEX_SECRET_KEY    || "";
const ACCOUNT_NUMBER = process.env.FEDEX_ACCOUNT_NUMBER || "";

// Server-side token cache (resets on cold start)
let _token       = "";
let _tokenExpiry = 0;

async function getToken(): Promise<string> {
    if (_token && Date.now() < _tokenExpiry) return _token;
    const res = await fetch(`${BASE}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type:    "client_credentials",
            client_id:     CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }),
        cache: "no-store",
    });
    const data = await res.json();
    if (!data.access_token) {
        console.error("[FedEx auth FAILED]", JSON.stringify(data));
        throw new Error(data.error_description || "FedEx auth failed");
    }
    console.log("[FedEx auth OK] token expires in", data.expires_in, "s");
    _token       = data.access_token;
    _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return _token;
}

async function fedexPost(path: string, body: object) {
    const token = await getToken();
    const res = await fetch(`${BASE}/${path}`, {
        method: "POST",
        headers: {
            Authorization:  `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-locale":     "en_US",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });
    return res.json();
}

export const FEDEX_SRC = {
    name:     process.env.ISHIP_SENDER_NAME    || "บริษัท เซปทิลเลียน จำกัด",
    phone:    process.env.ISHIP_SENDER_PHONE   || "021234567",
    address:  process.env.ISHIP_SENDER_ADDRESS || "388/13-14 บีอเวนิว ถ.ราชพฤกษ์",
    city:     process.env.ISHIP_SRC_AMPHURE    || "Bang Phai",
    province: process.env.ISHIP_SRC_PROVINCE   || "Bangkok",
    zipcode:  process.env.ISHIP_SRC_ZIPCODE    || "10160",
};

export interface FedExRateParams {
    dst_zipcode:  string;
    dst_province: string;
    dst_city?:    string;
    dst_country?: string;
    weightKg:     number;
    width:        number;
    length:       number;
    height:       number;
}

export interface FedExRate {
    serviceType:  string;
    serviceName:  string;
    totalPrice:   number;
    currency:     string;
    estimatedDays: string;
}

const FEDEX_INTL_SERVICES = [
    { serviceType: "INTERNATIONAL_PRIORITY",       serviceName: "FedEx International Priority" },
    { serviceType: "INTERNATIONAL_ECONOMY",        serviceName: "FedEx International Economy" },
    { serviceType: "FEDEX_INTERNATIONAL_PRIORITY", serviceName: "FedEx International Priority Express" },
];

export async function getFedExRates(params: FedExRateParams): Promise<FedExRate[]> {
    const shipmentBase = {
        shipper: {
            address: {
                streetLines:          [FEDEX_SRC.address],
                city:                 FEDEX_SRC.city,
                postalCode:           FEDEX_SRC.zipcode,
                countryCode:          "TH",
            },
        },
        recipient: {
            address: {
                postalCode:          params.dst_zipcode || undefined,
                stateOrProvinceCode: (params.dst_province && params.dst_province.length <= 2) ? params.dst_province : undefined,
                city:                params.dst_city    || undefined,
                countryCode:         params.dst_country || "TH",
                residential:         false,
            },
        },
        pickupType:      "USE_SCHEDULED_PICKUP",
        rateRequestType: ["LIST"],
        requestedPackageLineItems: [{
            weight: { units: "KG", value: Math.max(params.weightKg, 0.1) },
            dimensions: {
                length: Math.ceil(params.length),
                width:  Math.ceil(params.width),
                height: Math.ceil(params.height),
                units:  "CM",
            },
        }],
    };

    const results = await Promise.all(
        FEDEX_INTL_SERVICES.map(async ({ serviceType, serviceName }) => {
            try {
                const raw = await fedexPost("rate/v1/rates/quotes", {
                    accountNumber: { value: ACCOUNT_NUMBER },
                    requestedShipment: { ...shipmentBase, serviceType },
                });
                const detail = raw?.output?.rateReplyDetails?.[0];
                if (!detail) return null;
                const rated = detail.ratedShipmentDetails?.[0];
                const price = Number(rated?.totalNetFedExCharge ?? rated?.shipmentRateDetail?.totalNetCharge?.amount ?? 0);
                if (price <= 0) return null;
                return {
                    serviceType,
                    serviceName,
                    totalPrice:    price,
                    currency:      rated?.currency || "THB",
                    estimatedDays: detail.commit?.dateDetail?.dayFormat || detail.commit?.label || "-",
                } as FedExRate;
            } catch {
                return null;
            }
        })
    );

    const rates = results.filter((r): r is FedExRate => r !== null);
    console.log("[FedEx rates]", params.dst_country, "→ found", rates.length, "rates");
    return rates;
}

export interface FedExCreateParams {
    serviceType:    string;
    dst_name:       string;
    dst_phone:      string;
    dst_address:    string;
    dst_city:       string;
    dst_province:   string;
    dst_zipcode:    string;
    dst_country?:   string;
    weightKg:       number;
    width:          number;
    length:         number;
    height:         number;
    item_name:      string;
    remark?:        string;
    customsValue?:  number;
    customsCurrency?: string;
    numPieces?:     number;
}

export async function createFedExShipment(params: FedExCreateParams) {
    const today       = new Date().toISOString().split("T")[0];
    const dstCountry  = params.dst_country || "TH";
    const isIntl      = dstCountry !== "TH";

    const customsClearanceDetail = isIntl ? {
        isDocumentOnly: false,
        dutiesPayment: {
            paymentType: "RECIPIENT",
        },
        totalCustomsValue: {
            amount:   String(Math.round(params.customsValue || 0)),
            currency: params.customsCurrency || "THB",
        },
        commodities: [{
            description:          params.item_name,
            countryOfManufacture: "TH",
            numberOfPieces:       String(params.numPieces || 1),
            weight: {
                value: Math.max(params.weightKg, 0.1),
                units: "KG",
            },
            quantity:      String(params.numPieces || 1),
            quantityUnits: "PCS",
            unitPrice: {
                amount:   String(Math.round(params.customsValue || 0)),
                currency: params.customsCurrency || "THB",
            },
            customsValue: {
                amount:   String(Math.round(params.customsValue || 0)),
                currency: params.customsCurrency || "THB",
            },
        }],
    } : undefined;

    const body: any = {
        labelResponseOptions: "URL_ONLY",
        requestedShipment: {
            shipper: {
                contact: {
                    personName:  FEDEX_SRC.name,
                    phoneNumber: FEDEX_SRC.phone.replace(/\D/g, ""),
                    companyName: FEDEX_SRC.name,
                },
                address: {
                    streetLines:         [FEDEX_SRC.address],
                    city:                FEDEX_SRC.city,
                    postalCode:          FEDEX_SRC.zipcode,
                    countryCode:         "TH",
                },
            },
            recipients: [{
                contact: {
                    personName:  params.dst_name,
                    phoneNumber: params.dst_phone.replace(/\D/g, ""),
                },
                address: {
                    streetLines:         [params.dst_address],
                    city:                params.dst_city || params.dst_province,
                    stateOrProvinceCode: (params.dst_province && params.dst_province.length <= 2) ? params.dst_province : undefined,
                    postalCode:          params.dst_zipcode,
                    countryCode:         dstCountry,
                    residential:         true,
                },
            }],
            shipDatestamp:   today,
            serviceType:     params.serviceType,
            packagingType:   "YOUR_PACKAGING",
            pickupType:      "USE_SCHEDULED_PICKUP",
            shippingChargesPayment: {
                paymentType: "SENDER",
                payor: {
                    responsibleParty: {
                        accountNumber: { value: ACCOUNT_NUMBER },
                    },
                },
            },
            ...(customsClearanceDetail && { customsClearanceDetail }),
            labelSpecification: {
                imageType:      "PDF",
                labelStockType: "PAPER_4X6",
            },
            requestedPackageLineItems: [{
                weight: { units: "KG", value: Math.max(params.weightKg, 0.1) },
                dimensions: {
                    length: Math.ceil(params.length),
                    width:  Math.ceil(params.width),
                    height: Math.ceil(params.height),
                    units:  "CM",
                },
                itemDescription: params.item_name,
            }],
        },
        accountNumber: { value: ACCOUNT_NUMBER },
    };

    return fedexPost("ship/v1/shipments", body);
}

export async function trackFedEx(trackingNumber: string) {
    return fedexPost("track/v1/trackingnumbers", {
        includeDetailedScans: true,
        trackingInfo: [{ trackingNumberInfo: { trackingNumber } }],
    });
}
