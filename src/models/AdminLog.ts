import mongoose from "mongoose";

const AdminLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    targetId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.AdminLog || mongoose.model("AdminLog", AdminLogSchema);
