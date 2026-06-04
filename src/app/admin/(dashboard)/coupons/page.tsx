import AdminCouponsTable from "@/components/admin/coupons/AdminCouponsTable";

export const metadata = {
  title: "ระบบจัดการคูปอง | Admin Dashboard",
};

export default function AdminCouponsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">ระบบจัดการคูปอง</h1>
        <p className="text-slate-500 mt-1">
          สร้างและจัดการคูปองส่วนลดสำหรับลูกค้า
        </p>
      </div>

      <AdminCouponsTable />
    </div>
  );
}
