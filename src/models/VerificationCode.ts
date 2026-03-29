import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationCode extends Document {
  email: string;
  code: string;
  expires: Date;
}

const VerificationCodeSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true,
    expires: 600 // Automatically delete after 10 minutes
  }
}, { timestamps: true });

export default mongoose.models.VerificationCode || mongoose.model<IVerificationCode>("VerificationCode", VerificationCodeSchema);
