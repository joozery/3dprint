import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
}

export default function AdminRecentUsers({ users }: { users: User[] }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
            <Users size={16} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-slate-800 text-sm font-bold leading-none">สมาชิกล่าสุด</h3>
            <p className="text-slate-400 text-[11px] mt-1.5 font-medium">ลงทะเบียนใหม่ล่าสุด {users.length} ราย</p>
          </div>
        </div>
        <Link
          href="/admin/users"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11px] font-semibold transition-colors group"
        >
          จัดการสมาชิก
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* User list */}
      <div className="divide-y divide-slate-50">
        {users.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">ไม่มีสมาชิกใหม่</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-slate-50/60 transition-colors group">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {user.image ? (
                  <Image src={user.image} alt={user.name} width={36} height={36} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-slate-500 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 font-semibold text-sm truncate group-hover:text-slate-900 transition-colors">{user.name}</p>
                <p className="text-slate-400 text-[11px] truncate mt-0.5">{user.email}</p>
              </div>

              {/* Role + Date */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                  user.role === "admin"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {user.role}
                </span>
                <span className="text-slate-300 text-[11px] hidden sm:block">
                  {new Date(user.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
