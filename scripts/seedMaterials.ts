import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import dbConnect from "../src/lib/mongoose";

// Since we are running outside Next.js proper, we need to redefine the schema or import it if the environment allows
// Actually, it's safer to just define standard Mongoose models here to avoid Next.js specific deps crashing
const PostProcessingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  costPrice: { type: Number, default: 0 },
  sellPrice: { type: Number, default: 0 },
});

const MaterialConfigSchema = new mongoose.Schema({
  technology: String,
  name: String,
  description: String,
  tdsLink: String,
  sdsLink: String,
  maxPrintSize: { width: Number, length: Number, height: Number },
  pricing: { costPerGram: Number, sellPerGram: Number, costPerMinute: Number, sellPerMinute: Number },
  colors: [String],
  postProcessing: [PostProcessingSchema],
  isActive: Boolean,
});

const MaterialConfig = mongoose.models.MaterialConfig || mongoose.model("MaterialConfig", MaterialConfigSchema);

async function seed() {
  await dbConnect();

  const mockData = [
    {
      technology: "SLA",
      name: "9600 Resin",
      description: "เรซินคุณภาพสูง ทนทาน ผิวเนียนละเอียด เหมาะสำหรับงานที่ต้องการความแม่นยำสูง หรือ ทำ Mockup สินค้า",
      tdsLink: "https://example.com/tds/9600",
      sdsLink: "https://example.com/sds/9600",
      maxPrintSize: { width: 300, length: 300, height: 400 },
      pricing: { costPerGram: 2, sellPerGram: 10, costPerMinute: 0.5, sellPerMinute: 2 },
      colors: ["ขาวด้าน (Matte White)", "ดำด้าน (Matte Black)"],
      postProcessing: [
        { name: "ขัดละเอียด (Fine Sanding)", costPrice: 50, sellPrice: 150 },
        { name: "พ่นสีรองพื้น (Prime Coating)", costPrice: 100, sellPrice: 300 }
      ],
      isActive: true
    },
    {
      technology: "SLA",
      name: "8200 Clear Resin",
      description: "เรซินใส โปร่งแสง เหมาะสำหรับทำชิ้นงานที่ต้องการมองเห็นภายใน หรือ โมเดลการแพทย์",
      tdsLink: "https://example.com/tds/8200",
      sdsLink: "https://example.com/sds/8200",
      maxPrintSize: { width: 300, length: 300, height: 400 },
      pricing: { costPerGram: 3, sellPerGram: 15, costPerMinute: 0.5, sellPerMinute: 2 },
      colors: ["ใส (Clear)", "ใสขุ่น (Frosted)"],
      postProcessing: [
        { name: "ขัดใส (Clear Polishing)", costPrice: 200, sellPrice: 500 }
      ],
      isActive: true
    },
    {
      technology: "SLS",
      name: "PA12 Nylon",
      description: "ไนลอนผงอบด้วยเลเซอร์ มีความแข็งแรงทนทานสูงมาก ทนความร้อน ยืดหยุ่นได้เล็กน้อย เหมาะสำหรับชิ้นส่วนวิศวกรรม",
      tdsLink: "https://example.com/tds/pa12",
      sdsLink: "",
      maxPrintSize: { width: 400, length: 400, height: 450 },
      pricing: { costPerGram: 5, sellPerGram: 25, costPerMinute: 1.0, sellPerMinute: 4.5 },
      colors: ["เทาเข้ม (Dark Grey)", "ดำ (Black)"],
      postProcessing: [
        { name: "พ่นไอน้ำยาสมูธ (Vapor Smooth)", costPrice: 300, sellPrice: 800 }
      ],
      isActive: true
    },
    {
      technology: "FDM",
      name: "PLA+",
      description: "พลาสติกทั่วไป พิมพ์ง่าย ราคาประหยัด เหมาะสำหรับชิ้นงานเบื้องต้นที่ไม่ได้รับแรงกระแทกหรือทนความร้อนสูง",
      tdsLink: "",
      sdsLink: "",
      maxPrintSize: { width: 250, length: 250, height: 250 },
      pricing: { costPerGram: 0.5, sellPerGram: 3, costPerMinute: 0.1, sellPerMinute: 0.5 },
      colors: ["ขาว", "ดำ", "แดง", "น้ำเงิน"],
      postProcessing: [],
      isActive: true
    }
  ];

  try {
    for (const data of mockData) {
      await MaterialConfig.create(data);
      console.log(`Created material: ${data.name}`);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    process.exit(0);
  }
}

seed();
