import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import AnalyticsView from "@/components/admin/reports/AnalyticsView";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage({ searchParams }: { searchParams: Promise<{ type?: string; year?: string; month?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  const { type = "yearly", year, month } = await searchParams;

  await dbConnect();
  
  const now = new Date();
  const selectedYear = parseInt(year || "") || now.getFullYear();
  const selectedMonth = parseInt(month || "") || (now.getMonth() + 1);

  let chartData: any[] = [];
  let viewPeriodText = "";

  if (type === "yearly") {
      const startOfYear = new Date(selectedYear, 0, 1);
      const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
    
      const monthlyAgg = await Order.aggregate([
        { 
          $match: { 
            "paymentDetails.status": "paid", 
            createdAt: { $gte: startOfYear, $lte: endOfYear } 
          } 
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            sales: { $sum: "$pricing.totalAmount" },
            orders: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
    
      const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      chartData = monthNames.map((name, index) => {
        const found = monthlyAgg.find(m => m._id === index + 1);
        return { name, sales: found ? found.sales : 0, orders: found ? found.orders : 0 };
      });
      viewPeriodText = `รายเดือน ประจำปี ${selectedYear}`;
  } else if (type === "monthly") {
      const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);
      const daysInMonth = endOfMonth.getDate();

      const dailyAgg = await Order.aggregate([
        { 
          $match: { 
            "paymentDetails.status": "paid", 
            createdAt: { $gte: startOfMonth, $lte: endOfMonth } 
          } 
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            sales: { $sum: "$pricing.totalAmount" },
            orders: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
    
      chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const found = dailyAgg.find(d => d._id === day);
        return { name: `${day}`, sales: found ? found.sales : 0, orders: found ? found.orders : 0 };
      });
      viewPeriodText = `รายวัน ประจำเดือน ${selectedMonth}/${selectedYear}`;
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">รายงานและดาวน์โหลด</h1>
            <p className="text-slate-500 text-sm mt-1">สรุปยอดขายและส่งออกข้อมูลเชิงลึกเป็น Excel</p>
         </div>
      </div>
      
      <AnalyticsView 
         chartData={chartData} 
         viewPeriodText={viewPeriodText}
         currentType={type}
         currentYear={selectedYear}
         currentMonth={selectedMonth}
      />
    </div>
  );
}
