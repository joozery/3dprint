"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Database, 
  Cpu, 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cloud,
  Layers,
  CpuIcon,
  PulseIcon as Pulse,
  History,
  ShieldCheck,
  Package,
  FileText,
  Users
} from "lucide-react";

interface StatusData {
  status: string;
  database: {
    connected: boolean;
    latency: string;
    name: string;
  };
  stats: {
    orders: number;
    users: number;
    quotes: number;
  };
  environment: {
    uptime: string;
    node_version: string;
  };
  services: {
    cloudinary: boolean;
    mongodb: boolean;
  };
  timestamp: string;
}

export default function AdminStatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/status");
      const json = await res.json();
      setData(json);
      setError("");
    } catch {
      setError("Failed to reach health-check endpoint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">สถานะระบบ (Health)</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium italic">Monitor PDM platform services and infrastructure</p>
        </div>
        <button 
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-blue-100 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm disabled:opacity-50 group"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          Refresh Checks
        </button>
      </div>

      {!data && loading ? (
        <div className="py-24 text-center">
            <RefreshCw size={40} className="text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Waking up services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Main Status Indicator */}
          <div className="lg:col-span-2 p-8 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 text-white relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
               <div>
                  <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Overall Status</p>
                  <h2 className="text-3xl font-black flex items-center gap-3">
                    {data?.status === 'online' ? 'Systems Online' : 'Service Degraded'}
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                  </h2>
               </div>
               <Activity size={32} className="text-blue-400 opacity-50 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                   <p className="text-blue-100 text-[9px] font-black uppercase mb-1">Server Latency</p>
                   <p className="text-xl font-bold">{data?.database.latency || '—'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                   <p className="text-blue-100 text-[9px] font-black uppercase mb-1">Server Node</p>
                   <p className="text-xl font-bold">LHR-101</p>
                </div>
            </div>
            
            {/* Background design elements */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-900/40 rounded-full blur-3xl opacity-50" />
          </div>

          {/* Database Health Card */}
          <div className="p-8 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 group hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Database size={24} />
               </div>
               {data?.database.connected ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertTriangle className="text-red-500" size={18}/>}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">MongoDB Database</p>
            <h3 className="text-xl font-black text-slate-900 mt-2">{data?.database.name || 'Disconnected'}</h3>
            <div className="mt-4 flex items-center justify-between">
               <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Connected</span>
               <p className="text-slate-400 text-[10px] font-medium">{data?.database.latency}</p>
            </div>
          </div>

          {/* Uptime Card */}
          <div className="p-8 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5">
             <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6">
                <Clock size={24} />
             </div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Process Uptime</p>
             <h3 className="text-xl font-black text-slate-900 mt-2">{data?.environment.uptime || '0s'}</h3>
             <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Node Version</p>
                <p className="text-slate-900 text-xs font-black mt-2">{data?.environment.node_version}</p>
             </div>
          </div>

          {/* Cloud Services Checkbox */}
          <div className="lg:col-span-2 p-8 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Cloud size={20} />
                 </div>
                 <h2 className="text-slate-900 font-black text-sm uppercase tracking-widest">Integration Services</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className={`p-5 rounded-2xl border flex items-center gap-4 ${data?.services.mongodb ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <Database size={24} className={data?.services.mongodb ? 'text-emerald-500' : 'text-red-500'} />
                    <div>
                       <p className="text-slate-900 text-[11px] font-black uppercase">MongoDB URI</p>
                       <p className={`text-[10px] font-bold ${data?.services.mongodb ? 'text-emerald-600' : 'text-red-600'}`}>
                          {data?.services.mongodb ? 'Configured' : 'Missing'}
                       </p>
                    </div>
                 </div>
                 <div className={`p-5 rounded-2xl border flex items-center gap-4 ${data?.services.cloudinary ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <Cloud size={24} className={data?.services.cloudinary ? 'text-emerald-500' : 'text-red-500'} />
                    <div>
                       <p className="text-slate-900 text-[11px] font-black uppercase">Cloudinary</p>
                       <p className={`text-[10px] font-bold ${data?.services.cloudinary ? 'text-emerald-600' : 'text-red-600'}`}>
                          {data?.services.cloudinary ? 'Configured' : 'Missing'}
                       </p>
                    </div>
                 </div>
              </div>
          </div>

          {/* Content Health Summary */}
          <div className="lg:col-span-2 p-8 bg-white border border-blue-100 rounded-2xl shadow-xl shadow-blue-900/5 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-blue-50 pb-4">Content Repository Monitoring</p>
              <div className="flex items-center justify-around">
                 <div className="text-center group cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform">
                       <Package size={20} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{data?.stats.orders || 0}</p>
                    <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 tracking-widest">Active Orders</p>
                 </div>
                 <div className="text-center group cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto mb-3 group-hover:scale-110 transition-transform">
                       <Users size={20} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{data?.stats.users || 0}</p>
                    <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 tracking-widest">Reg. Users</p>
                 </div>
                 <div className="text-center group cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 mx-auto mb-3 group-hover:scale-110 transition-transform">
                       <FileText size={20} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{data?.stats.quotes || 0}</p>
                    <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 tracking-widest">File Quotes</p>
                 </div>
              </div>
          </div>
        </div>
      )}

      {/* Footer Timestamp */}
      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] justify-center mt-12 pb-12">
         <History size={14} className="opacity-50" />
         Last System Audit at {data?.timestamp ? new Date(data.timestamp).toLocaleString('th-TH') : '...'}
      </div>
    </div>
  );
}
