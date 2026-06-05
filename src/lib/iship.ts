const BASE = process.env.ISHIP_API_URL || "https://app.iship.cloud/api";
const TOKEN = process.env.ISHIP_BEARER_TOKEN || "";

export const ISHIP_SRC = {
    zipcode:  process.env.ISHIP_SRC_ZIPCODE   || "10160",
    province: process.env.ISHIP_SRC_PROVINCE  || "กรุงเทพมหานคร",
    amphure:  process.env.ISHIP_SRC_AMPHURE   || "ภาษีเจริญ",
    district: process.env.ISHIP_SRC_DISTRICT  || "บางแวก",
    name:     process.env.ISHIP_SENDER_NAME   || "บริษัท เซปทิลเลียน จำกัด",
    phone:    process.env.ISHIP_SENDER_PHONE  || "",
    address:  process.env.ISHIP_SENDER_ADDRESS || "388/13-14 บีอเวนิว ถ.ราชพฤกษ์",
};

export const COURIERS = [
    { code: "FlashExpressA", name: "Flash Express",    logo: "/shipping/flashexpress.png" },
    { code: "Kerry",         name: "Kerry Express",    logo: "/shipping/kerryexpress.png" },
    { code: "ThaiPost",      name: "ไปรษณีย์ไทย (EMS)", logo: "/shipping/ems.jpeg" },
    { code: "Ninja",         name: "Ninja Van",        logo: "/shipping/ninja.png" },
    { code: "DHL",           name: "DHL",              logo: "/shipping/dhl.png" },
];

async function ishipPost(path: string, body: object) {
    const res = await fetch(`${BASE}/${path}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });
    return res.json();
}

async function ishipGet(path: string) {
    const res = await fetch(`${BASE}/${path}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });
    return res.json();
}

export interface CheckPriceParams {
    dst_zipcode:  string;
    dst_province: string;
    dst_amphure:  string;
    dst_district: string;
    weightKg:     number;
    width:        number;
    length:       number;
    height:       number;
}

export interface ShippingRate {
    courier_code:      string;
    courier_name:      string;
    logo:              string;
    price:             number;
    fuel_surcharge_fee: number;
    remote_area:       number;
    total_price:       number;
    estimate_days:     string;
}

export async function checkAllRates(params: CheckPriceParams): Promise<ShippingRate[]> {
    const results = await Promise.all(
        COURIERS.map(async ({ code, name, logo }) => {
            try {
                const res = await ishipPost("v2/check-price", {
                    courier_code:  code,
                    src_zipcode:   ISHIP_SRC.zipcode,
                    src_province:  ISHIP_SRC.province,
                    src_amphure:   ISHIP_SRC.amphure,
                    src_district:  ISHIP_SRC.district,
                    dst_zipcode:   params.dst_zipcode,
                    dst_province:  params.dst_province,
                    dst_amphure:   params.dst_amphure,
                    dst_district:  params.dst_district,
                    weight: String(params.weightKg),
                    width:  String(params.width),
                    length: String(params.length),
                    height: String(params.height),
                });
                if (res.courier_code && res.total_price > 0) {
                    return {
                        courier_code:       res.courier_code,
                        courier_name:       name,
                        logo,
                        price:              res.price ?? 0,
                        fuel_surcharge_fee: res.fuel_surcharge_fee ?? 0,
                        remote_area:        res.remote_area ?? 0,
                        total_price:        res.total_price,
                        estimate_days:      String(res.estimate_shipping_date ?? "3"),
                    } as ShippingRate;
                }
                return null;
            } catch {
                return null;
            }
        })
    );
    return results.filter((r): r is ShippingRate => r !== null);
}

export interface CreateOrderParams {
    courier_code:      string;
    receiver_name:     string;
    receiver_phone:    string;
    receiver_address:  string;
    receiver_district: string;
    receiver_amphure:  string;
    receiver_province: string;
    receiver_zipcode:  string;
    weightKg:          number;
    width:             number;
    length:            number;
    height:            number;
    item_name:         string;
    cod_amount?:       number;
    remark?:           string;
}

export async function createIShipOrder(params: CreateOrderParams) {
    return ishipPost("create_order", {
        courier_code:      params.courier_code,
        sender_name:       ISHIP_SRC.name,
        sender_phone:      ISHIP_SRC.phone,
        sender_address:    ISHIP_SRC.address,
        sender_district:   ISHIP_SRC.district,
        sender_amphure:    ISHIP_SRC.amphure,
        sender_province:   ISHIP_SRC.province,
        sender_zipcode:    ISHIP_SRC.zipcode,
        receiver_name:     params.receiver_name,
        receiver_phone:    params.receiver_phone,
        receiver_address:  params.receiver_address,
        receiver_district: params.receiver_district,
        receiver_amphure:  params.receiver_amphure,
        receiver_province: params.receiver_province,
        receiver_zipcode:  params.receiver_zipcode,
        weight:    String(params.weightKg),
        width:     String(params.width),
        length:    String(params.length),
        height:    String(params.height),
        cod_amount:    params.cod_amount ?? 0,
        item_name:     params.item_name,
        item_quantity: 1,
        remark:        params.remark || "",
    });
}

export async function getIShipOrderStatus(ishipOrderId: string) {
    return ishipGet(`order_status?order_id=${ishipOrderId}`);
}

export async function printIShipLabel(ishipOrderId: string) {
    return ishipGet(`printLabel?order_id=${ishipOrderId}`);
}

export async function cancelIShipOrder(ishipOrderId: string) {
    return ishipPost("cancel_order", { order_id: ishipOrderId });
}
