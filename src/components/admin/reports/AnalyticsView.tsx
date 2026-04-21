"use client";

import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Download, FileSpreadsheet, Users, Database, ShoppingBag, FileText, Filter } from "lucide-react";
import { toast } from "sonner";

interface Props {
  chartData: any[];
  viewPeriodText: string;
  currentType: string;
  currentYear: number;
  currentMonth: number;
}

export default function AnalyticsView({ chartData, viewPeriodText, currentType, currentYear, currentMonth }: Props) {
  const router = useRouter();

  const handleFilterChange = (key: string, val: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, val);
    if (key === 'type' && val === 'monthly' && !params.has('month')) {
      params.set('month', new Date().getMonth() + 1 + '');
    }
    router.push(`?${params.toString()}`);
  };

  const handleDownload = (type: string) => {
    toast.info(`กำลังประมวลผลไฟล์ Excel สำหรับ ${type}...`);
    window.location.href = `/api/admin/reports/export-${type}?type=${currentType}&year=${currentYear}&month=${currentMonth}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Chart Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
           <div>
             <h3 className="text-lg font-bold text-slate-800">สรุปยอดขาย ({viewPeriodText})</h3>
             <p className="text-sm text-slate-500">กราฟแสดงมูลค่ารวมเฉพาะรายการทีชำระเงินเรียบร้อยแล้ว</p>
           </div>
           
           {/* Dropdown Filters */}
           <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                 <Filter size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">มุมมองรายงาน</span>
              </div>
              
              <select 
                value={currentType}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 cursor-pointer outline-none focus:border-blue-500 transition-colors"
              >
                 <option value="yearly">รายเดือน (ทั้งปี)</option>
                 <option value="monthly">รายวัน (ทั้งเดือน)</option>
              </select>

              {currentType === 'monthly' && (
                <select 
                  value={currentMonth}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 cursor-pointer outline-none focus:border-blue-500 transition-colors"
                >
                   {Array.from({length: 12}).map((_, i) => (
                     <option key={i+1} value={i+1}>เดือนที่ {i+1}</option>
                   ))}
                </select>
              )}

              <select 
                value={currentYear}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 cursor-pointer outline-none focus:border-blue-500 transition-colors"
              >
                 {[2024, 2025, 2026, 2027].map((y) => (
                   <option key={y} value={y}>ปี {y}</option>
                 ))}
              </select>
           </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} textAnchor="middle" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `฿${(val/1000).toFixed(0)}k`} />
              <RechartsTooltip 
                 formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดขาย']}
                 labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                 contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
              />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
           <Download size={20} className="text-slate-400" /> นำออกข้อมูล (Data Export - Raw CSV Excel)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Orders */}
          <button 
             onClick={() => handleDownload('orders')}
             className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
          >
             <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
             </div>
             <div>
                <p className="font-bold text-slate-800 text-sm">ดาวน์โหลด Order Report</p>
                <p className="text-[11px] text-slate-500 mt-0.5">รวมประวัติออเดอร์ วัสดุ ราคา ต้นทุน คอมเมนต์</p>
             </div>
             <FileSpreadsheet className="ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
          </button>

          {/* Quotes */}
          <button 
             onClick={() => handleDownload('quotes')}
             className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
          >
             <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FileText size={24} />
             </div>
             <div>
                <p className="font-bold text-slate-800 text-sm">ดาวน์โหลด Quotation Report</p>
                <p className="text-[11px] text-slate-500 mt-0.5">รวมใบเสนอราคาทั้งหมดและการโทรติดต่อ</p>
             </div>
             <FileSpreadsheet className="ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
          </button>

          {/* Users */}
          <button 
             onClick={() => handleDownload('users')}
             className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
          >
             <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Users size={24} />
             </div>
             <div>
                <p className="font-bold text-slate-800 text-sm">ดาวน์โหลด User Report</p>
                <p className="text-[11px] text-slate-500 mt-0.5">รายชื่อสมาชิกลูกค้าทั้งหมดในระบบ</p>
             </div>
             <FileSpreadsheet className="ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
          </button>

          {/* Files */}
          <button 
             onClick={() => handleDownload('files')}
             className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
          >
             <div className="w-12 h-12 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Database size={24} />
             </div>
             <div>
                <p className="font-bold text-slate-800 text-sm">ดาวน์โหลด Files 3D Report</p>
                <p className="text-[11px] text-slate-500 mt-0.5">ประวัติไฟล์โมเดลที่ถูกอัปโหลด ขนาด และปริมาตร</p>
             </div>
             <FileSpreadsheet className="ml-auto text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
          </button>
        </div>
      </div>
      
    </div>
  );
}
