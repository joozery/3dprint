import { Box, Package, TrendingUp, Zap } from "lucide-react";

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
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back, {userName}</h1>
                    <p className="text-slate-500 mt-1">Here is the overview of your recent 3D printing activity.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Systems Operational
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Stat 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-slate-300 transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-slate-500 font-medium text-sm">Active Orders</div>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Package size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">{totalQuotes}</div>
                        <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                            <TrendingUp size={12} /> Live tracking running
                        </div>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-slate-300 transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-slate-500 font-medium text-sm">Total Print Volume</div>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Box size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">{(totalVolume / 1000).toFixed(2)} <span className="text-lg text-slate-400">Liters</span></div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Material consumed over time</div>
                    </div>
                </div>

                {/* Stat 3 (Premium Black Card) */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between group cursor-pointer hover:shadow-xl hover:shadow-slate-900/50 transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-slate-400 font-medium text-sm">Member Status</div>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                            <Zap size={16} fill="currentColor" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white mb-1">PRO Member</div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                             <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-1.5 rounded-full w-[80%]"></div>
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-2 flex justify-between">
                            <span>Platform Points</span>
                            <span className="text-amber-500 font-bold">8,420</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
