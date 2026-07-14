import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Quote from "@/models/Quote";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";

interface SearchParams {
  page?: string;
  status?: string;
  search?: string;
  userId?: string;
  tech?: string;
  dateFrom?: string;
  dateTo?: string;
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
  if (searchParams.userId) {
    filter.userId = searchParams.userId;
  }

  // technology อยู่ที่ Quote ไม่ใช่ Order — หา quote ids ของเทคโนโลยีนั้นก่อน แล้วกรอง order ที่มี quote เหล่านั้น
  if (searchParams.tech && searchParams.tech !== "all") {
    const techQuoteIds = await Quote.find({
      technology: { $regex: `^${searchParams.tech}$`, $options: "i" },
    }).distinct("_id");
    filter.quotes = { $in: techQuoteIds };
  }

  if (searchParams.dateFrom || searchParams.dateTo) {
    filter.createdAt = {};
    if (searchParams.dateFrom) filter.createdAt.$gte = new Date(`${searchParams.dateFrom}T00:00:00+07:00`);
    if (searchParams.dateTo)   filter.createdAt.$lte = new Date(`${searchParams.dateTo}T23:59:59.999+07:00`);
  }

  const [orders, total, technologies] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email image")
      .populate("quotes", "originalName fileName")
      .lean(),
    Order.countDocuments(filter),
    Quote.distinct("technology"),
  ]);

  const techOptions = [...new Set((technologies as string[]).filter(Boolean).map(t => t.toLowerCase()))].sort();

  return {
    orders: JSON.parse(JSON.stringify(orders)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    techOptions,
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
        techOptions={data.techOptions}
        currentTech={params.tech || "all"}
        currentDateFrom={params.dateFrom || ""}
        currentDateTo={params.dateTo || ""}
      />
    </div>
  );
}
