import { Box, Package, TrendingUp, Zap, Clock, ShieldCheck } from "lucide-react";

interface ProfileStatsProps {
    totalQuotes: number;
    totalVolume: number;
    userName: string;
}

export function ProfileStats({ totalQuotes, totalVolume, userName }: ProfileStatsProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">ยินดีต้อนรับกลับมา, <span className="text-blue-600">{userName}</span></h1>
                    <p className="text-slate-500 mt-2 font-medium">นี่คือภาพรวมกิจกรรมการพิมพ์ 3 มิติล่าสุดของคุณ</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    ระบบประเมินราคาพร้อมใช้งาน
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Stat 1 */}
                <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-slate-500 font-bold text-sm">งานที่กำลังดำเนินการ</div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Package size={22} />
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">{totalQuotes}</div>
                        <div className="text-[13px] text-emerald-600 font-bold mt-2 flex items-center gap-1.5 bg-emerald-50/80 inline-flex px-2.5 py-1.5 rounded-lg border border-emerald-100/50">
                            <TrendingUp size={14} /> กำลังติดตามสถานะ
                        </div>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-slate-500 font-bold text-sm">รายการงานรอตรวจสอบ</div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            <Clock size={22} />
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">{totalQuotes} <span className="text-xl sm:text-2xl text-slate-400">รายการ</span></div>
                        <div className="text-[13px] text-amber-600 font-bold mt-2 bg-amber-50/80 inline-flex px-2.5 py-1.5 rounded-lg border border-amber-100/50">
                            ทีมงานกำลังประเมินราคา
                        </div>
                    </div>
                </div>

                {/* Stat 3 (Premium Black Card) */}
                <div className="bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-950 p-8 rounded-[2rem] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col justify-between group hover:shadow-[0_20px_40px_rgba(30,58,138,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 -mx-10 -my-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] group-hover:bg-blue-400/30 transition-all"></div>
                    <div className="absolute bottom-0 left-0 -mx-10 -my-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-all"></div>
                    
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="text-slate-300 font-bold text-sm tracking-wide">สถานะบัญชี</div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
                            <ShieldCheck size={22} />
                        </div>
                    </div>
                    <div className="relative z-10 flex flex-col justify-end h-full mt-4">
                        <div className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">ยืนยันตัวตนแล้ว</div>
                        
                        <div className="text-[13px] text-slate-300 font-bold tracking-wide mt-4 flex items-center gap-2">
                           <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-400">พร้อมสั่งผลิตชิ้นงาน 3 มิติ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
