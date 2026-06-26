import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    label:    { type: String, required: true },
    subLabel: { type: String, default: "" },
    value:    { type: Number, min: 0, max: 5, default: 3 },
}, { _id: false });

const MaterialPageContentSchema = new mongoose.Schema(
    {
        slug:        { type: String, required: true, unique: true }, // pla, abs, petg, ...
        name:        { type: String, required: true },               // PLA
        fullName:    { type: String, default: "" },                  // Polylactic Acid
        shortDesc:   { type: String, default: "" },
        features:    [{ type: String }],
        properties:  [PropertySchema],
        nozzleTemp:  { type: String, default: "" },
        bedTemp:     { type: String, default: "" },
        cooling:     { type: String, default: "" },
        iconName:    { type: String, default: "Box" },               // Lucide icon name
        iconColor:   { type: String, default: "text-slate-500" },    // Tailwind class
        iconBg:      { type: String, default: "bg-slate-50" },
        coverImage:  { type: String, default: "" },                  // รูปหลัก material card
        thumbnails:  [{ type: String }],                             // gallery รูป (สูงสุด 4)
        detailUrl:   { type: String, default: "" },                  // /materials/pla
        badge:       { type: String, default: "" },                  // "ยอดนิยม"
        isActive:    { type: Boolean, default: true },
        order:       { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default (mongoose.models.MaterialPageContent as mongoose.Model<any>) ||
    mongoose.model("MaterialPageContent", MaterialPageContentSchema);
