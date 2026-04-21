import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Quote from "@/models/Quote";
import User from "@/models/User";
import AdminDashboardStats from "@/components/admin/dashboard/AdminDashboardStats";
import AdminRecentOrders from "@/components/admin/dashboard/AdminRecentOrders";
import AdminRecentUsers from "@/components/admin/dashboard/AdminRecentUsers";
import AdminQuoteStats from "@/components/admin/dashboard/AdminQuoteStats";

async function getDashboardData() {
  await dbConnect();

  const now = new Date();
  
  // This Month range
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // This Year range
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const [
    totalOrders,
    totalUsers,
    totalQuotes,
    pendingProcessOrdersCount,
    printingOrdersCount,
    pendingQuotesCount,
    revenueThisMonthAgg,
    revenueThisYearAgg,
    recentOrders,
    recentUsers,
    ordersByStatus,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: "user" }),
    Quote.countDocuments(),
    Order.countDocuments({ status: { $in: ["pending_payment", "processing"] } }),
    Order.countDocuments({ status: "printing" }),
    Quote.countDocuments({ internalStatus: "pending" }),
    Order.aggregate([
      { $match: { "paymentDetails.status": "paid", createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: "$pricing.totalAmount" } } },
    ]),
    Order.aggregate([
      { $match: { "paymentDetails.status": "paid", createdAt: { $gte: startOfYear, $lte: endOfYear } } },
      { $group: { _id: null, total: { $sum: "$pricing.totalAmount" } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("userId", "name email image")
      .lean(),
    User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenueThisMonth = revenueThisMonthAgg[0]?.total || 0;
  const totalRevenueThisYear = revenueThisYearAgg[0]?.total || 0;

  return {
    totalOrders,
    totalUsers,
    totalQuotes,
    pendingProcessOrdersCount,
    printingOrdersCount,
    pendingQuotesCount,
    totalRevenueThisMonth,
    totalRevenueThisYear,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    recentUsers: JSON.parse(JSON.stringify(recentUsers)),
    ordersByStatus: JSON.parse(JSON.stringify(ordersByStatus)),
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Stats row */}
      <AdminDashboardStats
        totalRevenueThisMonth={data.totalRevenueThisMonth}
        totalRevenueThisYear={data.totalRevenueThisYear}
        pendingProcessOrdersCount={data.pendingProcessOrdersCount}
        pendingQuotesCount={data.pendingQuotesCount}
        printingOrdersCount={data.printingOrdersCount}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left — tables */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AdminRecentOrders orders={data.recentOrders} />
          <AdminRecentUsers users={data.recentUsers} />
        </div>

        {/* Right — sidebar widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Order status breakdown */}
          <AdminQuoteStats ordersByStatus={data.ordersByStatus} />

          {/* Monthly target */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-slate-800 text-sm font-bold">เป้าหมายรายเดือน</h4>
              <span className="text-blue-600 text-sm font-bold">85%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            </div>
            <p className="text-slate-400 text-[11px]">* ข้อมูลแผนงานประจำปี 2026</p>
          </div>

        </div>
      </div>
    </div>
  );
}
