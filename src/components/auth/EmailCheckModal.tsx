"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EmailCheckModal() {
    const { data: session, update: updateSession } = useSession();
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [extraEmail, setExtraEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // 1. ฟังก์ชันเช็คอีเมล
        const checkEmail = () => {
            const userEmail = session?.user?.email;
            console.log("EmailCheckModal: Verifying session email ->", userEmail);
            
            if (userEmail && userEmail.endsWith("@sso.com")) {
                console.log("EmailCheckModal: MATCH! SSO email detected.");
                setShowEmailModal(true);
                return true;
            }
            return false;
        };

        // 2. เช็คครั้งแรกทันทีที่ session เปลี่ยน
        const found = checkEmail();

        // 3. [แผนสำรอง] ถ้ายังไม่เจอ (session อาจจะยังโหลดไม่เสร็จ) 
        // ให้ลองเช็คซ้ำทุกๆ 1 วินาที ทั้งหมด 5 ครั้ง
        let count = 0;
        const interval = setInterval(() => {
            count++;
            const stillLooking = checkEmail();
            if (stillLooking || count >= 5) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [session]);

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/update-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: extraEmail })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("บันทึกอีเมลเรียบร้อยแล้ว");
                setShowEmailModal(false);
                // อัปเดต session ทันที
                await updateSession({ ...session, user: { ...session?.user, email: extraEmail } });
                router.refresh();
            } else {
                toast.error(data.message || "อัปเดตไม่สำเร็จ");
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    };

    if (!showEmailModal) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-10 border border-white/20 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -ml-10 -mb-10" />

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center mb-8 mx-auto shadow-sm">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">ยืนยันอีเมลของคุณ</h4>
                    <p className="text-slate-500 text-[15px] font-medium leading-relaxed mb-10 px-2 text-balance">
                        เพื่อความปลอดภัยและใช้สำหรับรับ <span className="text-blue-600 font-bold">ใบแจ้งหนี้</span> <br/> 
                        กรุณาระบุที่อยู่อีเมลจริงของคุณให้เราทราบ
                    </p>
                    
                    <form onSubmit={handleUpdateEmail} className="space-y-5">
                        <div className="space-y-2 text-left">
                            <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-2">อีเมลทางการ</label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                value={extraEmail} 
                                onChange={e => setExtraEmail(e.target.value)} 
                                required 
                                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-600 rounded-[20px] px-6 py-4 text-sm font-bold shadow-sm transition-all outline-none"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading || !extraEmail.includes("@")}
                            className="w-full py-4.5 rounded-[20px] bg-blue-600 text-white font-black text-[15px] shadow-xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 group h-[58px]"
                        >
                            {loading ? "กำลังบันทึก..." : "ยืนยันและดำเนินการต่อ"}
                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-50">
                        <p className="text-[11px] text-slate-400 font-medium">เราให้ความสำคัญกับความเป็นส่วนตัว ข้อมูลของคุณจะถูกเก็บเป็นความลับ</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
