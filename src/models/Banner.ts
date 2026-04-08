import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "youtube", "video"], default: "image" },
    src: { type: String, required: true },
    overlay: { type: String, default: "from-slate-900/70 via-slate-900/40 to-transparent" },
    badge: { type: String },
    title: { type: String, required: true },
    titleHighlight: { type: String },
    titleEnd: { type: String },
    bullets: { type: [String], default: [] },
    cta: {
      label: { type: String },
      href: { type: String },
    },
    cta2: {
      label: { type: String },
      href: { type: String },
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
