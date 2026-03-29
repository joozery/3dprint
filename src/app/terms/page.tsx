import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { FileSignature } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            
            <div className="flex-1 max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-20 w-full">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100%] z-0"></div>
                    
                    <div className="relative z-10 flex items-center gap-4 mb-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                            <FileSignature size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">ข้อกำหนดการให้บริการ</h1>
                    </div>
                    <p className="text-slate-500 font-medium mb-10 pb-6 border-b border-slate-100 relative z-10">อัปเดตล่าสุด: มีนาคม 2026</p>
                    
                    <div className="space-y-8 text-slate-600 leading-relaxed font-medium relative z-10">
                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">1. ข้อตกลงทั่วไป</h2>
                            <p>การเข้าถึงและการใช้งานแพลตฟอร์ม PDM PRO ตลอดจนบริการประเมินราคาโมเดล 3D แบบเรียลไทม์ และบริการเสริมอื่นๆ ผู้ใช้จะต้องยอมรับข้อตกลงในการจัดการทางกฎหมายทั้งหมดของแพลตฟอร์มนี้</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">2. ข้อจำกัดเกี่ยวกับสิทธิในทรัพย์สินและการผลิต</h2>
                            <p>บริษัทจะไม่รับผิดชอบตามกฎหมายหากไฟล์ 3D ที่ท่านส่งมา ละเมิดลิขสิทธิ์ สิทธิบัตร อาวุธปืน หรือทรัพย์สินทางปัญญาของบุคคลอื่น ผู้ใช้งานมีหน้าที่ตรวจสอบความถูกต้องตามกฎหมายของไฟล์โมเดลอย่างถึงที่สุดก่อนดำเนินการสั่งพิมพ์ บริษัทขอสงวนสิทธิ์ในการระงับงานพิมพ์หากพบว่าชิ้นงานผิดกฎระเบียบของระบบ</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">3. คุณภาพและการชดเชย</h2>
                            <p>เรามุ่งมั่นให้บริการ 3D Print ระดับมืออาชีพ อย่างไรก็ตาม หากผลิตภัณฑ์ที่ออกมาไม่เป็นไปตามความแม่นยำทางวิศวกรรมที่กำหนด กรุณาติดต่อวิศวกรของเราภายใน 7 วันทำการ เพื่อพิจารณาการเคลมงานหรือคืนเงิน (ตามเงื่อนไขที่ตกลงเท่านั้น)</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">4. การชำระเงินและภาษี</h2>
                            <p>ราคาทั้งหมดปรากฏบนระบบได้คำนวณภาษีมูลค่าเพิ่มเบื้องต้นแล้ว (หากไม่ได้ระบุเป็นอย่างอื่น) บริษัทสงวนสิทธิในการแก้ไขราคา Material หรืออัตราการผลิตตามสถานการณ์ของตลาดได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>
                        </section>
                    </div>
                </div>
            </div>
            
            <Footer />
        </main>
    );
}
