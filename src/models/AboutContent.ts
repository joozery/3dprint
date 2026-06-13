import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema({
    hero: {
        subtitle: { type: String, default: "เกี่ยวกับเรา" },
        title1: { type: String, default: "เราไม่ได้แค่พิมพ์ 3D" },
        titleHighlight: { type: String, default: "เราเป็นพาร์ทเนอร์" },
        title2: { type: String, default: "ในการสร้างสรรค์ชิ้นงานของคุณ" },
        description: { type: String, default: "PDM Pro มุ่งให้บริการพิมพ์ 3 มิติคุณภาพสูง ด้วยเทคโนโลยีที่ทันสมัย วัสดุที่หลากหลายและได้มาตรฐาน พร้อมทีมงานมืออาชีพ เพื่อส่งมอบทุกโปรเจกต์ของคุณให้เป็นจริง" },
    },
    whoWeAre: {
        title: { type: String, default: "PrintMyDesign คือใคร" },
        description: { type: String, default: "เราเป็นผู้ให้บริการพิมพ์ 3 มิติแบบครบวงจร ด้วยเครื่องพิมพ์คุณภาพสูงหลากหลายประเภท ทีมงานของเราประกอบด้วยผู้เชี่ยวชาญที่ทำงานด้วยความวิริยะ และการมุ่งมั่น ทำให้ลูกค้าได้รับสินค้าคุณภาพสูงที่ตรงความต้องการ ในทุกอุตสาหกรรม" },
        stats: [{
            icon: String,
            label: String,
            value: String,
        }]
    },
    mvv: [{
        icon: String,
        title: String,
        desc: String,
        items: [String],
        color: String,
        bg: String,
        border: String,
    }],
    whyUs: [{
        icon: String,
        title: String,
        desc: String,
        color: String,
        bg: String,
    }],
    team: [{
        name: String,
        role: String,
        img: String,
    }],
    cta: {
        title: { type: String, default: "พร้อมเริ่มโปรเจกต์ของคุณแล้วหรือยัง?" },
        description: { type: String, default: "อัปโหลดไฟล์ STL ของคุณ เพื่อรับประเมินราคาและระยะเวลาผลิตฟรี!" },
    }
}, { timestamps: true });

export default mongoose.models.AboutContent || mongoose.model("AboutContent", aboutContentSchema);
