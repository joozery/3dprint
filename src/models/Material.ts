import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "เรซิ่น 9600"
    systemId: { type: String, required: true, unique: true }, // e.g. "9600"
    technology: { type: String, required: true }, // e.g. "sla"
    color: { type: String, default: "ขาวด้าน (Matte White)" }, // Default color display
    density: { type: Number, default: 1.15 }, // g/cm3
    pricePerGram: { type: Number, required: true, default: 5 }, // Price multiplier
    setupFee: { type: Number, default: 0 }, // Optional Setup Fee per item
    badge: { type: String, default: "" }, // e.g. "ยอดนิยม"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Material || mongoose.model("Material", MaterialSchema);
