export default function AdminLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 h-24" />
                ))}
            </div>
            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 h-64" />
                    <div className="bg-white rounded-2xl border border-slate-100 h-48" />
                </div>
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 h-64" />
                    <div className="bg-white rounded-2xl border border-slate-100 h-32" />
                </div>
            </div>
        </div>
    );
}
