import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import MaterialPageContent from "@/models/MaterialPageContent";
import MaterialPageManager from "@/components/admin/material-pages/MaterialPageManager";
import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";

const SEED_DATA = [
    {
        slug: "pla", name: "PLA", fullName: "Polylactic Acid", order: 1,
        iconName: "Leaf", iconColor: "text-green-500", iconBg: "bg-green-50",
        badge: "ยอดนิยม", detailUrl: "/materials/pla",
        shortDesc: "วัสดุยอดนิยม พิมพ์ง่าย เป็นมิตรกับสิ่งแวดล้อม เหมาะสำหรับงานโมเดลทั่วไปที่ไม่ได้ต้องการความทนทานสูง",
        features: ["พิมพ์ง่าย", "ผิวสวย ไม่มีบิดงอ", "เหมาะสำหรับงานตกแต่งและต้นแบบ", "เป็นมิตรต่อสิ่งแวดล้อม"],
        properties: [
            { label: "ความแข็งแรง", subLabel: "(Strength)", value: 4 },
            { label: "ทนความร้อน", subLabel: "(Heat Resistance)", value: 2 },
            { label: "ความยืดหยุ่น", subLabel: "(Flexibility)", value: 2 },
            { label: "ทนต่อแรงกระแทก", subLabel: "(Impact Resistance)", value: 3 },
            { label: "การใช้งานภายนอก", subLabel: "(Outdoor Durability)", value: 2 },
            { label: "ความง่ายในการพิมพ์", subLabel: "(Printability)", value: 5 },
        ],
        nozzleTemp: "190–220°C", bedTemp: "50–60°C", cooling: "เปิดพัดลม",
    },
    {
        slug: "abs", name: "ABS", fullName: "Acrylonitrile Butadiene Styrene", order: 2,
        iconName: "Shield", iconColor: "text-orange-500", iconBg: "bg-orange-50",
        detailUrl: "/materials/abs",
        shortDesc: "วัสดุทนทานสูง ทนความร้อนได้ดี เหมาะสำหรับชิ้นส่วนที่ต้องรับแรงและใช้งานจริง",
        features: ["ทนความร้อนสูงถึง 100°C", "ผิวสวยงาม ขัดเงาได้", "ทนแรงกระแทก", "เหมาะสำหรับชิ้นส่วน Functional"],
        properties: [
            { label: "ความแข็งแรง", subLabel: "(Strength)", value: 5 },
            { label: "ทนความร้อน", subLabel: "(Heat Resistance)", value: 4 },
            { label: "ความยืดหยุ่น", subLabel: "(Flexibility)", value: 2 },
            { label: "ทนต่อแรงกระแทก", subLabel: "(Impact Resistance)", value: 4 },
            { label: "การใช้งานภายนอก", subLabel: "(Outdoor Durability)", value: 4 },
            { label: "ความง่ายในการพิมพ์", subLabel: "(Printability)", value: 3 },
        ],
        nozzleTemp: "230–250°C", bedTemp: "100°C", cooling: "ปิดพัดลม",
    },
    {
        slug: "petg", name: "PETG", fullName: "Polyethylene Terephthalate Glycol", order: 3,
        iconName: "Box", iconColor: "text-blue-500", iconBg: "bg-blue-50",
        detailUrl: "/materials/petg",
        shortDesc: "จุดกึ่งกลางระหว่าง PLA และ ABS ทนทาน พิมพ์ง่าย เหมาะสำหรับชิ้นส่วนใช้งานทั่วไปที่ต้องการความทนทาน",
        features: ["ทนทานกว่า PLA", "พิมพ์ง่ายกว่า ABS", "ทนความชื้น", "เหมาะสำหรับชิ้นส่วนที่โดนน้ำ"],
        properties: [
            { label: "ความแข็งแรง", subLabel: "(Strength)", value: 4 },
            { label: "ทนความร้อน", subLabel: "(Heat Resistance)", value: 3 },
            { label: "ความยืดหยุ่น", subLabel: "(Flexibility)", value: 3 },
            { label: "ทนต่อแรงกระแทก", subLabel: "(Impact Resistance)", value: 4 },
            { label: "การใช้งานภายนอก", subLabel: "(Outdoor Durability)", value: 3 },
            { label: "ความง่ายในการพิมพ์", subLabel: "(Printability)", value: 4 },
        ],
        nozzleTemp: "220–240°C", bedTemp: "70–80°C", cooling: "เปิดพัดลมเบาๆ",
    },
    {
        slug: "tpu", name: "TPU", fullName: "Thermoplastic Polyurethane", order: 4,
        iconName: "Droplets", iconColor: "text-cyan-500", iconBg: "bg-cyan-50",
        detailUrl: "/materials/tpu",
        shortDesc: "วัสดุยืดหยุ่นสูง นุ่ม กันกระแทก เหมาะสำหรับงานยาง ซีล กรอบโทรศัพท์ และชิ้นส่วนที่ต้องการความยืดหยุ่น",
        features: ["ยืดหยุ่นสูงมาก", "กันกระแทกดีเยี่ยม", "ทนสารเคมี", "เหมาะสำหรับงานยางและซีล"],
        properties: [
            { label: "ความแข็งแรง", subLabel: "(Strength)", value: 3 },
            { label: "ทนความร้อน", subLabel: "(Heat Resistance)", value: 2 },
            { label: "ความยืดหยุ่น", subLabel: "(Flexibility)", value: 5 },
            { label: "ทนต่อแรงกระแทก", subLabel: "(Impact Resistance)", value: 5 },
            { label: "การใช้งานภายนอก", subLabel: "(Outdoor Durability)", value: 3 },
            { label: "ความง่ายในการพิมพ์", subLabel: "(Printability)", value: 2 },
        ],
        nozzleTemp: "210–230°C", bedTemp: "30–60°C", cooling: "เปิดพัดลม",
    },
    {
        slug: "nylon", name: "Nylon", fullName: "Polyamide (PA)", order: 5,
        iconName: "Layers", iconColor: "text-slate-500", iconBg: "bg-slate-50",
        detailUrl: "/materials/nylon",
        shortDesc: "วัสดุวิศวกรรมขั้นสูง แข็งแกร่งสูงมาก ทนความร้อน เหมาะสำหรับชิ้นส่วนวิศวกรรมที่ต้องการประสิทธิภาพสูง",
        features: ["แข็งแกร่งสูงมาก", "ทนความร้อนสูงถึง 120°C", "ทนการสึกหรอ", "เหมาะสำหรับงานวิศวกรรม"],
        properties: [
            { label: "ความแข็งแรง", subLabel: "(Strength)", value: 5 },
            { label: "ทนความร้อน", subLabel: "(Heat Resistance)", value: 5 },
            { label: "ความยืดหยุ่น", subLabel: "(Flexibility)", value: 3 },
            { label: "ทนต่อแรงกระแทก", subLabel: "(Impact Resistance)", value: 5 },
            { label: "การใช้งานภายนอก", subLabel: "(Outdoor Durability)", value: 4 },
            { label: "ความง่ายในการพิมพ์", subLabel: "(Printability)", value: 2 },
        ],
        nozzleTemp: "240–260°C", bedTemp: "70–90°C", cooling: "ปิดพัดลม",
    },
    {
        slug: "resin", name: "Resin", fullName: "UV-Cured Photopolymer Resin", order: 6,
        iconName: "Zap", iconColor: "text-purple-500", iconBg: "bg-purple-50",
        detailUrl: "/materials/resin",
        shortDesc: "เรซิ่นพิมพ์ด้วยเทคโนโลยี SLA/MSLA ความละเอียดสูงมาก เหมาะสำหรับโมเดลละเอียด เครื่องประดับ และชิ้นงาน Detail สูง",
        features: ["ความละเอียดสูงมาก", "ผิวเรียบเนียน", "เหมาะสำหรับโมเดลฟิกเกอร์", "รายละเอียดคมชัด"],
        properties: [
            { label: "ความแข็งแรง", subLabel: "(Strength)", value: 3 },
            { label: "ทนความร้อน", subLabel: "(Heat Resistance)", value: 2 },
            { label: "ความยืดหยุ่น", subLabel: "(Flexibility)", value: 1 },
            { label: "ทนต่อแรงกระแทก", subLabel: "(Impact Resistance)", value: 2 },
            { label: "การใช้งานภายนอก", subLabel: "(Outdoor Durability)", value: 2 },
            { label: "ความง่ายในการพิมพ์", subLabel: "(Printability)", value: 5 },
        ],
        nozzleTemp: "UV 405nm", bedTemp: "–", cooling: "UV Curing 2–5 นาที",
    },
    {
        slug: "carbon-fiber", name: "Carbon Fiber", fullName: "Carbon Fiber Reinforced", order: 7,
        iconName: "Settings", iconColor: "text-zinc-800", iconBg: "bg-zinc-100",
        detailUrl: "/materials/engineering-resin",
        shortDesc: "ไฟเบอร์คาร์บอนผสม เบาแต่แข็งแกร่งสูง ดูพรีเมียม เหมาะสำหรับชิ้นส่วนโครงสร้างและงานที่ต้องการน้ำหนักเบา",
        features: ["น้ำหนักเบามาก", "แข็งแกร่งสูง", "ดูพรีเมียม", "เหมาะสำหรับโครงสร้างน้ำหนักเบา"],
        properties: [
            { label: "ความแข็งแรง", subLabel: "(Strength)", value: 5 },
            { label: "ทนความร้อน", subLabel: "(Heat Resistance)", value: 4 },
            { label: "ความยืดหยุ่น", subLabel: "(Flexibility)", value: 1 },
            { label: "ทนต่อแรงกระแทก", subLabel: "(Impact Resistance)", value: 4 },
            { label: "การใช้งานภายนอก", subLabel: "(Outdoor Durability)", value: 4 },
            { label: "ความง่ายในการพิมพ์", subLabel: "(Printability)", value: 3 },
        ],
        nozzleTemp: "240–260°C", bedTemp: "80°C", cooling: "เปิดพัดลม",
    },
];

export default async function AdminMaterialPagesPage() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") redirect("/admin/login");

    await dbConnect();
    let items = await MaterialPageContent.find().sort({ order: 1, name: 1 }).lean();

    if (items.length === 0) {
        await MaterialPageContent.insertMany(SEED_DATA);
        items = await MaterialPageContent.find().sort({ order: 1 }).lean();
    }

    const data = JSON.parse(JSON.stringify(items));

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Layers className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">จัดการหน้า Materials</h1>
                        <p className="text-xs text-slate-400">แก้ไขเนื้อหา ข้อมูล และคุณสมบัติของวัสดุแต่ละชนิด — {data.length} วัสดุ</p>
                    </div>
                </div>
            </div>
            <MaterialPageManager initialData={data} />
        </div>
    );
}
