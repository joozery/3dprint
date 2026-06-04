import mongoose from "mongoose";

const PostProcessingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  costPrice: { type: Number, default: 0 },
  sellPrice: { type: Number, default: 0 },
});

const MaterialConfigSchema = new mongoose.Schema({
  technology: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  tdsLink: { type: String }, 
  sdsLink: { type: String }, 
  maxPrintSize: {
    width: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  pricing: {
    costPerGram: { type: Number, default: 0, required: true },
    sellPerGram: { type: Number, default: 0, required: true },
    costPerMinute: { type: Number, default: 0, required: true },
    sellPerMinute: { type: Number, default: 0, required: true },
  },
  colors: [{ type: String }],
  colorOptions: [{
    name: { type: String, required: true },
    hex: { type: String, required: true }
  }],
  postProcessing: [PostProcessingSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

if (mongoose.models.MaterialConfig) {
  delete mongoose.models.MaterialConfig;
}

export default mongoose.models.MaterialConfig || mongoose.model("MaterialConfig", MaterialConfigSchema);
