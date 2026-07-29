"use client";

import { useState, useEffect } from "react";
// No date-fns needed
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Coupon = {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export default function AdminCouponsTable() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: null,
    usageLimit: null,
    isActive: true,
    expiresAt: null,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการโหลดคูปอง");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setIsEditing(true);
      setFormData({
        ...coupon,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : null as any,
      });
    } else {
      setIsEditing(false);
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: null,
        usageLimit: null,
        isActive: true,
        expiresAt: null,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.discountValue) {
      toast.error("กรุณากรอกรหัสคูปองและมูลค่าส่วนลด");
      return;
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/admin/coupons/${formData._id}` : "/api/admin/coupons";
      
      const payload = { ...formData };
      if (!payload.expiresAt) payload.expiresAt = null;
      if (!payload.maxDiscount) payload.maxDiscount = null;
      if (!payload.usageLimit) payload.usageLimit = null;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "อัปเดตคูปองแล้ว" : "สร้างคูปองแล้ว");
        setIsDialogOpen(false);
        fetchCoupons();
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคูปองนี้?")) return;
    
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("ลบคูปองแล้ว");
        fetchCoupons();
      } else {
        toast.error(data.error || "ลบไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="ค้นหารหัสคูปอง..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-lg transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={fetchCoupons} disabled={loading} className="shrink-0 h-10 w-10 border-slate-200 text-slate-500 hover:text-slate-700">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => handleOpenDialog()} className="h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 rounded-lg px-5 w-full sm:w-auto transition-all">
            <Plus className="mr-2 h-4 w-4" />
            สร้างคูปองใหม่
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100 text-xs">
            <tr>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4">รหัส / รายละเอียด</th>
              <th className="px-6 py-4">ส่วนลด</th>
              <th className="px-6 py-4">เงื่อนไข</th>
              <th className="px-6 py-4">การใช้งาน</th>
              <th className="px-6 py-4">หมดอายุ</th>
              <th className="px-6 py-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                    <p className="font-medium text-slate-500">กำลังโหลดข้อมูล...</p>
                  </div>
                </td>
              </tr>
            ) : filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                      <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">ไม่พบคูปอง</h3>
                    <p className="text-sm text-slate-500 mb-6 text-center">ยังไม่มีคูปองในระบบ หรือไม่พบข้อมูลที่คุณค้นหา ลองสร้างคูปองใหม่ดูสิ</p>
                    <Button onClick={() => handleOpenDialog()} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Plus className="mr-2 h-4 w-4" /> สร้างคูปองใหม่
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCoupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    {coupon.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> เปิดใช้งาน
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                        <XCircle className="w-3 h-3" /> ปิดใช้งาน
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 font-mono text-base">{coupon.code}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{coupon.description || "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded text-sm border border-orange-100">
                      {coupon.discountType === "percentage" ? `ลด ${coupon.discountValue}%` : `ลด ฿${coupon.discountValue.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </span>
                    {coupon.maxDiscount && (
                      <div className="text-xs text-slate-400 mt-1">สูงสุด ฿{coupon.maxDiscount?.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    <div>ขั้นต่ำ ฿{coupon.minOrderValue?.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="font-medium text-slate-700">
                      ใช้ไปแล้ว: {coupon.usageCount}
                    </div>
                    <div className="text-slate-400">
                      จำกัด: {coupon.usageLimit ? `${coupon.usageLimit} ครั้ง` : 'ไม่จำกัด'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'ไม่มีวันหมดอายุ'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(coupon)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "แก้ไขคูปอง" : "สร้างคูปองใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>รหัสคูปอง <span className="text-red-500">*</span></Label>
              <Input 
                placeholder="เช่น NEWYEAR2026" 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="font-mono uppercase font-bold text-lg tracking-wider"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>รายละเอียด</Label>
              <Input 
                placeholder="คำอธิบายสั้นๆ..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>ประเภทส่วนลด <span className="text-red-500">*</span></Label>
              <Select value={formData.discountType} onValueChange={(val: any) => setFormData({...formData, discountType: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">ลดเป็นเปอร์เซ็นต์ (%)</SelectItem>
                  <SelectItem value="fixed">ลดเป็นบาท (฿)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>มูลค่าส่วนลด <span className="text-red-500">*</span></Label>
              <Input 
                type="number"
                min="0"
                value={formData.discountValue || ""}
                onChange={e => setFormData({...formData, discountValue: Number(e.target.value)})}
              />
            </div>
            
            {formData.discountType === "percentage" && (
              <div className="col-span-2 space-y-2">
                <Label>ส่วนลดสูงสุด (บาท) <span className="text-slate-400 font-normal text-xs ml-1">(ปล่อยว่างถ้าไม่จำกัด)</span></Label>
                <Input 
                  type="number"
                  min="0"
                  value={formData.maxDiscount || ""}
                  onChange={e => setFormData({...formData, maxDiscount: e.target.value ? Number(e.target.value) : null})}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>ยอดซื้อขั้นต่ำ (บาท)</Label>
              <Input 
                type="number"
                min="0"
                value={formData.minOrderValue || ""}
                onChange={e => setFormData({...formData, minOrderValue: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>จำกัดสิทธิ์ (ครั้ง) <span className="text-slate-400 font-normal text-xs ml-1">(ปล่อยว่างถ้าไม่จำกัด)</span></Label>
              <Input 
                type="number"
                min="0"
                value={formData.usageLimit || ""}
                onChange={e => setFormData({...formData, usageLimit: e.target.value ? Number(e.target.value) : null})}
              />
            </div>

            <div className="space-y-2">
              <Label>วันหมดอายุ <span className="text-slate-400 font-normal text-xs ml-1">(ปล่อยว่างถ้าไม่มี)</span></Label>
              <Input 
                type="date"
                value={formData.expiresAt ? String(formData.expiresAt).split('T')[0] : ""}
                onChange={e => setFormData({...formData, expiresAt: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 flex flex-col justify-center pt-2">
              <Label className="mb-2">สถานะการใช้งาน</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={formData.isActive}
                  onCheckedChange={checked => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  {formData.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {isEditing ? "บันทึกการแก้ไข" : "สร้างคูปอง"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
