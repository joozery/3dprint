"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Activity, CheckCircle2, XCircle, Clock, AlertTriangle, Cpu, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

type JobStatus = "pending" | "processing" | "done" | "failed";

interface SlicerJob {
  id: string;
  fileName: string;
  originalName: string;
  userId: string;
  status: JobStatus;
  step: string;
  startedAt: number;
  finishedAt?: number;
  durationMs?: number;
  error?: string;
}

interface Summary {
  active: number;
  done: number;
  failed: number;
  stuck: number;
  total: number;
}

const STUCK_MS = 5 * 60 * 1000;
const POLL_MS  = 3000;

function statusBadge(job: SlicerJob) {
  const isStuck =
    (job.status === "pending" || job.status === "processing") &&
    Date.now() - job.startedAt > STUCK_MS;

  if (isStuck)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
        <AlertTriangle className="w-3 h-3" /> ค้าง
      </span>
    );

  switch (job.status) {
    case "processing":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> กำลังประมวลผล
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
          <Clock className="w-3 h-3" /> รอคิว
        </span>
      );
    case "done":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> เสร็จสิ้น
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
          <XCircle className="w-3 h-3" /> ล้มเหลว
        </span>
      );
  }
}

function formatDuration(ms?: number): string {
  if (!ms) return "-";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function elapsed(startedAt: number): string {
  return formatDuration(Date.now() - startedAt);
}

export default function SlicerQueuePage() {
  const [jobs, setJobs]       = useState<SlicerJob[]>([]);
  const [summary, setSummary] = useState<Summary>({ active: 0, done: 0, failed: 0, stuck: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [, setTick] = useState(0); // force re-render for elapsed time

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/slicer-queue");
      if (!res.ok) return;
      const data = await res.json();
      setJobs(data.jobs || []);
      setSummary(data.summary || {});
      setLastUpdate(new Date());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto polling
  useEffect(() => {
    fetchQueue();
    if (!autoRefresh) return;
    const id = setInterval(fetchQueue, POLL_MS);
    return () => clearInterval(id);
  }, [fetchQueue, autoRefresh]);

  // Tick every second to update elapsed time display
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const activeJobs = jobs.filter(j => j.status === "pending" || j.status === "processing");
  const historyJobs = jobs.filter(j => j.status === "done" || j.status === "failed");

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            Monitor คิว PrusaSlicer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ติดตามสถานะการวิเคราะห์โมเดล 3D แบบ real-time
            {lastUpdate && (
              <span className="ml-2 text-slate-400">
                · อัปเดตล่าสุด {lastUpdate.toLocaleTimeString("th-TH")}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(p => !p)}
            className={`gap-2 ${autoRefresh ? "border-blue-200 text-blue-600 bg-blue-50" : "text-slate-500"}`}
          >
            <Activity className={`w-4 h-4 ${autoRefresh ? "text-blue-500" : "text-slate-400"}`} />
            {autoRefresh ? "Auto (3s)" : "หยุด Auto"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchQueue}
            disabled={loading}
            className="h-9 w-9 border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">กำลังทำงาน</p>
          <p className="text-3xl font-black text-blue-600 mt-1">{summary.active}</p>
          <p className="text-xs text-slate-400 mt-1">jobs</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">เสร็จสิ้น</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{summary.done}</p>
          <p className="text-xs text-slate-400 mt-1">jobs</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ล้มเหลว</p>
          <p className="text-3xl font-black text-red-500 mt-1">{summary.failed}</p>
          <p className="text-xs text-slate-400 mt-1">jobs</p>
        </div>
        <div className={`border rounded-xl p-5 shadow-sm ${summary.stuck > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-slate-200"}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${summary.stuck > 0 ? "text-orange-600" : "text-slate-500"}`}>ค้าง (&gt;5 นาที)</p>
          <p className={`text-3xl font-black mt-1 ${summary.stuck > 0 ? "text-orange-600" : "text-slate-400"}`}>{summary.stuck}</p>
          {summary.stuck > 0 && (
            <p className="text-xs text-orange-500 mt-1 font-bold">⚠ ต้องตรวจสอบ!</p>
          )}
          {summary.stuck === 0 && <p className="text-xs text-slate-400 mt-1">jobs</p>}
        </div>
      </div>

      {/* Active Jobs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="font-bold text-slate-800">กำลังประมวลผล ({activeJobs.length})</h2>
        </div>

        {activeJobs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">ไม่มีงานที่กำลังประมวลผล</p>
            <p className="text-sm mt-1">เมื่อผู้ใช้อัปโหลดไฟล์ 3D งานจะปรากฏที่นี่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left">ไฟล์</th>
                  <th className="px-6 py-3 text-left">สถานะ</th>
                  <th className="px-6 py-3 text-left">ขั้นตอนปัจจุบัน</th>
                  <th className="px-6 py-3 text-left">เวลาที่ใช้</th>
                  <th className="px-6 py-3 text-left">User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeJobs.map(job => {
                  const isStuck = Date.now() - job.startedAt > STUCK_MS;
                  return (
                    <tr key={job.id} className={isStuck ? "bg-orange-50" : "bg-blue-50/30"}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 truncate max-w-[200px]" title={job.originalName}>
                          {job.originalName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">{job.id}</div>
                      </td>
                      <td className="px-6 py-4">{statusBadge(job)}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-medium">
                          {job.step}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono font-bold text-sm ${isStuck ? "text-orange-600" : "text-slate-700"}`}>
                          {elapsed(job.startedAt)}
                        </span>
                        {isStuck && <p className="text-xs text-orange-500 font-bold">อาจค้าง!</p>}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono truncate max-w-[120px]">
                        {job.userId}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">ประวัติงาน ({historyJobs.length})</h2>
        </div>

        {historyJobs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">ยังไม่มีประวัติงาน</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left">ไฟล์</th>
                  <th className="px-6 py-3 text-left">สถานะ</th>
                  <th className="px-6 py-3 text-left">ระยะเวลา</th>
                  <th className="px-6 py-3 text-left">เสร็จเมื่อ</th>
                  <th className="px-6 py-3 text-left">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 truncate max-w-[200px]" title={job.originalName}>
                        {job.originalName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">{job.id}</div>
                    </td>
                    <td className="px-6 py-4">{statusBadge(job)}</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-700 font-bold">
                      {formatDuration(job.durationMs)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {job.finishedAt
                        ? new Date(job.finishedAt).toLocaleString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-xs text-red-500 max-w-[200px] truncate" title={job.error}>
                      {job.error || "-"}
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
