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
    if (!data.access_token) throw new Error(data.error_description || "FedEx auth failed");
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

export async function getFedExRates(params: FedExRateParams): Promise<FedExRate[]> {
    const raw = await fedexPost("rate/v1/rates/quotes", {
        accountNumber: { value: ACCOUNT_NUMBER },
        requestedShipment: {
            shipper: {
                address: {
                    streetLines:          [FEDEX_SRC.address],
                    city:                 FEDEX_SRC.city,
                    stateOrProvinceCode:  FEDEX_SRC.province,
                    postalCode:           FEDEX_SRC.zipcode,
                    countryCode:          "TH",
                },
            },
            recipient: {
                address: {
                    postalCode:          params.dst_zipcode,
                    stateOrProvinceCode: params.dst_province,
                    countryCode:         "TH",
                    residential:         false,
                },
            },
            pickupType:       "USE_SCHEDULED_PICKUP",
            rateRequestType:  ["LIST", "ACCOUNT"],
            requestedPackageLineItems: [{
                weight: { units: "KG", value: Math.max(params.weightKg, 0.1) },
                dimensions: {
                    length: Math.ceil(params.length),
                    width:  Math.ceil(params.width),
                    height: Math.ceil(params.height),
                    units:  "CM",
                },
            }],
        },
    });

    const details: any[] = raw?.output?.rateReplyDetails || [];
    return details
        .map((d: any) => {
            const rated = d.ratedShipmentDetails?.[0];
            const price = rated?.totalNetFedExCharge
                ?? rated?.shipmentRateDetail?.totalNetCharge?.amount
                ?? 0;
            return {
                serviceType:   d.serviceType,
                serviceName:   d.serviceName || d.serviceType,
                totalPrice:    Number(price),
                currency:      rated?.currency || "THB",
                estimatedDays: d.commit?.dateDetail?.dayFormat || d.commit?.label || "-",
            };
        })
        .filter(r => r.totalPrice > 0);
}

export interface FedExCreateParams {
    serviceType:  string;
    dst_name:     string;
    dst_phone:    string;
    dst_address:  string;
    dst_city:     string;
    dst_province: string;
    dst_zipcode:  string;
    weightKg:     number;
    width:        number;
    length:       number;
    height:       number;
    item_name:    string;
    remark?:      string;
}

export async function createFedExShipment(params: FedExCreateParams) {
    const today = new Date().toISOString().split("T")[0];
    return fedexPost("ship/v1/shipments", {
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
                    stateOrProvinceCode: FEDEX_SRC.province,
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
                    stateOrProvinceCode: params.dst_province,
                    postalCode:          params.dst_zipcode,
                    countryCode:         "TH",
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
    });
}

export async function trackFedEx(trackingNumber: string) {
    return fedexPost("track/v1/trackingnumbers", {
        includeDetailedScans: true,
        trackingInfo: [{ trackingNumberInfo: { trackingNumber } }],
    });
}
