import mongoose from "mongoose";

const SupportSettingsSchema = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  lineId: { type: String },
  lineUrl: { type: String },
  address: { type: String },
  businessHours: { type: String, default: "จันทร์ - เสาร์ 9:00 - 18:00 น." },
  chatEnabled: { type: Boolean, default: true },
  facebookUrl: { type: String },
  instagramUrl: { type: String },
});

if (mongoose.models.SupportSettings) {
  delete mongoose.models.SupportSettings;
}
export default mongoose.model("SupportSettings", SupportSettingsSchema);
