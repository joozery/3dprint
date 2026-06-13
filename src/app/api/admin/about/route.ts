import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import AboutContent from "@/models/AboutContent";
import User from "@/models/User";

const checkAdmin = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return false;
    
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    return user?.role === "admin";
};

export async function GET() {
    try {
        await connectDB();
        let content = await AboutContent.findOne();
        
        // If not found, create a default one based on current text
        if (!content) {
            content = await AboutContent.create({
                hero: {
                    subtitle: "เกี่ยวกับเรา",
                    title1: "เราไม่ได้แค่พิมพ์ 3D",
                    titleHighlight: "เราเป็นพาร์ทเนอร์",
                    title2: "ในการสร้างสรรค์ชิ้นงานของคุณ",
                    description: "PDM Pro มุ่งให้บริการพิมพ์ 3 มิติคุณภาพสูง ด้วยเทคโนโลยีที่ทันสมัย วัสดุที่หลากหลายและได้มาตรฐาน พร้อมทีมงานมืออาชีพ เพื่อส่งมอบทุกโปรเจกต์ของคุณให้เป็นจริง",
                },
                whoWeAre: {
                    title: "PrintMyDesign คือใคร",
                    description: "เราเป็นผู้ให้บริการพิมพ์ 3 มิติแบบครบวงจร ด้วยเครื่องพิมพ์คุณภาพสูงหลากหลายประเภท ทีมงานของเราประกอบด้วยผู้เชี่ยวชาญที่ทำงานด้วยความวิริยะ และการมุ่งมั่น ทำให้ลูกค้าได้รับสินค้าคุณภาพสูงที่ตรงความต้องการ ในทุกอุตสาหกรรม",
                    stats: [
                        { icon: "Award", label: "ความเชี่ยวชาญ", value: "10+ ปี" },
                        { icon: "Users", label: "ทีมงาน", value: "มืออาชีพ" },
                        { icon: "Cpu", label: "เทคโนโลยี", value: "ทันสมัย" },
                        { icon: "Zap", label: "บริการ", value: "รวดเร็ว" },
                    ]
                },
                mvv: [
                    {
                        icon: "Target",
                        title: "พันธกิจ (Mission)",
                        desc: "มุ่งให้บริการพิมพ์ 3 มิติคุณภาพสูง ระดับมืออาชีพ ด้วยเทคโนโลยีที่ทันสมัย เพื่อช่วยให้ลูกค้าสร้างสรรค์ผลงานที่ดีที่สุดได้",
                        color: "text-blue-600",
                        bg: "bg-blue-50",
                        border: "border-blue-100",
                    },
                    {
                        icon: "Eye",
                        title: "วิสัยทัศน์ (Vision)",
                        desc: "เป็นผู้นำบริการพิมพ์ 3 มิติในประเทศไทย ด้วยคุณภาพที่ไว้วางใจ และเป็นเส้นทางสู่การนำเสนอนวัตกรรมและอุตสาหกรรมการผลิตใหม่",
                        color: "text-indigo-600",
                        bg: "bg-indigo-50",
                        border: "border-indigo-100",
                    },
                    {
                        icon: "Gem",
                        title: "ค่านิยม (Values)",
                        items: ["คุณภาพที่ไม่ยอมต่ำ", "ซื่อสัตย์และโปร่งใส", "บริการการเรียนรู้", "พัฒนาต่อเนื่องเสมอ"],
                        color: "text-violet-600",
                        bg: "bg-violet-50",
                        border: "border-violet-100",
                    },
                ],
                whyUs: [
                    { icon: "CheckCircle2", title: "งานคุณภาพสูง", desc: "ตรวจสอบคุณภาพทุกชิ้นงาน ก่อนส่งมอบ", color: "text-blue-600", bg: "bg-blue-50" },
                    { icon: "Clock", title: "รวดเร็ว ตรงเวลา", desc: "ให้ความสำคัญกับเวลา และส่งมอบตรงตามนัดหมาย", color: "text-emerald-600", bg: "bg-emerald-50" },
                    { icon: "Layers", title: "วัสดุหลากหลาย", desc: "รองรับ PLA, ABS, PETG, TPU และวัสดุวิศวกรรมอื่นๆ", color: "text-violet-600", bg: "bg-violet-50" },
                    { icon: "MessageCircle", title: "ให้คำปรึกษา", desc: "ทีมผู้เชี่ยวชาญพร้อมแนะนำ และแก้ไขปัญหา", color: "text-amber-600", bg: "bg-amber-50" },
                    { icon: "ShieldCheck", title: "ความลับปลอดภัย", desc: "ข้อมูลและโมเดลของคุณถูกเก็บรักษา 100%", color: "text-rose-600", bg: "bg-rose-50" },
                ],
                team: [
                    { name: "กฤษฎา ว.", role: "ผู้เชี่ยวชาญการพิมพ์ 3 มิติ", img: "/about/team-1.png" },
                    { name: "ธนวัฒน์ ค.", role: "วิศวกรออกแบบผลิตภัณฑ์", img: "/about/team-2.png" },
                    { name: "ณัฐชา ม.", role: "ที่ปรึกษาด้านการผลิต", img: "/about/team-3.png" },
                ],
                cta: {
                    title: "พร้อมเริ่มโปรเจกต์ของคุณแล้วหรือยัง?",
                    description: "อัปโหลดไฟล์ STL ของคุณ เพื่อรับประเมินราคาและระยะเวลาผลิตฟรี!",
                }
            });
        }
        
        return NextResponse.json(content);
    } catch (error) {
        console.error("GET AboutContent Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const isAdmin = await checkAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const data = await req.json();
        await connectDB();

        let content = await AboutContent.findOne();
        if (content) {
            content = await AboutContent.findByIdAndUpdate(content._id, data, { new: true });
        } else {
            content = await AboutContent.create(data);
        }

        return NextResponse.json({ success: true, data: content });
    } catch (error) {
        console.error("PUT AboutContent Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
