import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { Cookie } from "lucide-react";

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            
            <div className="flex-1 max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-20 w-full">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-bl-[100%] z-0"></div>
                    
                    <div className="relative z-10 flex items-center gap-4 mb-3">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                            <Cookie size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">นโยบายคุกกี้</h1>
                    </div>
                    <p className="text-slate-500 font-medium mb-10 pb-6 border-b border-slate-100 relative z-10">อัปเดตล่าสุด: มีนาคม 2026</p>
                    
                    <div className="space-y-8 text-slate-600 leading-relaxed font-medium relative z-10">
                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">1. คุกกี้คืออะไร?</h2>
                            <p>ทาง PDM PRO นำคุกกี้ (Cookies) มาใช้เพื่อให้ระบบจดจำสถานะการล็อกอิน และเข้าใจรูปแบบการใช้งานแพลตฟอร์ม 3D Web Viewer เพื่อที่จะมอบประสบการณ์ที่มีความราบรื่น รวดเร็ว และเป็นส่วนตัวมากที่สุดให้กับผู้ใช้งาน</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">2. คุกกี้ที่จำเป็นต่อการทำงาน (Strictly Necessary Cookies)</h2>
                            <p>คุกกี้กลุ่มนี้มีความจำเป็นอย่างยิ่งเพื่อให้ระบบประเมินราคา (Quote) และมุมมอง 3D Viewer ทำงานได้เป็นปกติ ผู้ใช้ไม่สามารถปิดคุกกี้ส่วนนี้ได้ เพราะหากไม่มีคุกกี้เหล่านี้ แพลตฟอร์มจะไม่สามารถบันทึกเซสชันการอัปโหลดไฟล์ 3D ได้เลย</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">3. คุกกี้เพื่อการวิเคราะห์ (Analytical Cookies)</h2>
                            <p>ช่วยให้เราสามารถวัดผลการทำงานของระบบ 3D Rendering รวบรวมข้อมูลสถิติ และช่วยพัฒนาวิศวกรรมการพิมพ์ของเราให้ตรงเป้าหมายต่อลูกค้าทุกคนได้ดีขึ้น (ไม่บังคับในการใช้งาน)</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-black text-slate-800 mb-3">4. การจัดการคุกกี้</h2>
                            <p>คุณสามารถตั้งค่าเบราว์เซอร์เพื่อบล็อกคุกกี้ที่ไม่จำเป็นได้ อย่างไรก็ตามการจำกัดบางอย่างอาจกระทบกับประสบการณ์การแสดงผล WebGL 3D ที่อาจทำให้ตัวดูโมเดลทำงานบกพร่อง</p>
                        </section>
                    </div>
                </div>
            </div>
            
            <Footer />
        </main>
    );
}
