"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  Loader2,
} from "lucide-react";

type Subscriber = {
  _id: string;
  email: string;
  isActive: boolean;
  source: string;
  createdAt: string;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportToCSV(subscribers: Subscriber[]) {
  const header = ["Email", "วันที่สมัคร", "สถานะ", "แหล่งที่มา"];
  const rows = subscribers.map((s) => [
    s.email,
    new Date(s.createdAt).toISOString(),
    s.isActive ? "Active" : "Inactive",
    s.source,
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob(["﻿" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "subscribers.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      } else {
        setError("ไม่สามารถโหลดข้อมูลได้");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบ subscriber นี้?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSubscribers((prev) =>
          prev.map((s) => (s._id === id ? { ...s, isActive: false } : s))
        );
      }
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setDeletingId(null);
    }
  };

  const totalCount = subscribers.length;
  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Admin / Newsletter
          </p>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            จัดการ Newsletter Subscribers
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubscribers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            รีเฟรช
          </button>
          <button
            onClick={() => exportToCSV(subscribers)}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm disabled:opacity-40"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              ทั้งหมด
            </p>
            <p className="text-2xl font-black text-slate-800">{totalCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Mail size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Active
            </p>
            <p className="text-2xl font-black text-slate-800">{activeCount}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
            <XCircle size={36} className="text-red-400" />
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchSubscribers}
              className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              ลองอีกครั้ง
            </button>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <Mail size={40} className="opacity-40" />
            <p className="font-semibold text-slate-500">ยังไม่มี subscriber</p>
            <p className="text-sm">เมื่อมีผู้สมัครรับข่าวสาร จะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    วันที่สมัคร
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    สถานะ
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Mail size={14} className="text-blue-500" />
                        </div>
                        <span className="font-medium text-slate-700">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(subscriber.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {subscriber.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={11} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          <XCircle size={11} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {subscriber.isActive && (
                        <button
                          onClick={() => handleDelete(subscriber._id)}
                          disabled={deletingId === subscriber._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all disabled:opacity-50"
                        >
                          {deletingId === subscriber._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          ลบ
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
