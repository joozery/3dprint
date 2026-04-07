import { Box, Package, TrendingUp, Zap, Clock, ShieldCheck, User } from "lucide-react";

interface ProfileStatsProps {
    totalQuotes: number;
    totalVolume: number;
    userName: string;
}

export function ProfileStats({ totalQuotes, totalVolume, userName }: ProfileStatsProps) {
    return (
        <div className="mb-10">
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
                        <User size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">สวัสดี, <span className="text-blue-600">{userName}</span></h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">ภาพรวมบัญชีและการสั่งพิมพ์ 3 มิติของคุณ</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-full border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    ระบบประเมินราคาพร้อมใช้งาน
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Stat 1: Total Quotes */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Box size={20} />
                        </div>
                        <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100">ทั้งหมด</span>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs font-semibold mb-1">ใบเสนอราคาที่ขอไว้</div>
                        <div className="text-4xl font-black text-slate-800 tracking-tight">{totalQuotes}</div>
                    </div>
                </div>

                {/* Stat 2: Pending/Actionable (Simplified for now using totalQuotes) */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Clock size={20} />
                        </div>
                        <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-amber-100">ตรวจสอบ</span>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs font-semibold mb-1">รายการรอประเมินราคา</div>
                        <div className="text-4xl font-black text-slate-800 tracking-tight">{totalQuotes}</div>
                    </div>
                </div>

                {/* Stat 3: Total Volume / Activity */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 blur-[30px] rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center border border-slate-700">
                            <Package size={20} />
                        </div>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1.5 rounded-lg border border-emerald-500/20">
                            <ShieldCheck size={14} /> บัญชีระดับพื้นฐาน
                        </span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-slate-400 text-xs font-semibold mb-1">ปริมาตรการพิมพ์รวม (cm³)</div>
                        <div className="text-4xl font-black text-white tracking-tight">{totalVolume.toFixed(0)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
