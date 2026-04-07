import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"PDM 3D Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `รหัสตรวจสอบสิทธิ์ (OTP) สำหรับผู้ดูแลระบบ: ${otp}`,
    html: `
      <div style="font-family: sans-serif; background-color: #f8faff; padding: 40px; border-radius: 16px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">ยืนยันตัวตนแอดมิน</h1>
            <p style="color: #64748b; margin-top: 8px; font-size: 14px;">กรุณาใช้รหัส OTP ด้านล่างเพื่อเข้าสู่ระบบ PDM 3D</p>
          </div>
          
          <div style="background-color: #eff6ff; border: 1px solid #dbeafe; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
            <div style="font-size: 40px; font-weight: 900; color: #2563eb; letter-spacing: 0.1em; font-family: monospace;">${otp}</div>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
            รหัสนี้จะหมดอายุภายใน 5 นาที<br />
            หากคุณไม่ได้พยายามเข้าสู่ระบบ โปรดเพิกเฉยต่ออีเมลนี้
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
