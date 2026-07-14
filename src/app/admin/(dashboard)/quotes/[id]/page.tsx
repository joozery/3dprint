import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import Order from "@/models/Order";
import MaterialConfig from "@/models/MaterialConfig";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, MapPin, Phone, Mail, Building2, User } from "lucide-react";
import { PrintButton } from "@/components/quote/PrintButton";
import QuoteInternalTracker from "@/components/admin/quotes/QuoteInternalTracker";

export const dynamic = "force-dynamic";

export default async function AdminQuoteViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "admin") {
      redirect("/login");
  }

  await dbConnect();
  
  // Find quote without restricting to a specific user id (because we are admin)
  const rawQuote = await Quote.findById(id).lean();
  
  if (!rawQuote) redirect("/admin/quotes");
  
  const quote = JSON.parse(JSON.stringify(rawQuote));
  
  // Fetch all items sharing the same quoteNumber
  const rawItems = await Quote.find({ quoteNumber: quote.quoteNumber }).lean();
  const allItems = JSON.parse(JSON.stringify(rawItems));

  // วัสดุที่เก็บใน quote เป็น MaterialConfig._id (string) — ต้อง resolve เป็นชื่อที่อ่านได้
  const materialIds = [...new Set(allItems.map((item: any) => item.material).filter(Boolean))]
    .filter((mid: any) => /^[0-9a-fA-F]{24}$/.test(mid));
  const materialDocs = materialIds.length ? await MaterialConfig.find({ _id: { $in: materialIds } }).lean() : [];
  const materialNameMap: Record<string, string> = {};
  materialDocs.forEach((m: any) => { materialNameMap[m._id.toString()] = m.name; });

  const { billing } = quote;
  const isCompany = billing?.type === "company";

  const formatCur = (num: number) => num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const subtotal = allItems.reduce((sum: number, item: any) => sum + (item.priceDetail?.totalPrice || 0), 0);

  // ถ้า quote นี้ถูกสั่งซื้อไปแล้ว ดึงค่าจัดส่ง/ยอดรวมจริงจาก Order
  // เพื่อให้ตัวเลขตรงกับที่ลูกค้าจ่ายจริงตอน checkout (ตรรกะเดียวกับเทมเพลตฝั่งลูกค้า)
  const rawOrder = await Order.findOne({ quotes: { $in: rawItems.map((i: any) => i._id) } }).lean();
  const order = rawOrder ? JSON.parse(JSON.stringify(rawOrder)) : null;
  const hasRealOrder = !!order;

  const deliveryConfig: Record<string, { label: string; days: string; price: number }> = {
      economy:  { label: 'ประหยัด',  days: '7-10 วัน', price: 60 },
      standard: { label: 'ปกติ',    days: '4-5 วัน',  price: 85 },
      express:  { label: 'ด่วน',    days: '2 วัน',    price: 285 },
  };
  const currentDelivery = deliveryConfig[quote.deliverySpeed || 'standard'];

  const deliveryCost = hasRealOrder
      ? (order.pricing?.shippingFee || 0)
      : (quote.shippingFee != null ? quote.shippingFee : null);
  const deliveryLabel = hasRealOrder
      ? (order.shippingProvider || quote.shippingCourierName)
      : (quote.shippingCourierName || currentDelivery.label);
  const vat          = hasRealOrder ? (order.pricing?.vat ?? 0) : subtotal * 0.07;
  const whtApplies   = hasRealOrder
      ? (order.pricing?.wht ?? 0) > 0
      : isCompany && subtotal >= 1000;
  const wht          = hasRealOrder
      ? (order.pricing?.wht ?? 0)
      : (whtApplies ? subtotal * 0.03 : 0);
  const grandTotal   = hasRealOrder
      ? (order.pricing?.totalAmount ?? (subtotal + vat + (deliveryCost || 0)))
      : (subtotal + vat + (deliveryCost || 0));
  const netPayable   = hasRealOrder
      ? (order.pricing?.netPayable ?? grandTotal - wht)
      : grandTotal - wht;

  return (
    <div className="min-h-screen bg-slate-100 py-8 font-sans">
      <div className="max-w-[850px] mx-auto px-4">
        
        {/* Top actions */}
        <div className="flex items-center justify-between mb-6 print:hidden">
            <Link href="/admin/quotes" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold">
                <ArrowLeft size={16} /> กลับหน้ารายการ
            </Link>
            <div className="flex gap-3">
                <PrintButton />
            </div>
        </div>

        {/* ── Internal Tracker ── */}
        <QuoteInternalTracker 
          id={quote._id} 
          initialStatus={quote.internalStatus} 
          initialComment={quote.internalComments} 
        />

        {/* ── Document A4 Container ── */}
        <div className="bg-white border border-slate-200 shadow-lg print:shadow-none print:border-none p-8 sm:p-12 print:p-6 pb-12 print:pb-6 max-w-[850px] w-full mx-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6 print:pb-4 print:mb-4">
                <div>
                   <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">ใบเสนอราคา</h1>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Quotation</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-semibold mb-0.5 uppercase tracking-widest">เลขที่เอกสาร / No.</p>
                    <p className="text-base font-bold text-slate-800 leading-none">{quote.quoteNumber || `QT-${quote._id.toString().slice(-6).toUpperCase()}`}</p>
                    
                    <p className="text-slate-500 text-[10px] font-semibold mt-3 mb-0.5 uppercase tracking-widest">วันที่ / Date</p>
                    <p className="text-xs font-bold text-slate-800 leading-none">
                        {new Date(quote.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Entity Info */}
            <div className="grid grid-cols-2 gap-8 mb-6 print:gap-4 print:mb-4">
                {/* From (us) */}
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">ผู้ออกใบเสนอราคา / From</p>
                    <p className="text-xs font-black text-slate-900">บริษัท เซปทิลเลียน จำกัด</p>
                    <p className="text-[11px] text-slate-600 leading-snug max-w-[250px] mt-1">
                        388/13-14 บีอเวนิว ถ.ราชพฤกษ์<br/>บางแวก ภาษีเจริญ กทม. 10160
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">เลขประจำตัวผู้เสียภาษี 0105556031281</p>
                </div>

                {/* To (customer) */}
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">เสนอราคาแก่ / To</p>
                    
                    {billing ? (
                        <>
                            <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                {isCompany ? <Building2 size={12} className="text-blue-600" /> : <User size={12} className="text-blue-600" />}
                                {isCompany ? billing.companyName : `${billing.firstName} ${billing.lastName}`}
                            </p>
                            
                            {billing.taxId && <p className="text-[10px] text-slate-600 mt-1">เลขผู้เสียภาษี: {billing.taxId}</p>}
                            {billing.idCard && <p className="text-[10px] text-slate-600 mt-1">เลขบัตรประชาชน: {billing.idCard}</p>}
                            
                            <p className="text-[11px] text-slate-600 mt-1.5 leading-snug max-w-[250px]">
                                {billing.address} {billing.district} {billing.province} {billing.postalCode}
                            </p>
                            
                            <div className="mt-2 space-y-0.5">
                                <p className="text-[10px] text-slate-600 flex items-center gap-1.5"><Phone size={10} className="text-slate-400"/> {billing.phone}</p>
                                <p className="text-[10px] text-slate-600 flex items-center gap-1.5"><Mail size={10} className="text-slate-400"/> {billing.email}</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-[10px] text-slate-500 italic">ไม่มีข้อมูลการเรียกเก็บเงินที่บันทึกไว้</p>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="mb-6 print:mb-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-y-2 border-slate-200">
                            <th className="py-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-10 text-center">#</th>
                            <th className="py-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">รายการสินค้า (Description)</th>
                            <th className="py-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">จำนวน (Qty)</th>
                            <th className="py-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">หน่วยละ (Unit Price)</th>
                            <th className="py-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">จำนวนเงิน (Amount)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* Quote items */}
                        {allItems.map((item: any, index: number) => {
                        const materialLabel = materialNameMap[item.material]
                            || (/^[0-9a-fA-F]{24}$/.test(item.material || "") ? "วัสดุ 3D Print" : item.material);
                        return (
                        <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-2 text-xs text-slate-600 font-medium text-center align-top">{index + 1}</td>
                            <td className="py-3 px-2 align-top">
                                <p className="text-xs font-bold text-slate-900 mb-1">โมเดลพิมพ์ 3 มิติ · {materialLabel}</p>
                                <div className="text-[10px] text-slate-500 space-y-0.5 leading-snug">
                                    <p>• เทคโนโลยี: <span className="font-semibold">{item.technology?.toUpperCase()}</span></p>
                                    <p>• วัสดุ: <span className="font-semibold">{materialLabel}</span> / สี: {item.color}</p>
                                    <p>• ปริมาตร: {item.volumeCm3?.toFixed(2)} cm³</p>
                                    {item.dimensions && (
                                        <p>• ขนาด (X,Y,Z): {item.dimensions.x?.toFixed(1)} x {item.dimensions.y?.toFixed(1)} x {item.dimensions.z?.toFixed(1)} mm</p>
                                    )}
                                </div>
                            </td>
                            <td className="py-3 px-2 text-xs text-slate-800 font-bold text-center align-top">{item.quantity}</td>
                            <td className="py-3 px-2 text-xs text-slate-600 font-medium text-right align-top"> {item.priceDetail?.pricePerUnit ? `฿${formatCur(item.priceDetail.pricePerUnit)}` : 'รอประเมิน'}</td>
                            <td className="py-3 px-2 text-xs text-slate-800 font-black text-right align-top">{item.priceDetail?.totalPrice ? `฿${formatCur(item.priceDetail.totalPrice)}` : 'รอประเมิน'}</td>
                        </tr>
                        );})}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end border-t-2 border-slate-900 pt-4 mb-8 print:mb-6">
                <div className="w-2/3 md:w-1/2 lg:w-2/5">
                    <div className="flex justify-between items-center py-1.5 text-xs">
                        <span className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">มูลค่าสินค้า (Subtotal)</span>
                        <span className="font-bold text-slate-800">฿{formatCur(subtotal)}</span>
                    </div>
                    {vat > 0 && (
                        <div className="flex justify-between items-center py-1.5 text-xs">
                            <span className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">ภาษีมูลค่าเพิ่ม 7% (VAT)</span>
                            <span className="font-bold text-slate-800">฿{formatCur(vat)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center py-1.5 text-xs">
                        <span className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">
                            ค่าจัดส่ง (Delivery)
                            {deliveryLabel && <span className="ml-1 normal-case font-normal text-slate-400">— {deliveryLabel}</span>}
                        </span>
                        <span className="font-bold text-slate-800">
                            {deliveryCost != null ? `฿${formatCur(deliveryCost)}` : 'รอประเมิน'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 mt-1.5 border-t border-slate-200">
                        <span className="text-slate-900 font-black uppercase tracking-widest text-[11px]">ยอดรวมสุทธิ (Total)</span>
                        <span className="text-lg font-black leading-none text-slate-800">฿{formatCur(grandTotal)}</span>
                    </div>
                    {whtApplies && (
                        <div className="flex justify-between items-center py-1.5 text-xs text-red-600 mt-1">
                            <span className="font-semibold uppercase tracking-widest text-[9px]">หัก ณ ที่จ่าย 3% (WHT)</span>
                            <span className="font-bold">-฿{formatCur(wht)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center py-2.5 mt-1.5 border-t-2 border-slate-900">
                        <span className="text-slate-900 font-black uppercase tracking-widest text-[11px]">ยอดชำระสุทธิ</span>
                        <span className="text-xl font-black text-blue-600 leading-none">฿{formatCur(netPayable)}</span>
                    </div>
                </div>
            </div>

            {/* Terms / Note */}
            <div className="pt-6 pb-2 border-t border-slate-100 flex flex-col sm:flex-row gap-8 text-[10px] text-slate-500 print:gap-4 print:pt-4">
                <div className="flex-1 space-y-1.5">
                    <p className="font-bold text-slate-700 uppercase tracking-widest text-[9px]">เงื่อนไขการรับประกันและชำระเงิน</p>
                    <ul className="list-disc leading-snug pl-4 space-y-0.5">
                        <li>ใบเสนอราคานี้มีผลบังคับใช้ 30 วันนับจากวันที่ออกเอกสาร</li>
                        <li>มัดจำ 50% ก่อนเริ่มดำเนินการผลิต และชำระส่วนที่เหลือก่อนการจัดส่ง</li>
                        <li>รับประกันคุณภาพงานพิมพ์ กรณีชิ้นงานเกิดความเสียหายจากการผลิต สามารถเคลมได้ภายใน 7 วัน</li>
                    </ul>
                </div>
                {billing?.note && (
                    <div className="flex-1 space-y-1.5">
                         <p className="font-bold text-slate-700 uppercase tracking-widest text-[9px]">หมายเหตุจากลูกค้า</p>
                         <p className="leading-relaxed bg-slate-50 p-2.5 border border-slate-100 italic rounded-lg print:bg-transparent print:border-none print:p-0 font-medium">
                             "{billing.note}"
                         </p>
                    </div>
                )}
            </div>

            {/* Signature blocks placeholder */}
            <div className="mt-12 pt-8 border-t border-dashed border-slate-200 grid grid-cols-2 gap-8 print:mt-6 print:pt-6">
                <div className="text-center">
                    <div className="border-b border-slate-300 w-40 mx-auto mb-1.5 h-8"></div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">ผู้จัดทำเอกสาร (Prepared by)</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-slate-300 w-40 mx-auto mb-1.5 h-8"></div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">ผู้อนุมัติ/ผู้สั่งซื้อ (Authorized by)</p>
                </div>
            </div>

        </div>

        {/* Global Print Styling Fix */}
        <div dangerouslySetInnerHTML={{ __html: `<style>
          @media print {
              body { background-color: white !important; }
              @page { size: auto; margin: 0mm; }
          }
        </style>` }} />
      </div>
    </div>
  );
}
