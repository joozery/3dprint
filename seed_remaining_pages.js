import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const servicePageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  subtitle: String,
  description: String,
  heroImage: String,
  themeColor: String,
  about: {
    title: String,
    content: String,
    subContent: String,
    image: String,
    bullets: [{ title: String, desc: String }]
  },
  materials: {
    title: String,
    items: [{ name: String, desc1: String, desc2: String, desc3: String, image: String }]
  },
  process: {
    title: String,
    steps: [{ step: Number, title: String, desc: String }]
  },
  isActive: { type: Boolean, default: true }
});

const ServicePage = mongoose.models.ServicePage || mongoose.model("ServicePage", servicePageSchema);

const newPages = [
  {
    slug: "pcb",
    title: "PCB / PCBA",
    subtitle: "Service",
    description: "ออกแบบ ผลิต และประกอบแผงวงจรอิเล็กทรอนิกส์ครบวงจร ตั้งแต่ Prototype ถึง Mass Production",
    heroImage: "/cover/cpverfdm.png", // Use a generic cover
    themeColor: "blue",
    about: {
      title: "บริการ PCB / PCBA คืออะไร?",
      content: "รับออกแบบ ผลิต และประกอบแผงวงจรอิเล็กทรอนิกส์แบบครบวงจร (Printed Circuit Board Assembly) เพื่อตอบสนองความต้องการตั้งแต่ระดับต้นแบบ (Prototype) ไปจนถึงการผลิตจำนวนมาก (Mass Production)",
      subContent: "เราให้บริการด้วยเครื่องจักรที่ทันสมัย (Pick & Place) และการตรวจสอบคุณภาพที่เข้มงวด (AOI, X-Ray) เพื่อให้แน่ใจว่าได้บอร์ดที่มีคุณภาพสูงสุด",
      image: "/cover/pla.png",
      bullets: [
        { title: "PCB Design (EDA)", desc: "บริการออกแบบแผงวงจรจาก Schematic ถึง Layout" },
        { title: "PCB Fabrication", desc: "1-16 Layer, Min Track 4mil, Min Hole 0.2mm" },
        { title: "SMT Assembly", desc: "0402, BGA, QFP, QFN ความเร็วสูงสุด 25,000 CPH" }
      ]
    },
    materials: {
      title: "บริการที่ครอบคลุม",
      items: [
        { name: "PCB Fabrication", desc1: "1-16 Layer", desc2: "HAL/ENIG/OSP", desc3: "ผลิตตามมาตรฐาน", image: "/cover/pla.png" },
        { name: "Through-hole", desc1: "Manual Soldering", desc2: "Wave Soldering", desc3: "สำหรับชิ้นส่วน DIP", image: "/cover/pla.png" },
        { name: "Testing & QC", desc1: "AOI Inspection", desc2: "X-Ray BGA", desc3: "Functional Test", image: "/cover/pla.png" }
      ]
    },
    process: {
      title: "ขั้นตอนการผลิต",
      steps: [
        { step: 1, title: "รับไฟล์ Gerber", desc: "Gerber RS-274X, BOM, Pick & Place" },
        { step: 2, title: "PCB Fabrication", desc: "ผลิตแผ่น PCB ตามสเปค 1-16 Layer" },
        { step: 3, title: "SMT Assembly", desc: "วางและบัดกรีชิ้นส่วน SMD" },
        { step: 4, title: "Testing & QC", desc: "AOI, X-Ray ก่อนส่งมอบ" }
      ]
    }
  },
  {
    slug: "scanning",
    title: "3D Scanning",
    subtitle: "& Reverse Engineering",
    description: "บริการสแกน 3 มิติ และ Reverse Engineering แปลงชิ้นงานจริงเป็นไฟล์ CAD เพื่อนำไปต่อยอด แก้ไข หรือผลิตซ้ำ",
    heroImage: "/cover/pla.png",
    themeColor: "purple",
    about: {
      title: "บริการ 3D Scanning คืออะไร?",
      content: "บริการสแกน 3 มิติคือการใช้เครื่องสแกนเลเซอร์หรือแสงโครงสร้างที่มีความแม่นยำสูง ยิงลงบนพื้นผิวของชิ้นงานจริง เพื่อเก็บข้อมูลจุด (Point Cloud) และแปลงเป็นโมเดล 3 มิติ",
      subContent: "เหมาะสำหรับชิ้นส่วนที่ไม่มีแบบวาด ชิ้นส่วนยานยนต์ อะไหล่เครื่องจักร หรืองานประติมากรรมที่ต้องการเก็บรูปทรงดั้งเดิม หรือเพื่อทำ Reverse Engineering กลับเป็นไฟล์ CAD",
      image: "/cover/cpverfdm.png",
      bullets: [
        { title: "ความแม่นยำสูง", desc: "เก็บรายละเอียดได้ถึงระดับ 0.05 mm" },
        { title: "รองรับขนาดหลากหลาย", desc: "สแกนได้ตั้งแต่เหรียญไปจนถึงรถยนต์ทั้งคัน" },
        { title: "Reverse Engineering", desc: "แปลงเป็น STEP, IGES, SolidWorks Part" }
      ]
    },
    materials: {
      title: "บริการไฟล์สแกน",
      items: [
        { name: "Mesh File (STL)", desc1: "โครงข่าย 3 เหลี่ยม", desc2: "ใช้ปริ้นท์ 3D ได้เลย", desc3: "แก้ทรงไม่ได้", image: "/cover/pla.png" },
        { name: "CAD File (STEP)", desc1: "ผ่าน Reverse Eng.", desc2: "พื้นผิวเรียบเนียน", desc3: "แก้ไขใน CAD ได้", image: "/cover/pla.png" },
        { name: "Color Scan", desc1: "สแกนพร้อมสี", desc2: "Texture สมจริง", desc3: "สำหรับงาน Display", image: "/cover/pla.png" }
      ]
    },
    process: {
      title: "ขั้นตอนบริการสแกน 3 มิติ",
      steps: [
        { step: 1, title: "ประเมินชิ้นงาน", desc: "ดูขนาดและความซับซ้อน" },
        { step: 2, title: "ฉีดสเปรย์ (ถ้าจำเป็น)", desc: "เพื่อลดการสะท้อนแสง" },
        { step: 3, title: "สแกนชิ้นงาน", desc: "เก็บ Point Cloud รอบด้าน" },
        { step: 4, title: "Processing", desc: "จัดเรียง Mesh ให้สมบูรณ์" }
      ]
    }
  },
  {
    slug: "sheet-metal",
    title: "Sheet Metal",
    subtitle: "Fabrication",
    description: "บริการตัด เลเซอร์ พับ เจาะ และเชื่อมประกอบโลหะแผ่น ด้วยเครื่องจักร CNC ความแม่นยำสูง",
    heroImage: "/cover/pla.png",
    themeColor: "blue",
    about: {
      title: "งาน Sheet Metal คืออะไร?",
      content: "งาน Sheet Metal Fabrication คือกระบวนการแปรสภาพโลหะแผ่นให้เป็นรูปทรงต่างๆ ตามแบบที่ต้องการ ผ่านการตัด (Laser Cutting), พับ (Bending), และเชื่อมประกอบ (Welding)",
      subContent: "นิยมใช้สำหรับทำตู้ไฟฟ้า (Enclosure), ชิ้นส่วนเครื่องจักร, โครงสร้างหุ่นยนต์, และงานสถาปัตยกรรมที่ต้องการความแข็งแรงคงทนของโลหะ",
      image: "/cover/cpverfdm.png",
      bullets: [
        { title: "ตัดเลเซอร์แม่นยำ", desc: "รอยตัดเรียบเนียน ไม่เกิดครีบ (Burr) ความคลาดเคลื่อนต่ำ" },
        { title: "พับ CNC Bending", desc: "พับมุมได้องศาเป๊ะตามแบบ CAD" },
        { title: "บริการพ่นสี/ชุบ", desc: "Powder Coating, ชุบซิงค์, อะโนไดซ์" }
      ]
    },
    materials: {
      title: "วัสดุที่รองรับ",
      items: [
        { name: "เหล็กขาว (SPCC)", desc1: "พับขึ้นรูปง่าย", desc2: "ทาสีติดดี", desc3: "ใช้ภายในอาคาร", image: "/cover/pla.png" },
        { name: "สแตนเลส (SUS304)", desc1: "ไม่เป็นสนิม", desc2: "แข็งแรงสูง", desc3: "งานอาหาร/การแพทย์", image: "/cover/pla.png" },
        { name: "อลูมิเนียม (AL5083)", desc1: "น้ำหนักเบา", desc2: "ระบายความร้อน", desc3: "ทำตู้ไฟฟ้าอิเล็กฯ", image: "/cover/pla.png" }
      ]
    },
    process: {
      title: "ขั้นตอนการผลิตโลหะแผ่น",
      steps: [
        { step: 1, title: "เตรียมไฟล์ 2D/3D", desc: "รับไฟล์ DXF, STEP" },
        { step: 2, title: "ตัดเลเซอร์ (Cutting)", desc: "ตัดแผ่นคลี่" },
        { step: 3, title: "พับขึ้นรูป (Bending)", desc: "พับตามองศาด้วย CNC" },
        { step: 4, title: "ประกอบและเคลือบ", desc: "เชื่อมและพ่นสีผง" }
      ]
    }
  },
  {
    slug: "post-process",
    title: "Post-Processing",
    subtitle: "& Finishing",
    description: "เพิ่มคุณภาพพื้นผิวชิ้นงาน 3D ด้วยบริการขัดเรียบ พ่นรองพื้น พ่นสี และชุบโลหะระดับ Premium",
    heroImage: "/cover/cpverfdm.png",
    themeColor: "pink",
    about: {
      title: "บริการ Post-Processing คืออะไร?",
      content: "โดยปกติชิ้นงาน 3D Print จะมีรอยชั้น (Layer Lines) ให้เห็นบนพื้นผิว บริการ Post-Processing คือกระบวนการที่นำชิ้นงานมาขัดแต่ง โป๊ว และพ่นสี เพื่อลบรอยเหล่านั้นออก",
      subContent: "คุณจะได้ชิ้นงานที่เรียบเนียน ดูเหมือนผลิตจากแม่พิมพ์พลาสติกอุตสาหกรรม (Injection Molding) เหมาะสำหรับงาน Presentation หรือตัวต้นแบบ (Mockup) ขั้นสุดท้าย",
      image: "/cover/pla.png",
      bullets: [
        { title: "ขัดเรียบ (Sanding)", desc: "ลบรอย Layer Lines จนเนียน" },
        { title: "พ่นสี (Painting)", desc: "ทำสีตามรหัส RAL หรือ Pantone" },
        { title: "ชุบโลหะ (Plating)", desc: "ชุบโครเมียม หรือทองเพื่อความหรูหรา" }
      ]
    },
    materials: {
      title: "บริการที่เรามี",
      items: [
        { name: "Primed (รองพื้น)", desc1: "พื้นผิวเนียน", desc2: "พ่นสีรองพื้นเทา", desc3: "พร้อมให้คุณทำสีต่อ", image: "/cover/pla.png" },
        { name: "Painted (พ่นสี)", desc1: "สีตาม Pantone", desc2: "เคลือบด้าน/เงา", desc3: "เสร็จสมบูรณ์", image: "/cover/pla.png" },
        { name: "Electroplating", desc1: "ชุบโลหะ", desc2: "ดูเป็นโลหะจริง", desc3: "ทนการกัดกร่อน", image: "/cover/pla.png" }
      ]
    },
    process: {
      title: "ขั้นตอนการทำสี",
      steps: [
        { step: 1, title: "ขัดหยาบ", desc: "กำจัด Support และรอย" },
        { step: 2, title: "โป๊วผิว", desc: "เติมเต็มรอยหลุม" },
        { step: 3, title: "พ่นรองพื้น", desc: "เช็คความเรียบ" },
        { step: 4, title: "ทำสีจริง", desc: "พ่นสีตามที่ลูกค้าระบุ" }
      ]
    }
  }
];

async function seedMore() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check and insert only if they don't exist
    for (const page of newPages) {
      const existing = await ServicePage.findOne({ slug: page.slug });
      if (!existing) {
        await ServicePage.create(page);
        console.log(`Seeded ${page.slug}`);
      } else {
        console.log(`${page.slug} already exists, skipping.`);
      }
    }
    console.log("All extra pages seeded successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

seedMore();
