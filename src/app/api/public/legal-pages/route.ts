import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LegalPages from "@/models/LegalPages";

const defaultPrivacy = {
  lastUpdated: "มีนาคม 2026",
  sections: [
    { title: "1. ข้อมูลที่เรารวบรวม", content: "ผู้ให้บริการ PDM PRO (\"บริษัท\") จะทำการรวบรวมข้อมูลส่วนบุคคลของคุณ เช่น ชื่อ, ที่อยู่อีเมล, ข้อมูลการติดต่อส่วนบุคคล รวมถึง ข้อมูลโมเดล 3 มิติ (ไฟล์ .STL, .OBJ, .STEP) ที่ถูกอัปโหลดขึ้นบนเซิร์ฟเวอร์เพื่อให้ประเมินราคาและดำเนินการจัดพิมพ์" },
    { title: "2. การรักษาความปลอดภัยของไฟล์ 3D (Intellectual Property)", content: "เราให้ความสำคัญอย่างยิ่งต่อทรัพย์สินทางปัญญาของคุณ ไฟล์โมเดลทุกชิ้นจะถูกเข้ารหัสระดับองค์กร จะไม่มีการนำไฟล์ไปเผยแพร่, ขายต่อ, หรือดัดแปลงโดยไม่ได้รับอนุญาตอย่างเด็ดขาด" },
    { title: "3. การเปิดเผยข้อมูลให้กับบุคคลที่สาม", content: "บริษัท ขอยืนยันว่าจะไม่มีการขายหรือส่งต่อข้อมูลส่วนบุคคลและข้อมูลโมเดลของคุณให้กับองค์กรที่สาม" },
    { title: "4. สิทธิในการควบคุมข้อมูล", content: "ผู้ใช้สามารถลบ แก้ไข หรืออัปเดตข้อมูลได้ทุกเมื่อในเมนู 'ตั้งค่าบัญชี'" },
  ],
};

const defaultTerms = {
  lastUpdated: "มีนาคม 2026",
  sections: [
    { title: "1. ข้อตกลงทั่วไป", content: "การเข้าถึงและการใช้งานแพลตฟอร์ม PDM PRO ผู้ใช้จะต้องยอมรับข้อตกลงในการจัดการทางกฎหมายทั้งหมดของแพลตฟอร์มนี้" },
    { title: "2. ข้อจำกัดเกี่ยวกับสิทธิในทรัพย์สินและการผลิต", content: "บริษัทจะไม่รับผิดชอบตามกฎหมายหากไฟล์ 3D ที่ท่านส่งมาละเมิดลิขสิทธิ์หรือทรัพย์สินทางปัญญาของบุคคลอื่น" },
    { title: "3. คุณภาพและการชดเชย", content: "หากผลิตภัณฑ์ที่ออกมาไม่เป็นไปตามความแม่นยำทางวิศวกรรมที่กำหนด กรุณาติดต่อวิศวกรของเราภายใน 7 วันทำการ" },
    { title: "4. การชำระเงินและภาษี", content: "ราคาทั้งหมดปรากฏบนระบบได้คำนวณภาษีมูลค่าเพิ่มเบื้องต้นแล้ว" },
  ],
};

const defaultCookies = {
  lastUpdated: "มีนาคม 2026",
  sections: [
    { title: "1. คุกกี้คืออะไร?", content: "ทาง PDM PRO นำคุกกี้ (Cookies) มาใช้เพื่อให้ระบบจดจำสถานะการล็อกอิน และมอบประสบการณ์ที่ราบรื่นให้กับผู้ใช้งาน" },
    { title: "2. คุกกี้ที่จำเป็นต่อการทำงาน (Strictly Necessary Cookies)", content: "คุกกี้กลุ่มนี้มีความจำเป็นอย่างยิ่งเพื่อให้ระบบประเมินราคาและ 3D Viewer ทำงานได้เป็นปกติ" },
    { title: "3. คุกกี้เพื่อการวิเคราะห์ (Analytical Cookies)", content: "ช่วยให้เราวัดผลการทำงานและพัฒนาบริการให้ตรงเป้าหมายมากขึ้น (ไม่บังคับในการใช้งาน)" },
    { title: "4. การจัดการคุกกี้", content: "คุณสามารถตั้งค่าเบราว์เซอร์เพื่อบล็อกคุกกี้ที่ไม่จำเป็นได้" },
  ],
};

export async function GET() {
  try {
    await dbConnect();
    const doc = await LegalPages.findOne().lean() as any;

    return NextResponse.json({
      privacy: doc?.privacy?.sections?.length ? doc.privacy : defaultPrivacy,
      terms: doc?.terms?.sections?.length ? doc.terms : defaultTerms,
      cookies: doc?.cookies?.sections?.length ? doc.cookies : defaultCookies,
    });
  } catch {
    return NextResponse.json({
      privacy: defaultPrivacy,
      terms: defaultTerms,
      cookies: defaultCookies,
    });
  }
}
