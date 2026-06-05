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
    { code: "FlashExpressA", name: "Flash Express",   logo: "/shipping/flashexpress.png" },
    { code: "KerryExpress",  name: "Kerry Express",   logo: "/shipping/kerryexpress.png" },
    { code: "BestExpress",   name: "Best Express",    logo: "/shipping/best.png" },
    { code: "ShopeeExpress", name: "Shopee Express",  logo: "/shipping/shopee.png" },
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
    courier_code:  string;
    dst_name:      string;
    dst_phone:     string;
    dst_address:   string;
    dst_district:  string;
    dst_amphure:   string;
    dst_province:  string;
    dst_zipcode:   string;
    weightKg:      number;
    width:         number;
    length:        number;
    height:        number;
    item_name:     string;
    cod_amount?:   number;
    category_id?:  number;
    remark?:       string;
}

export async function createIShipOrder(params: CreateOrderParams) {
    return ishipPost("create_order", {
        platform_name:  "3DPrintPro",
        courier_code:   params.courier_code,
        // ผู้ส่ง (src = source = ร้านเรา)
        src_name:       ISHIP_SRC.name,
        src_phone:      ISHIP_SRC.phone,
        src_address:    ISHIP_SRC.address,
        src_district:   ISHIP_SRC.district,
        src_amphure:    ISHIP_SRC.amphure,
        src_province:   ISHIP_SRC.province,
        src_zipcode:    ISHIP_SRC.zipcode,
        // ผู้รับ (dst = destination = ลูกค้า)
        dst_name:       params.dst_name,
        dst_phone:      params.dst_phone,
        dst_address:    params.dst_address,
        dst_district:   params.dst_district,
        dst_amphure:    params.dst_amphure,
        dst_province:   params.dst_province,
        dst_zipcode:    params.dst_zipcode,
        weight:         params.weightKg,
        width:          params.width,
        length:         params.length,
        height:         params.height,
        cod_amount:     params.cod_amount ?? 0,
        category_id:    params.category_id ?? 3,
        remark:         params.remark || "",
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
