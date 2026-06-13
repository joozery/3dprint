import mongoose from "mongoose";

const FooterLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },        // ชื่อที่แสดง
    url: { type: String, required: true },           // URL ปลายทาง
    category: {                                      // หมวดหมู่ใน footer
      type: String,
      enum: ["services", "materials", "resources", "company"],
      default: "company",
    },
    openInNewTab: { type: Boolean, default: true },  // เปิดในแท็บใหม่
    isActive: { type: Boolean, default: true },      // แสดง/ซ่อน
    order: { type: Number, default: 0 },             // ลำดับ
  },
  { timestamps: true }
);

export default mongoose.models.FooterLink ||
  mongoose.model("FooterLink", FooterLinkSchema);
