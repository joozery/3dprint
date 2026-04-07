// Admin Login ต้องการ layout แยกต่างหาก
// เพื่อข้าม auth guard ใน /admin/layout.tsx
// ที่นี่ไม่ต้องมี AdminSidebar หรือ AdminTopbar

export const metadata = {
  title: "Admin Login | PDM 3D Print",
  description: "เข้าสู่ระบบสำหรับผู้ดูแลระบบ PDM 3D Print",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ไม่ wrap ด้วย admin layout ปล่อยให้ page render ตรงๆ
  return <>{children}</>;
}
