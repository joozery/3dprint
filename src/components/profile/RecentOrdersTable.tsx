import Link from "next/link";
import { ArrowRight, Clock, Box, FileBox, ExternalLink } from "lucide-react";

interface RecentOrdersTableProps {
    quotes: any[];
}

export function RecentOrdersTable({ quotes }: RecentOrdersTableProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" /> RECENT ACTIVITY
                </h3>
            </div>
            
            {quotes.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                        <FileBox size={24} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold mb-1">No orders yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm">You haven't uploaded any 3D models yet. Start your first precision project to see it here.</p>
                    <Link href="/quote" className="mt-6 font-semibold text-sm text-white bg-blue-600 px-4 py-2 rounded-lg shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                        Upload your first model
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Model File</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date Uploaded</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Detail & Est. Value</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Job Status</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {quotes.map((quote: any) => (
                                <tr key={quote._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center flex-shrink-0 text-indigo-600 shadow-sm">
                                                <Box size={18} />
                                            </div>
                                            <div>
                                                <Link href={`/viewer/${quote._id}`} target="_blank" className="text-sm font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                                                    {quote.originalName || "Unnamed_File.stl"} 
                                                    <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-400" />
                                                </Link>
                                                <span className="text-xs text-slate-500 font-medium">Order ID: #{quote._id.toString().slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-slate-600 font-medium">
                                            {new Date(quote.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{quote.volumeCm3?.toFixed(2) || "0"} cm³</span>
                                            <span className="text-[11px] font-bold text-slate-400">{quote.totalPrice ? `฿${quote.totalPrice.toLocaleString()}` : 'Evaluating Pricing'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Analysis</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link href={`/viewer/${quote._id}`} target="_blank" className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 border border-transparent hover:border-slate-200 transition-all hover:shadow-sm">
                                            <ArrowRight size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
