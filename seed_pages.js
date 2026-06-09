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

const pages = [
  {
    slug: "fdm",
    title: "FDM",
    subtitle: "Printing",
    description: "Fused Deposition Modeling — เทคโนโลยีพิมพ์ 3D ยอดนิยม ที่มีความแม่นยำ แข็งแรง และคุ้มค่า เหมาะกับงานต้นแบบและชิ้นส่วนใช้งานจริง",
    heroImage: "/cover/cpverfdm.png",
    themeColor: "blue",
    about: {
      title: "Fused Deposition Modeling คืออะไร?",
      content: "FDM (Fused Deposition Modeling) หรือที่รู้จักกันในชื่อ FFF (Fused Filament Fabrication) เป็นเทคโนโลยีการพิมพ์ 3D ที่ได้รับความนิยมมากที่สุดในโลก โดยทำงานด้วยการหลอมเส้นพลาสติก (Filament) แล้วพ่นออกมาทีละชั้น จนกลายเป็นชิ้นงาน 3 มิติตามแบบที่ต้องการ",
      subContent: "ด้วยต้นทุนที่ต่ำ ความยืดหยุ่นสูง และรองรับวัสดุหลากหลายชนิด ทำให้ FDM เหมาะกับทั้งงานต้นแบบ (Prototype), ชิ้นส่วนวิศวกรรม, ไปจนถึงงานศิลปะและของตกแต่ง",
      image: "/cover/cpverfdm.png",
      bullets: [
        { title: "หลักการทำงาน", desc: "หลอมเส้น Filament ผ่านหัวพ่น (Nozzle) และวางทับซ้อนกันเป็นชั้นๆ จนได้ชิ้นงาน" },
        { title: "วัสดุที่ใช้", desc: "รองรับ PLA, ABS, PETG, TPU, Nylon, PC และวัสดุวิศวกรรมอื่นๆ มากกว่า 10 ชนิด" },
        { title: "ขนาดชิ้นงาน", desc: "พิมพ์ได้สูงสุด 300 × 300 × 400 มม. ต่อชิ้น ไม่ต้องต่อหรือประกอบ" }
      ]
    },
    materials: {
      title: "วัสดุที่รองรับ",
      items: [
        { name: "PLA", desc1: "พิมพ์ง่าย", desc2: "ผิวสวย", desc3: "เป็นมิตรต่อสิ่งแวดล้อม", image: "/cover/pla.png" },
        { name: "ABS", desc1: "แข็งแรงทนทาน", desc2: "ทนความร้อน", desc3: "เหมาะกับงานวิศวกรรม", image: "/cover/pla.png" },
        { name: "PETG", desc1: "เหนียว แข็งแรง", desc2: "ทนสารเคมี", desc3: "ปลอดภัย", image: "/cover/pla.png" },
        { name: "TPU", desc1: "ยืดหยุ่นสูง", desc2: "ทนการเสียดสี", desc3: "รองรับแรงกระแทก", image: "/cover/pla.png" },
        { name: "วัสดุอื่นๆ", desc1: "ASA, PC, Nylon", desc2: "Carbon Fiber", desc3: "และอื่นๆ", image: "/cover/pla.png" }
      ]
    },
    process: {
      title: "ขั้นตอนการสั่งพิมพ์",
      steps: [
        { step: 1, title: "อัปโหลดไฟล์", desc: "ส่งไฟล์ STL / 3MF ของคุณ" },
        { step: 2, title: "ประเมินราคา", desc: "ระบบประเมินราคาอัตโนมัติใน 1 นาที" },
        { step: 3, title: "ยืนยันการสั่งซื้อ", desc: "ชำระเงินและยืนยันการผลิต" },
        { step: 4, title: "ผลิตชิ้นงาน", desc: "ทีมงานผลิตด้วยเครื่องคุณภาพสูง" },
        { step: 5, title: "ตรวจสอบคุณภาพ", desc: "ตรวจสอบคุณภาพทุกชิ้นก่อนจัดส่ง" },
        { step: 6, title: "จัดส่งถึงมือคุณ", desc: "แพ็คของอย่างดี จัดส่งถึงปลายทาง" }
      ]
    }
  },
  {
    slug: "sla",
    title: "SLA",
    subtitle: "Resin",
    description: "Stereolithography — เรซิ่นเหลวแข็งตัวด้วยแสง UV ให้ความละเอียดสูงที่สุดและพื้นผิวเนียนเรียบในระดับไมครอน เหมาะกับงานที่ต้องการความแม่นยำสูง",
    heroImage: "/cover/pla.png",
    themeColor: "purple",
    about: {
      title: "SLA Resin Printing คืออะไร?",
      content: "SLA (Stereolithography) เป็นเทคโนโลยีการพิมพ์ 3D ที่ใช้แสงเลเซอร์ UV ฉายลงบนน้ำเรซิ่นเพื่อให้เกิดการแข็งตัวทีละชั้น (Layer) ซึ่งมีความแม่นยำสูงมาก ทำให้ได้ชิ้นงานที่มีรายละเอียดคมชัดและพื้นผิวที่เนียนเรียบ",
      subContent: "เหมาะสำหรับงานที่ต้องการรายละเอียดสูง เช่น งานเครื่องประดับ (Jewelry), งานทันตกรรม, ฟิกเกอร์โมเดล (Miniatures), และชิ้นส่วนวิศวกรรมที่ต้องการความแม่นยำระดับไมครอน",
      image: "/cover/cpverfdm.png",
      bullets: [
        { title: "ความละเอียดสูง", desc: "ความละเอียดระดับ 25 – 100 ไมครอน เก็บทุกรายละเอียดได้คมชัด" },
        { title: "พื้นผิวเรียบเนียน", desc: "แทบไม่เห็นรอยชั้น (Layer lines) ลดระยะเวลาในการขัดแต่งผิว (Post-processing)" },
        { title: "วัสดุหลากหลาย", desc: "มีให้เลือกตั้งแต่ Standard, Tough, Clear, ไปจนถึง Castable Resin สำหรับหล่อ" }
      ]
    },
    materials: {
      title: "เรซิ่นที่รองรับ",
      items: [
        { name: "Standard", desc1: "พื้นผิวเนียน", desc2: "รายละเอียดสูง", desc3: "สำหรับงานทั่วไป", image: "/cover/pla.png" },
        { name: "Tough", desc1: "แข็งแรงทนทาน", desc2: "ทนแรงกระแทก", desc3: "คล้าย ABS", image: "/cover/pla.png" },
        { name: "Clear", desc1: "โปร่งใส", desc2: "สวยงาม", desc3: "งานท่อ/แสง", image: "/cover/pla.png" },
        { name: "Castable", desc1: "เผาไหม้หมดจด", desc2: "ไม่มีเถ้า", desc3: "สำหรับงานหล่อ", image: "/cover/pla.png" },
        { name: "Flexible", desc1: "ยืดหยุ่น", desc2: "คล้ายยาง", desc3: "ทนการบิดงอ", image: "/cover/pla.png" }
      ]
    },
    process: {
      title: "ขั้นตอนการสั่งพิมพ์",
      steps: [
        { step: 1, title: "อัปโหลดไฟล์", desc: "ส่งไฟล์ STL / 3MF ของคุณ" },
        { step: 2, title: "ประเมินราคา", desc: "ระบบประเมินราคาอัตโนมัติใน 1 นาที" },
        { step: 3, title: "ยืนยันการสั่งซื้อ", desc: "ชำระเงินและยืนยันการผลิต" },
        { step: 4, title: "ผลิตชิ้นงาน", desc: "พิมพ์และล้างเรซิ่นส่วนเกิน" },
        { step: 5, title: "อบแสง UV", desc: "อบเพื่อความแข็งแรงเต็มที่" },
        { step: 6, title: "จัดส่งถึงมือคุณ", desc: "แพ็คของอย่างดี จัดส่งถึงปลายทาง" }
      ]
    }
  },
  {
    slug: "multicolor",
    title: "Multi-color",
    subtitle: "Printing",
    description: "เทคโนโลยีพิมพ์ 3D แบบหลายสีในชิ้นเดียว (Multi-color) สร้างสรรค์ชิ้นงานที่มีสีสันสมจริงโดยไม่ต้องทำสีเพิ่ม จบในขั้นตอนเดียว",
    heroImage: "/cover/pla.png",
    themeColor: "pink",
    about: {
      title: "Multi-color 3D Printing คืออะไร?",
      content: "Multi-color 3D Printing คือระบบการพิมพ์ที่สามารถสลับสีเส้นพลาสติก (Filament) ได้อัตโนมัติในระหว่างการพิมพ์ ทำให้ชิ้นงานที่ออกมามีหลายสีในตัวเอง โดยไม่ต้องผ่านกระบวนการทาสีหรือพ่นสีเพิ่มเติม",
      subContent: "เหมาะอย่างยิ่งสำหรับงานอาร์ตทอย (Art Toys), โมเดลสถาปัตยกรรม, แผนที่ภูมิประเทศ 3 มิติ, ป้ายโลโก้บริษัท, หรือสื่อการสอนที่ต้องการการแยกสีให้เห็นชัดเจน",
      image: "/cover/cpverfdm.png",
      bullets: [
        { title: "พิมพ์หลายสีในชิ้นเดียว", desc: "สามารถผสมสีได้ถึง 4-8 สีในชิ้นงานเดียวกัน ทำให้งานดูมีชีวิตชีวา" },
        { title: "ลดเวลาการทำสี (No Painting)", desc: "สีที่ได้ฝังอยู่ในเนื้อวัสดุโดยตรง สีไม่ลอก ไม่ซีดจาง และพร้อมใช้งานทันที" },
        { title: "ชิ้นงานแข็งแรงไร้รอยต่อ", desc: "ต่างจากการพิมพ์แยกชิ้นแล้วนำมาประกอบ ชิ้นงานพิมพ์สีรวมกันจะมีความแข็งแรงเป็นเนื้อเดียวกัน" }
      ]
    },
    materials: {
      title: "วัสดุที่รองรับงานแบบสี",
      items: [
        { name: "PLA Multi-color", desc1: "พิมพ์ง่าย สีสวย", desc2: "ผิวเนียนกริบ", desc3: "มีเฉดสีให้เลือกมากที่สุด", image: "/cover/pla.png" },
        { name: "PETG Multi-color", desc1: "แข็งแรงทนทาน", desc2: "ทนความร้อน", desc3: "ทนแสงแดดได้ดีกว่า", image: "/cover/pla.png" },
        { name: "Silk / Shiny", desc1: "พื้นผิวเงางาม", desc2: "สะท้อนแสงคล้ายโลหะ", desc3: "เหมาะกับของตกแต่ง", image: "/cover/pla.png" }
      ]
    },
    process: {
      title: "ขั้นตอนการสั่งพิมพ์",
      steps: [
        { step: 1, title: "เตรียมไฟล์ 3MF", desc: "แยก Part ไฟล์ตามสีที่ต้องการ" },
        { step: 2, title: "ประเมินราคา", desc: "เช็คราคางานพิมพ์หลากสีทันที" },
        { step: 3, title: "เลือกสีเส้นวัสดุ", desc: "กำหนดสีสำหรับแต่ละ Part" },
        { step: 4, title: "ผลิตชิ้นงาน", desc: "เครื่องพิมพ์สลับสีอัตโนมัติ" },
        { step: 5, title: "ตรวจสอบคุณภาพ", desc: "เช็คความถูกต้องของสีและผิว" },
        { step: 6, title: "จัดส่งถึงมือคุณ", desc: "แพ็คของอย่างดี จัดส่งถึงปลายทาง" }
      ]
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await ServicePage.deleteMany({});
    await ServicePage.insertMany(pages);
    console.log("Seeded successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
