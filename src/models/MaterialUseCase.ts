import mongoose from "mongoose";

const MaterialUseCaseSchema = new mongoose.Schema(
    {
        title:     { type: String, required: true },   // Home Decor
        desc:      { type: String, default: "" },      // ของตกแต่งบ้าน
        image:     { type: String, default: "" },      // URL รูป (R2 หรือ /asset/...)
        materials: [{ type: String }],                 // slug วัสดุที่จะแสดง (ว่าง = แสดงทุกวัสดุ)
        isActive:  { type: Boolean, default: true },
        order:     { type: Number, default: 0 },
    },
    { timestamps: true }
);

if (mongoose.models.MaterialUseCase) {
    delete mongoose.models.MaterialUseCase;
}
export default mongoose.model("MaterialUseCase", MaterialUseCaseSchema);
