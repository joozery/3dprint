import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
        },
        cloudinaryId: {
            type: String,
        },
        technology: {
            type: String,
            required: true,
            default: "sla",
        },
        material: {
            type: String,
            required: true,
            default: "9600",
        },
        color: {
            type: String,
            default: "Matte White",
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        volumeCm3: {
            type: Number,
            default: 0,
        },
        printTime: {
            type: String,
            default: "N/A",
        },
        weightGrams: {
            type: Number,
            default: 0,
        },
        dimensions: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            z: { type: Number, default: 0 },
        },
        priceDetail: {
            pricePerUnit: { type: Number, default: 0 },
            totalPrice: { type: Number, default: 0 },
            setupFee: { type: Number, default: 0 },
        },
        status: {
            type: String,
            enum: ["pending", "ordered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
