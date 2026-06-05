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
            province:    { type: String, required: true },
            zipCode:     { type: String, required: true },
        },
        paymentDetails: {
            method: { type: String, enum: ["bank_transfer", "promptpay", "credit_card", "paysolutions"], required: true },
            status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
            slipUrl: { type: String },
            transactionId: { type: String },
        },
        pricing: {
            subtotal: { type: Number, required: true },
            shippingFee: { type: Number, required: true, default: 0 },
            discount: { type: Number, default: 0 },
            totalAmount: { type: Number, required: true },
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
            enum: ["iship", "fedex"],
        },
        fedexServiceType: {
            type: String,
        },
        fedexLabelUrl: {
            type: String,
        },
    },
    { timestamps: true }
);

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

// แก้ปัญหา Next.js แคช Mongoose Model ในโหมด Dev
if (mongoose.models.Order) {
    delete mongoose.models.Order;
}

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
