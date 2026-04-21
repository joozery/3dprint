import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        quoteNumber: {
            type: String,
            unique: true,
        },
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
        internalStatus: {
            type: String,
            enum: ["pending", "contacted"],
            default: "pending",
        },
        internalComments: {
            type: String,
            default: "",
        },
        billing: {
            type: {
                type: String,
                enum: ["individual", "company"],
            },
            firstName:   { type: String },
            lastName:    { type: String },
            idCard:      { type: String },
            companyName: { type: String },
            taxId:       { type: String },
            contactName: { type: String },
            address:     { type: String },
            district:    { type: String },
            province:    { type: String },
            postalCode:  { type: String },
            phone:       { type: String },
            email:       { type: String },
            note:        { type: String },
        },
        shipping: {
            fullName: { type: String },
            phone: { type: String },
            address: { type: String },
            province: { type: String },
            zipCode: { type: String },
        },
    },
    { timestamps: true }
);

// Auto-generate quoteNumber
QuoteSchema.pre("validate", function (next: any) {
    if (!this.quoteNumber) {
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
        const randomStr = Math.floor(1000 + Math.random() * 9000); 
        this.quoteNumber = `QT-${dateStr}-${randomStr}`;
    }
    if (typeof next === 'function') {
        next();
    }
});

if (mongoose.models.Quote) {
    delete mongoose.models.Quote;
}
export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
