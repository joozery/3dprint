import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  isActive: boolean;
  source: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
    source:   { type: String, default: "footer" },
  },
  { timestamps: true }
);

export default mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
