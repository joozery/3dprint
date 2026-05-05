import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const metadata = {
  title: "Admin Dashboard | PDM 3D Print",
  description: "ระบบจัดการหลังบ้าน PDM 3D Print Thailand",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!(session?.user as any)?.id) {
    redirect("/admin/login");
  }

  await dbConnect();
  const userId = session ? (session.user as any).id : null;
  const user = await User.findById(userId).lean();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative print:block print:h-auto print:overflow-visible print:bg-white">
      <div className="print:hidden h-full flex shrink-0 border-r border-slate-200 bg-white">
         <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible">
        <div className="print:hidden">
          <AdminTopbar user={{ name: user.name, email: user.email, image: user.image }} />
        </div>
        <main className="flex-1 overflow-y-auto p-6 print:block print:overflow-visible print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
