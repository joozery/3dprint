import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Quote from "@/models/Quote";
import Order from "@/models/Order";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, FileBox, HardDrive, ShoppingBag, Receipt, Building2, User as UserIcon } from "lucide-react";
import UserFilesTable from "@/components/admin/users/UserFilesTable";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  // Fetch full user data
  const user = await User.findById(id).lean();
  if (!user) {
    return <div className="p-10 text-center text-slate-500">ไม่พบผู้ใช้งานนี้</div>;
  }

  // Fetch Quotes
  const quotes = await Quote.find({ userId: id }).sort({ createdAt: -1 }).lean();
  
  // Fetch Orders
  const orders = await Order.find({ userId: id }).sort({ createdAt: -1 }).lean();

  // Calculate statistics
  const totalOrders = orders.length;
  // @ts-ignore
  const totalSpent = orders.reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);
  const totalQuotes = quotes.length;
  
  // HDD / File statistics
  const totalFiles = quotes.length;
  const fileDetails = quotes.map((q: any) => ({
    name: q.originalName || q.fileName || "Unknown",
    technology: q.technology,
    material: q.material,
    volumeCm3: q.volumeCm3 || 0,
    date: q.createdAt,
    // Estimate size: Since we don't store exact bytes, we approximate 1cm3 ~ 0.5MB for display, or show N/A
    estimatedMb: ((q.volumeCm3 || 0) * 0.45).toFixed(2), 
  }));

  const totalApproxMb = fileDetails.reduce((sum, f) => sum + parseFloat(f.estimatedMb), 0);
  const totalApproxGb = (totalApproxMb / 1024).toFixed(3);

  // Addresses fallback (if user doesn't have it on profile, find from latest order/quote)
  const billing = user.billing || quotes.find((q: any) => q.billing?.firstName)?.billing || null;
  const shipping = (user as any).shippingAddress || orders.find((o: any) => o.shippingAddress?.fullName)?.shippingAddress || null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header & Back */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <Link href="/admin/users" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ข้อมูลผู้ใช้งาน</h1>
          <p className="text-sm text-slate-500">ID: {user._id.toString()}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: User Profile & Contacts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden mb-4">
              {user.image ? (
                <Image src={user.image} alt={user.name} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-500 bg-blue-50">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 mt-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {user.provider}
            </div>

            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-slate-600 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 text-slate-600 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span>{billing?.phone || shipping?.phone || "ไม่มีข้อมูลเบอร์โทรศัพท์"}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-blue-500" /> ที่อยู่จัดส่ง (Shipping)
            </h3>
            {shipping ? (
              <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">
                <p className="font-semibold text-slate-800">{shipping.fullName}</p>
                <p>{shipping.phone}</p>
                <p className="mt-1">{shipping.address} จ.{shipping.province} {shipping.zipCode}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">ไม่มีข้อมูลที่อยู่จัดส่ง</p>
            )}

            <div className="h-px bg-slate-100 my-6" />

            <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
              <Receipt size={18} className="text-blue-500" /> ที่อยู่ออกใบเสร็จ (Billing)
            </h3>
            {billing ? (
              <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {billing.type === "company" ? <Building2 size={14} className="text-slate-400"/> : <UserIcon size={14} className="text-slate-400"/>}
                  {billing.type === "company" ? billing.companyName : `${billing.firstName} ${billing.lastName}`}
                </p>
                {billing.taxId && <p>เลขผู้เสียภาษี: {billing.taxId}</p>}
                <p className="mt-1">{billing.address} {billing.district} จ.{billing.province} {billing.postalCode}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">ไม่มีข้อมูลทีู่่ออกใบเสร็จ</p>
            )}
          </div>
        </div>

        {/* Right Column: Stats & Lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href={`/admin/orders?userId=${user._id}`} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center hover:border-blue-400 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"><ShoppingBag size={20}/></div>
              <p className="text-3xl font-black text-slate-800">{totalOrders}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs font-semibold text-slate-500 uppercase group-hover:text-blue-600 transition-colors">ออเดอร์ทั้งหมด</p>
                <span className="text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-100 rounded-2xl transition-colors pointer-events-none" />
            </Link>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2"><span className="text-lg font-black">฿</span></div>
              <p className="text-xl font-black text-slate-800 mt-2">{(totalSpent).toLocaleString()}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-0.5">ยอดสั่งซื้อรวม</p>
            </div>

            <Link href={`/admin/quotes?userId=${user._id}`} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center hover:border-orange-400 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300"><FileBox size={20}/></div>
              <p className="text-3xl font-black text-slate-800">{totalQuotes}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs font-semibold text-slate-500 uppercase group-hover:text-orange-500 transition-colors">ใบเสนอราคา</p>
                <span className="text-orange-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-100 rounded-2xl transition-colors pointer-events-none" />
            </Link>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-2"><HardDrive size={20}/></div>
              <p className="text-xl font-black text-slate-800 mt-2">{totalFiles}</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-1">ไฟล์โมเดล (~{totalApproxGb} GB)</p>
            </div>
          </div>

          {/* Model Files List (Paginated) */}
          <UserFilesTable fileDetails={fileDetails} totalFiles={totalFiles} />

        </div>
      </div>

    </div>
  );
}
