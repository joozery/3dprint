import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        quotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quote",
            required: true,
        }],
        shippingAddress: {
            fullName:    { type: String, required: true },
            phone:       { type: String, required: true },
            address:     { type: String, required: true },
            district:    { type: String },
            subDistrict: { type: String },
            province:    { type: String },
            zipCode:     { type: String },
            city:        { type: String },
            countryCode: { type: String, default: "TH" },
        },
        paymentDetails: {
            method: { type: String, enum: ["bank_transfer", "promptpay", "credit_card", "paysolutions"], required: true },
            status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
            slipUrl: { type: String },
            transactionId: { type: String },
        },
        billingType: { type: String, enum: ["individual", "company"], default: "individual" },
        pricing: {
            subtotal:    { type: Number, required: true },
            vat:         { type: Number, default: 0 },
            shippingFee: { type: Number, required: true, default: 0 },
            discount:    { type: Number, default: 0 },
            wht:         { type: Number, default: 0 },
            totalAmount: { type: Number, required: true },
            netPayable:  { type: Number, required: true },
        },
        status: {
            type: String,
            enum: ["pending_payment", "processing", "printing", "shipped", "delivered", "cancelled"],
            default: "pending_payment",
        },
        customerNotes: {
            type: String,
        },
        trackingNumber: {
            type: String,
        },
        ishipOrderId: {
            type: String,
        },
        ishipRef: {
            type: String,
        },
        ishipCourierCode: {
            type: String,
        },
        // FedEx
        shippingProvider: {
            type: String,
            enum: ["iship", "fedex", "dhl"],
        },
        fedexServiceType: {
            type: String,
        },
        fedexLabelUrl: {
            type: String,
        },
        // DHL Express
        dhlProductCode: {
            type: String,
        },
        dhlLabelBase64: {
            type: String,
        },
    },
    { timestamps: true }
);

OrderSchema.index({ status: 1 });
OrderSchema.index({ "paymentDetails.status": 1, createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });

// auto-increment หรือรหัส Orders รันออโต้
OrderSchema.pre("validate", function (next: any) {
    if (!this.orderNumber) {
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
        const randomStr = Math.floor(1000 + Math.random() * 9000); 
        this.orderNumber = `ORD-${dateStr}-${randomStr}`;
    }
    if (typeof next === 'function') {
        next();
    }
});

export default (mongoose.models.Order as mongoose.Model<any>) || mongoose.model("Order", OrderSchema);
