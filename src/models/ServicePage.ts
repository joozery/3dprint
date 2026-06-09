import mongoose from "mongoose";

const servicePageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g., fdm, sla, multicolor
  title: { type: String, required: true }, // e.g., "FDM", "SLA", "Multi-color"
  subtitle: { type: String, required: true }, // e.g., "Printing", "Resin", "Printing"
  description: { type: String, required: true },
  heroImage: { type: String, required: true },
  themeColor: { type: String, required: true }, // "blue", "purple", "pink"
  
  // Section 1: About the tech
  about: {
    title: { type: String, required: true }, // e.g., "Fused Deposition Modeling คืออะไร?"
    content: { type: String, required: true },
    subContent: { type: String, required: true },
    image: { type: String, required: true },
    bullets: [{
      title: { type: String, required: true },
      desc: { type: String, required: true }
    }]
  },

  // Section 2: Supported Materials
  materials: {
    title: { type: String, required: true }, // e.g., "วัสดุที่รองรับ"
    items: [{
      name: { type: String, required: true },
      desc1: { type: String, required: true },
      desc2: { type: String, required: true },
      desc3: { type: String, required: true },
      image: { type: String, required: true }
    }]
  },

  // Section 3: Process Steps
  process: {
    title: { type: String, required: true }, // e.g., "ขั้นตอนการสั่งพิมพ์"
    steps: [{
      step: { type: Number, required: true },
      title: { type: String, required: true },
      desc: { type: String, required: true }
    }]
  },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.ServicePage || mongoose.model("ServicePage", servicePageSchema);
