import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"PDM 3D Print" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "รหัสยืนยันการสมัครสมาชิก (OTP) - PDM",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg; color: #1a202c;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 28px; font-weight: 800; margin: 0;">PDM PRO</h1>
          <p style="color: #64748b; font-size: 14px;">Professional 3D Printing Platform</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; text-align: center;">
          <h2 style="font-size: 18px; color: #475569; margin-bottom: 10px;">รหัสยืนยันของคุณคือ</h2>
          <div style="font-size: 42px; font-weight: 900; letter-spacing: 15px; color: #2563eb; margin: 20px 0;">${otp}</div>
          <p style="color: #94a3b8; font-size: 12px;">รหัสนี้จะมีอายุการใช้งาน 10 นาที</p>
        </div>

        <div style="margin-top: 30px; line-height: 1.6; color: #475569; font-size: 14px;">
          <p>สวัสดีครับ,</p>
          <p>ขอบคุณที่สมัครสมาชิกกับ <strong>PDM</strong> กรุณาใช้รหัส OTP ด้านบนเพื่อยืนยันตัวตนและเริ่มต้นใช้งานระบบของเรา</p>
          <p style="color: #ef4444; font-size: 12px; margin-top: 20px;">*หากคุณไม่ได้ขอรหัสนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้</p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 10px;">
          &copy; ${new Date().getFullYear()} PrintMyDesign by Septillion Co., Ltd. All rights reserved.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: `"PDM 3D Print" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "ยินดีต้อนรับสู่ PDM - สมัครสมาชิกสำเร็จแล้ว!",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1a202c;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 28px; font-weight: 800; margin: 0;">PDM PRO</h1>
          <p style="color: #64748b; font-size: 14px;">สมัครสมาชิกสำเร็จแล้ว</p>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 30px; border-radius: 12px; text-align: center;">
          <h2 style="font-size: 22px; color: #0369a1; margin-bottom: 10px;">ขอบคุณที่ร่วมเป็นส่วนหนึ่งกับเรา!</h2>
          <p style="color: #0c4a6e; font-size: 16px;">คุณ ${name} สามารถเริ่มต้นใช้งานฟีเจอร์ทั้งหมดของ PDM ได้ทันที</p>
        </div>

        <div style="margin-top: 30px; line-height: 1.6; color: #475569; font-size: 14px;">
          <p>ตอนนี้บัญชีของคุณได้รับการยืนยันเรียบร้อยแล้ว คุณสามารถ:</p>
          <ul style="padding-left: 20px;">
            <li>อัปโหลดไฟล์ 3D เพื่อประเมินราคา</li>
            <li>เลือกวัสดุและสีที่ต้องการ</li>
            <li>ติดตามสถานะการพิมพ์ได้แบบ Real-time</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">เข้าสู่เว็บไซต์</a>
          </div>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 10px;">
          &copy; ${new Date().getFullYear()} PrintMyDesign by Septillion Co., Ltd. All rights reserved.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"PDM 3D Print" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "รหัสรีเซ็ตรหัสผ่าน (OTP) - PDM",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1a202c;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 28px; font-weight: 800; margin: 0;">PDM PRO</h1>
          <p style="color: #64748b; font-size: 14px;">Professional 3D Printing Platform</p>
        </div>
        
        <div style="background-color: #fff1f2; padding: 30px; border-radius: 12px; text-align: center; border: 1px solid #ffe4e6;">
          <h2 style="font-size: 18px; color: #be123c; margin-bottom: 10px;">รหัสรีเซ็ตรหัสผ่านของคุณคือ</h2>
          <div style="font-size: 42px; font-weight: 900; letter-spacing: 15px; color: #e11d48; margin: 20px 0;">${otp}</div>
          <p style="color: #f43f5e; font-size: 12px;">รหัสนี้จะมีอายุการใช้งาน 10 นาที</p>
        </div>

        <div style="margin-top: 30px; line-height: 1.6; color: #475569; font-size: 14px;">
          <p>สวัสดีครับ,</p>
          <p>เราได้รับการร้องขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ กรุณาใช้รหัส OTP ด้านบนเพื่อตั้งรหัสผ่านใหม่</p>
          <p style="color: #ef4444; font-size: 12px; margin-top: 20px;">*หากคุณไม่ได้ส่งคำขอนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้ รหัสผ่านของคุณจะยังคงปลอดภัย</p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 10px;">
          &copy; ${new Date().getFullYear()} PrintMyDesign by Septillion Co., Ltd. All rights reserved.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendAdminPromotionEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: `"PDM 3D Print" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎉 คุณได้รับสิทธิ์ผู้ดูแลระบบ - PDM Admin",
    html: `
      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;color:#1a202c;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#2563eb;font-size:28px;font-weight:800;margin:0;">PDM PRO</h1>
          <p style="color:#64748b;font-size:14px;">Professional 3D Printing Platform</p>
        </div>
        <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:30px;border-radius:12px;text-align:center;color:white;">
          <div style="font-size:48px;margin-bottom:10px;">🛡️</div>
          <h2 style="font-size:22px;font-weight:800;margin:0 0 8px;">ยินดีด้วย ${name}!</h2>
          <p style="font-size:15px;color:#bfdbfe;margin:0;">คุณได้รับสิทธิ์ผู้ดูแลระบบ PDM แล้ว</p>
        </div>
        <div style="margin-top:30px;line-height:1.8;color:#475569;font-size:14px;">
          <p>สวัสดีครับคุณ <strong>${name}</strong>,</p>
          <p>บัญชีของคุณได้รับการยกระดับสิทธิ์เป็น <strong style="color:#2563eb;">Admin</strong> เรียบร้อยแล้ว</p>
          <ul style="padding-left:20px;">
            <li>จัดการคำสั่งซื้อและใบเสนอราคา</li>
            <li>ดูข้อมูลสถิติระบบ</li>
            <li>จัดการบัญชีสมาชิก</li>
          </ul>
          <div style="text-align:center;margin-top:30px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/login" style="background-color:#2563eb;color:white;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">เข้าสู่ระบบ Admin</a>
          </div>
          <p style="color:#ef4444;font-size:12px;margin-top:20px;">* การเข้าสู่ระบบ Admin ต้องยืนยันผ่าน OTP ทางอีเมลทุกครั้ง</p>
        </div>
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:10px;">
          &copy; ${new Date().getFullYear()} PrintMyDesign by Septillion Co., Ltd. All rights reserved.
        </div>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};
