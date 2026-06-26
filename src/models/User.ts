import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
  isVerified: boolean;
  verificationStatus: "pending" | "verified";
  role: "admin" | "user";
  adminOTP?: string;
  adminOTPExpires?: Date;
  billing?: {
    type?: "individual" | "company";
    firstName?: string;
    lastName?: string;
    idCard?: string;
    companyName?: string;
    taxId?: string;
    contactName?: string;
    address?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    companyNameEng?: string;
    branchCode?: string;
    isVatRegistered?: boolean;
    industry?: string;
    officePhone?: string;
    website?: string;
    companySize?: string;
  };
  shippingAddresses?: {
    _id?: any;
    label?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    district?: string;
    subDistrict?: string;
    province?: string;
    zipCode?: string;
    isDefault?: boolean;
    isInternational?: boolean;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      // ไม่ required เพราะการ Login ด้วย Google/LINE จะไม่มีรหัสผ่าน
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      default: "credentials",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // สิทธิ์การยืนยันรหัสผ่านแอดมินด้วย OTP
    adminOTP: { type: String },
    adminOTPExpires: { type: Date },
    // ข้อมูลสำหรับออกใบเสนอราคา (บันทึกไว้)
    billing: {
      type:        { type: String, enum: ["individual", "company"] },
      firstName:   String,
      lastName:    String,
      idCard:      String,
      companyName: String,
      taxId:       String,
      contactName: String,
      address:     String,
      district:    String,
      province:    String,
      postalCode:  String,
      phone:       String,
      email:       String,
      companyNameEng: String,
      branchCode: String,
      isVatRegistered: { type: Boolean, default: false },
      industry: String,
      officePhone: String,
      website: String,
      companySize: String,
    },
    // ข้อมูลสำหรับจัดส่ง (บันทึกไว้)
    shippingAddresses: [{
      label: String, // e.g. Office, Home
      fullName: String,
      phone: String,
      address: String,
      district: String,
      subDistrict: String,
      province: String,
      zipCode: String,
      isDefault: { type: Boolean, default: false },
      isInternational: { type: Boolean, default: false }
    }],
  },
  { timestamps: true }
);

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
