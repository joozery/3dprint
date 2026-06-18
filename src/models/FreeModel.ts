import mongoose from "mongoose";

const FreeModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  fileUrl: { type: String },
  fileFormat: { type: String, default: "STL" },
  fileSize: { type: String },
  category: {
    type: String,
    enum: ["functional", "decorative", "art", "toys", "other"],
    default: "other",
  },
  tags: { type: [String], default: [] },
  downloads: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.FreeModel || mongoose.model("FreeModel", FreeModelSchema);
