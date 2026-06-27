import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import LegalPages from "@/models/LegalPages";
import User from "@/models/User";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) return null;
  await dbConnect();
  const user = await User.findById((session?.user as any).id).lean();
  return (user as any)?.role === "admin" ? user : null;
}

const defaultPrivacy = {
  lastUpdated: "มีนาคม 2026",
  sections: [
    { title: "1. ข้อมูลที่เรารวบรวม", content: "ผู้ให้บริการ PDM PRO (\"บริษัท\") จะทำการรวบรวมข้อมูลส่วนบุคคลของคุณ เช่น ชื่อ, ที่อยู่อีเมล, ข้อมูลการติดต่อส่วนบุคคล รวมถึง ข้อมูลโมเดล 3 มิติ (ไฟล์ .STL, .OBJ, .STEP) ที่ถูกอัปโหลดขึ้นบนเซิร์ฟเวอร์เพื่อให้ประเมินราคาและดำเนินการจัดพิมพ์" },
    { title: "2. การรักษาความปลอดภัยของไฟล์ 3D (Intellectual Property)", content: "เราให้ความสำคัญอย่างยิ่งต่อทรัพย์สินทางปัญญาของคุณ ไฟล์โมเดลทุกชิ้นจะถูกเข้ารหัสระดับองค์กร จะไม่มีการนำไฟล์ไปเผยแพร่, ขายต่อ, หรือดัดแปลงโดยไม่ได้รับอนุญาตอย่างเด็ดขาด ไฟล์โมเดลของลูกค้าจะถูกลบตามรอบบำรุงรักษา หรือเมื่อมีคำขอจากผู้ใช้งานโดยตรง" },
    { title: "3. การเปิดเผยข้อมูลให้กับบุคคลที่สาม", content: "บริษัท ขอยืนยันว่าจะไม่มีการขายหรือส่งต่อข้อมูลส่วนบุคคลและข้อมูลโมเดลของคุณให้กับองค์กรที่สาม ยกเว้นแต่ในกรณีของพาร์ทเนอร์ด้านระบบปฏิบัติการเซิร์ฟเวอร์และระบบการชำระเงินที่ต้องดำเนินไปตามกระบวนการที่เข้มงวดของบริการ" },
    { title: "4. สิทธิในการควบคุมข้อมูล", content: "ผู้ใช้สามารถลบ แก้ไข หรืออัปเดตข้อมูลไฟล์ 3D งานพิมพ์ และประวัติการสั่งซื้อได้ทุกเมื่อในเมนู 'ตั้งค่าบัญชี' หากมีข้อสงสัย ผู้ใช้สามารถติดต่อผู้ดูแลระบบได้ตลอดเวลา" },
  ],
};

const defaultTerms = {
  lastUpdated: "มีนาคม 2026",
  sections: [
    { title: "1. ข้อตกลงทั่วไป", content: "การเข้าถึงและการใช้งานแพลตฟอร์ม PDM PRO ตลอดจนบริการประเมินราคาโมเดล 3D แบบเรียลไทม์ และบริการเสริมอื่นๆ ผู้ใช้จะต้องยอมรับข้อตกลงในการจัดการทางกฎหมายทั้งหมดของแพลตฟอร์มนี้" },
    { title: "2. ข้อจำกัดเกี่ยวกับสิทธิในทรัพย์สินและการผลิต", content: "บริษัทจะไม่รับผิดชอบตามกฎหมายหากไฟล์ 3D ที่ท่านส่งมา ละเมิดลิขสิทธิ์ สิทธิบัตร อาวุธปืน หรือทรัพย์สินทางปัญญาของบุคคลอื่น ผู้ใช้งานมีหน้าที่ตรวจสอบความถูกต้องตามกฎหมายของไฟล์โมเดลอย่างถึงที่สุดก่อนดำเนินการสั่งพิมพ์ บริษัทขอสงวนสิทธิ์ในการระงับงานพิมพ์หากพบว่าชิ้นงานผิดกฎระเบียบของระบบ" },
    { title: "3. คุณภาพและการชดเชย", content: "เรามุ่งมั่นให้บริการ 3D Print ระดับมืออาชีพ อย่างไรก็ตาม หากผลิตภัณฑ์ที่ออกมาไม่เป็นไปตามความแม่นยำทางวิศวกรรมที่กำหนด กรุณาติดต่อวิศวกรของเราภายใน 7 วันทำการ เพื่อพิจารณาการเคลมงานหรือคืนเงิน (ตามเงื่อนไขที่ตกลงเท่านั้น)" },
    { title: "4. การชำระเงินและภาษี", content: "ราคาทั้งหมดปรากฏบนระบบได้คำนวณภาษีมูลค่าเพิ่มเบื้องต้นแล้ว (หากไม่ได้ระบุเป็นอย่างอื่น) บริษัทสงวนสิทธิในการแก้ไขราคา Material หรืออัตราการผลิตตามสถานการณ์ของตลาดได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า" },
  ],
};

const defaultCookies = {
  lastUpdated: "มีนาคม 2026",
  sections: [
    { title: "1. คุกกี้คืออะไร?", content: "ทาง PDM PRO นำคุกกี้ (Cookies) มาใช้เพื่อให้ระบบจดจำสถานะการล็อกอิน และเข้าใจรูปแบบการใช้งานแพลตฟอร์ม 3D Web Viewer เพื่อที่จะมอบประสบการณ์ที่มีความราบรื่น รวดเร็ว และเป็นส่วนตัวมากที่สุดให้กับผู้ใช้งาน" },
    { title: "2. คุกกี้ที่จำเป็นต่อการทำงาน (Strictly Necessary Cookies)", content: "คุกกี้กลุ่มนี้มีความจำเป็นอย่างยิ่งเพื่อให้ระบบประเมินราคา (Quote) และมุมมอง 3D Viewer ทำงานได้เป็นปกติ ผู้ใช้ไม่สามารถปิดคุกกี้ส่วนนี้ได้ เพราะหากไม่มีคุกกี้เหล่านี้ แพลตฟอร์มจะไม่สามารถบันทึกเซสชันการอัปโหลดไฟล์ 3D ได้เลย" },
    { title: "3. คุกกี้เพื่อการวิเคราะห์ (Analytical Cookies)", content: "ช่วยให้เราสามารถวัดผลการทำงานของระบบ 3D Rendering รวบรวมข้อมูลสถิติ และช่วยพัฒนาวิศวกรรมการพิมพ์ของเราให้ตรงเป้าหมายต่อลูกค้าทุกคนได้ดีขึ้น (ไม่บังคับในการใช้งาน)" },
    { title: "4. การจัดการคุกกี้", content: "คุณสามารถตั้งค่าเบราว์เซอร์เพื่อบล็อกคุกกี้ที่ไม่จำเป็นได้ อย่างไรก็ตามการจำกัดบางอย่างอาจกระทบกับประสบการณ์การแสดงผล WebGL 3D ที่อาจทำให้ตัวดูโมเดลทำงานบกพร่อง" },
  ],
};

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const doc = await LegalPages.findOne().lean() as any;

  return NextResponse.json({
    privacy: doc?.privacy?.sections?.length ? doc.privacy : defaultPrivacy,
    terms: doc?.terms?.sections?.length ? doc.terms : defaultTerms,
    cookies: doc?.cookies?.sections?.length ? doc.cookies : defaultCookies,
  });
}

export async function PUT(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await dbConnect();
  await LegalPages.findOneAndUpdate({}, { $set: body }, { upsert: true, new: true });
  return NextResponse.json({ success: true });
}
