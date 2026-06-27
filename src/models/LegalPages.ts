import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
}, { _id: false });

const PageContentSchema = new mongoose.Schema({
  lastUpdated: { type: String, default: "" },
  sections: { type: [SectionSchema], default: [] },
}, { _id: false });

const LegalPagesSchema = new mongoose.Schema({
  privacy: { type: PageContentSchema, default: {} },
  terms: { type: PageContentSchema, default: {} },
  cookies: { type: PageContentSchema, default: {} },
}, { timestamps: true });

export default mongoose.models.LegalPages || mongoose.model("LegalPages", LegalPagesSchema);
