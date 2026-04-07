import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";

interface SearchParams {
  page?: string;
  status?: string;
  search?: string;
}

async function getOrders(searchParams: SearchParams) {
  await dbConnect();

  const page = parseInt(searchParams.page || "1");
  const limit = 15;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};
  if (searchParams.status && searchParams.status !== "all") {
    filter.status = searchParams.status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email image")
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders: JSON.parse(JSON.stringify(orders)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const data = await getOrders(params);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">จัดการคำสั่งซื้อ</h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">
          พบคำสั่งซื้อทั้งหมด {data.total.toLocaleString()} รายการ ในระบบ PDM
        </p>
      </div>
      <AdminOrdersTable
        orders={data.orders}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        currentStatus={params.status || "all"}
      />
    </div>
  );
}
