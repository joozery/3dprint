import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
});

if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}
export default mongoose.model("SiteSettings", SiteSettingsSchema);
