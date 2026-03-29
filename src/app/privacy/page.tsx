import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            
            <div className="flex-1 max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-20 w-full">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-[100%] z-0"></div>
                    
                    <div className="relative z-10 flex items-center gap-4 mb-3">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                            <ShieldCheck size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">นโยบายความเป็นส่วนตัว</h1>
                    </div>
                    <p className="text-slate-500 font-medium mb-10 pb-6 border-b border-slate-100 relative z-10">อัปเดตล่าสุด: มีนาคม 2026</p>
                    
                    <div className="space-y-8 text-slate-600 leading-relaxed font-medium relative z-10">
                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">1. ข้อมูลที่เรารวบรวม</h2>
                            <p>ผู้ให้บริการ PDM PRO ("บริษัท") จะทำการรวบรวมข้อมูลส่วนบุคคลของคุณ เช่น ชื่อ, ที่อยู่อีเมล, ข้อมูลการติดต่อส่วนบุคคล รวมถึง <strong>ข้อมูลโมเดล 3 มิติ (ไฟล์ .STL, .OBJ, .STEP)</strong> ที่ถูกอัปโหลดขึ้นบนเซิร์ฟเวอร์เพื่อให้ประเมินราคาและดำเนินการจัดพิมพ์</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">2. การรักษาความปลอดภัยของไฟล์ 3D (Intellectual Property)</h2>
                            <p>เราให้ความสำคัญอย่างยิ่งต่อทรัพย์สินทางปัญญาของคุณ ไฟล์โมเดลทุกชิ้นจะถูกเข้ารหัสระดับองค์กร จะไม่มีการนำไฟล์ไปเผยแพร่, ขายต่อ, หรือดัดแปลงโดยไม่ได้รับอนุญาตอย่างเด็ดขาด ไฟล์โมเดลของลูกค้าจะถูกลบตามรอบบำรุงรักษา หรือเมื่อมีคำขอจากผู้ใช้งานโดยตรง</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">3. การเปิดเผยข้อมูลให้กับบุคคลที่สาม</h2>
                            <p>บริษัท ขอยืนยันว่าจะไม่มีการขายหรือส่งต่อข้อมูลส่วนบุคคลและข้อมูลโมเดลของคุณให้กับองค์กรที่สาม ยกเว้นแต่ในกรณีของพาร์ทเนอร์ด้านระบบปฏิบัติการเซิร์ฟเวอร์และระบบการชำระเงินที่ต้องดำเนินไปตามกระบวนการที่เข้มงวดของบริการ</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">4. สิทธิในการควบคุมข้อมูล</h2>
                            <p>ผู้ใช้สามารถลบ แก้ไข หรืออัปเดตข้อมูลไฟล์ 3D งานพิมพ์ และประวัติการสั่งซื้อได้ทุกเมื่อในเมนู 'ตั้งค่าบัญชี' หากมีข้อสงสัย ผู้ใช้สามารถติดต่อผู้ดูแลระบบได้ตลอดเวลา</p>
                        </section>
                    </div>
                </div>
            </div>
            
            <Footer />
        </main>
    );
}
