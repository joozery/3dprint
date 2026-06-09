import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Quote from "@/models/Quote";
import User from "@/models/User";
import Link from "next/link";
import { ArrowLeft, Package, User as UserIcon, MapPin, CreditCard, Clock, CheckCircle2, CircleDollarSign, Printer, Box, FileBox, FileText, ChevronRight, Download } from "lucide-react";
import AdminSlipUploader from "@/components/admin/orders/AdminSlipUploader";
import AdminOrderStatusSelect from "@/components/admin/orders/AdminOrderStatusSelect";
import SlipViewerButton from "@/components/admin/orders/SlipViewerButton";
import IShipPanel from "@/components/admin/orders/IShipPanel";
import FedExPanel from "@/components/admin/orders/FedExPanel";
import DHLPanel from "@/components/admin/orders/DHLPanel";

// For typing purposes if needed
const formatCur = (v: number) => Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ST_MAP: Record<string, { label: string, color: string, bg: string, icon: any }> = {
  "pending_payment":  { label: "รอยืนยันสลิป",     color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  "processing":       { label: "กำลังเตรียมพิมพ์", color: "text-blue-600",  bg: "bg-blue-50", icon: Box },
  "printing":         { label: "กำลังพิมพ์ 3D",   color: "text-purple-600", bg: "bg-purple-50", icon: Printer },
  "shipped":          { label: "จัดส่งแล้ว",       color: "text-indigo-600",bg: "bg-indigo-50", icon: Package },
  "delivered":        { label: "สำเร็จ",           color: "text-emerald-600",bg: "bg-emerald-50", icon: CheckCircle2 },
  "cancelled":        { label: "ยกเลิก",           color: "text-slate-500", bg: "bg-slate-100", icon: CircleDollarSign },
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();

  // Fetch Order and populate related models
  const order = await Order.findById(id).populate("userId").populate("quotes").lean();
  if (!order) {
    return <div className="p-10 text-center text-slate-500">ไม่พบข้อมูลคำสั่งซื้อ</div>;
  }

  const user = order.userId;
  const quotes = order.quotes;
  const statusCfg = ST_MAP[order.status as string] || ST_MAP["pending_payment"];
  const StatusIcon = statusCfg.icon;

  // Assume billing docs belong to the order shipping/user, or check first Quote
  const firstQuote = quotes?.[0] || {};
  const billingInfo = firstQuote?.billing || null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 fade-in slide-in-from-bottom-4 animate-in duration-700">
      
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm shrink-0">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-0.5">Order Detail</p>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
               {order.orderNumber}
            </h1>
          </div>
        </div>
        
        {/* Status Dropdown */}
        <div className="shrink-0">
          <AdminOrderStatusSelect orderId={order._id.toString()} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
            
            {/* Ordered Models Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileBox size={18} className="text-blue-500" />
                        รายการโมเดลที่สั่งพิมพ์ ({quotes.length} รายการ)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-white">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ไฟล์โมเดล</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">สเปกการพิมพ์</th>
                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">จำนวน</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">ยอดรวม</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {quotes.map((q: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800 mb-1">{q.originalName || q.fileName}</div>
                                        <div className="text-[10px] text-slate-500 space-y-0.5 mb-2.5">
                                            <p>ขนาด: {q.dimensions?.x?.toFixed(1)} x {q.dimensions?.y?.toFixed(1)} x {q.dimensions?.z?.toFixed(1)} mm</p>
                                            <p>ปริมาตร: {q.volumeCm3?.toFixed(2)} cm³</p>
                                        </div>
                                        {q.fileUrl && (
                                            <a 
                                                href={q.fileUrl} 
                                                download={q.originalName || q.fileName || "3d-model"}
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-100 text-[10px] font-bold transition-colors w-fit"
                                                title="ดาวน์โหลดไฟล์โมเดล"
                                            >
                                                <Download size={13} strokeWidth={2.5} /> โหลดไฟล์
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100">
                                                {q.technology?.toUpperCase()}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-600">
                                                {q.material} / {q.color}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center font-bold text-slate-700">{q.quantity}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                                        ฿{formatCur(q.priceDetail?.totalPrice || 0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-end">
                <div className="w-full sm:w-1/2 space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>ยอดรวมค่าสินค้า (Subtotal)</span>
                        <span className="font-semibold">฿{formatCur(order.pricing?.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>ค่าจัดส่ง (Shipping)</span>
                        <span className="font-semibold">฿{formatCur(order.pricing?.shippingFee || 0)}</span>
                    </div>
                    {order.pricing?.discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                            <span>ส่วนลด (Discount)</span>
                            <span className="font-semibold">-฿{formatCur(order.pricing.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base border-t border-slate-100 pt-3 mt-3">
                        <span className="font-bold text-slate-800">ยอดสุทธิ (Total)</span>
                        <span className="font-black text-blue-600 text-lg">฿{formatCur(order.pricing?.totalAmount || 0)}</span>
                    </div>
                </div>
            </div>

            {/* Shipping Panels */}
            <IShipPanel
                orderId={order._id.toString()}
                shippingAddress={{
                    zipCode:     order.shippingAddress?.zipCode     || "",
                    province:    order.shippingAddress?.province    || "",
                    district:    (order.shippingAddress as any)?.district    || "",
                    subDistrict: (order.shippingAddress as any)?.subDistrict || "",
                }}
                quotesData={(quotes as any[]).map(q => ({
                    weightGrams: q.weightGrams || 0,
                    dimensions:  q.dimensions  || { x: 10, y: 10, z: 5 },
                }))}
                existing={{
                    trackingNumber:   (order as any).trackingNumber   || "",
                    ishipOrderId:     (order as any).ishipOrderId     || "",
                    ishipCourierCode: (order as any).ishipCourierCode || "",
                }}
            />

            <FedExPanel
                orderId={order._id.toString()}
                shippingAddress={{
                    zipCode:  order.shippingAddress?.zipCode  || "",
                    province: order.shippingAddress?.province || "",
                }}
                quotesData={(quotes as any[]).map(q => ({
                    weightGrams: q.weightGrams || 0,
                    dimensions:  q.dimensions  || { x: 10, y: 10, z: 5 },
                }))}
                existing={{
                    trackingNumber:   (order as any).shippingProvider === "fedex" ? (order as any).trackingNumber : "",
                    shippingProvider: (order as any).shippingProvider || "",
                    fedexServiceType: (order as any).fedexServiceType || "",
                    fedexLabelUrl:    (order as any).fedexLabelUrl    || "",
                }}
            />

            <DHLPanel
                orderId={order._id.toString()}
                quotesData={(quotes as any[]).map(q => ({
                    weightGrams: q.weightGrams || 0,
                    dimensions:  q.dimensions  || { x: 10, y: 10, z: 5 },
                }))}
                existing={{
                    trackingNumber:   (order as any).shippingProvider === "dhl" ? (order as any).trackingNumber : "",
                    shippingProvider: (order as any).shippingProvider || "",
                    dhlProductCode:   (order as any).dhlProductCode   || "",
                    dhlLabelBase64:   (order as any).dhlLabelBase64   || "",
                }}
            />

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
            
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <UserIcon size={18} className="text-blue-500" /> ข้อมูลลูกค้า
                </h3>
                {user ? (
                    <Link href={`/admin/users/${user._id}`} className="group block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{user.name}</p>
                                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </Link>
                ) : (
                    <p className="text-sm text-slate-500 italic">Unregistered User</p>
                )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <MapPin size={18} className="text-blue-500" /> ที่อยู่จัดส่งสั่งซื้อ
                </h3>
                {order.shippingAddress ? (
                    <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl">
                        <p className="font-bold text-slate-800">{order.shippingAddress.fullName}</p>
                        <p className="text-blue-600 font-medium pb-2 border-b border-slate-200">{order.shippingAddress.phone}</p>
                        <p className="pt-2 leading-relaxed">
                            {order.shippingAddress.address}<br/>
                            {(order.shippingAddress as any).subDistrict ? `ต.${(order.shippingAddress as any).subDistrict} ` : ""}
                            {(order.shippingAddress as any).district ? `อ.${(order.shippingAddress as any).district} ` : ""}
                            จ.{order.shippingAddress.province} {order.shippingAddress.zipCode}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 italic">ไม่มีข้อมูลที่อยู่จัดส่ง</p>
                )}
            </div>

            {/* Billing Note */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <FileText size={18} className="text-blue-500" /> ข้อมูลเอกสาร/ออกใบเสร็จ
                </h3>
                {billingInfo ? (
                    <div className="text-xs text-slate-600 space-y-1.5">
                        <p><span className="font-semibold text-slate-800">ประเภท:</span> {billingInfo.type === 'company' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}</p>
                        <p><span className="font-semibold text-slate-800">ชื่อผู้เสียภาษี:</span> {billingInfo.companyName || `${billingInfo.firstName} ${billingInfo.lastName}`}</p>
                        {billingInfo.taxId && <p><span className="font-semibold text-slate-800">เลขประจำตัวผู้เสียภาษี:</span> {billingInfo.taxId}</p>}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">ผู้ใช้ไม่ได้ขอรับใบเสร็จในนามนิติบุคคลหรืออื่นๆ</p>
                )}
                
                {order.customerNotes && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="font-semibold text-slate-800 text-xs mb-2">หมายเหตุเพิ่มเติมถึงร้านร้าน:</p>
                        <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg italic border border-amber-100">"{order.customerNotes}"</p>
                    </div>
                )}
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <CreditCard size={18} className="text-blue-500" /> การชำระเงิน
                </h3>
                <div className="text-sm space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-slate-500">วิธีชำระ</span>
                        <span className="font-semibold text-slate-800">{order.paymentDetails?.method === "bank_transfer" ? "โอนเงินผ่านธนาคาร" : order.paymentDetails?.method?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-slate-500">สถานะชำระ</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${order.paymentDetails?.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {order.paymentDetails?.status || "PENDING"}
                        </span>
                    </div>
                    {order.paymentDetails?.slipUrl && (
                        <div className="pt-2">
                           <SlipViewerButton slipUrl={order.paymentDetails.slipUrl} />
                        </div>
                    )}
                    
                    <AdminSlipUploader orderId={order._id.toString()} />
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
