import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    content: { type: String },
    linkUrl: { type: String },
    type: { type: String, enum: ["guide", "blog"], required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);
