import dbConnect from "@/lib/mongoose";
import ServicePage from "@/models/ServicePage";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { 
    Upload, ArrowRight, Clock, ShieldCheck, 
    Box, Users, MapPin, Star, Settings, Truck, Award
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper for dynamic colors
const getColorClasses = (color: string) => {
    switch(color) {
        case 'purple': return {
            gradient: 'from-purple-400 to-purple-600',
            bgIcon: 'bg-purple-50 text-purple-600',
            btnBg: 'bg-purple-600 hover:bg-purple-700',
            btnShadow: 'shadow-purple-600/20 hover:shadow-purple-600/40',
            iconText: 'text-purple-400',
            bgDot: 'bg-purple-500',
            hoverBorder: 'hover:border-purple-200',
            ctaShadow: 'shadow-[0_0_20px_rgba(147,51,234,0.4)]'
        };
        case 'pink': return {
            gradient: 'from-pink-500 via-purple-500 to-indigo-500',
            bgIcon: 'bg-pink-50 text-pink-600',
            btnBg: 'bg-pink-600 hover:bg-pink-700',
            btnShadow: 'shadow-pink-600/20 hover:shadow-pink-600/40',
            iconText: 'text-pink-400',
            bgDot: 'bg-pink-500',
            hoverBorder: 'hover:border-pink-200',
            ctaShadow: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]'
        };
        case 'blue': 
        default: return {
            gradient: 'from-blue-400 to-blue-600',
            bgIcon: 'bg-blue-50 text-blue-600',
            btnBg: 'bg-blue-600 hover:bg-blue-700',
            btnShadow: 'shadow-blue-600/20 hover:shadow-blue-600/40',
            iconText: 'text-blue-400',
            bgDot: 'bg-blue-500',
            hoverBorder: 'hover:border-blue-200',
            ctaShadow: 'shadow-[0_0_20px_rgba(37,99,235,0.4)]'
        };
    }
};

export default async function DynamicServicePage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    const pageData = await ServicePage.findOne({ slug, isActive: true }).lean();
    
    if (!pageData) {
        notFound();
    }

    const c = getColorClasses(pageData.themeColor);

    return (
        <div className="flex flex-col min-h-screen bg-[#fafbfc]">
            <Navbar />
            
            {/* ─── Hero Section ─── */}
            <section 
                className="relative text-white pt-20 pb-32 overflow-hidden bg-[#0b1121]"
                style={{
                    backgroundImage: `url('${pageData.heroImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center right',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1121] via-[#0b1121]/80 to-[#0b1121]/40" />
                
                <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
                    <div className="max-w-xl">
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                            {pageData.title} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${c.gradient}`}>{pageData.subtitle}</span>
                        </h1>
                        
                        <p className="text-slate-300 text-lg leading-relaxed mb-10 font-medium">
                            {pageData.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link 
                                href="/quote" 
                                className={`flex items-center justify-center gap-3 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 ${c.btnBg} ${c.btnShadow}`}
                            >
                                <div className="flex flex-col items-start leading-tight">
                                    <div className="flex items-center gap-2">
                                        <Upload size={18} />
                                        <span>อัปโหลดไฟล์ 3D</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-white/80 mt-0.5">ประเมินราคาใน 1 นาที</span>
                                </div>
                            </Link>
                            
                            <Link 
                                href="/services" 
                                className="flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/50 font-bold px-8 py-4 rounded-xl transition-colors backdrop-blur-sm"
                            >
                                ดูบริการทั้งหมด <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-slate-300">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className={c.iconText} />
                                <span>ประเมินราคาไว<br/><span className="text-[11px] text-slate-400">ภายใน 1 นาที</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Settings size={16} className={c.iconText} />
                                <span>ผลิตไว<br/><span className="text-[11px] text-slate-400">เริ่มต้น 1-3 วัน</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck size={16} className={c.iconText} />
                                <span>จัดส่งทั่วประเทศ<br/><span className="text-[11px] text-slate-400">ปลอดภัย 100%</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Stats Overlapping Banner ─── */}
            <div className="max-w-5xl mx-auto px-4 lg:px-6 relative z-20 -mt-16 w-full">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
                        <div className="flex items-center gap-4 px-2">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.bgIcon}`}>
                                <Box size={24} />
                            </div>
                            <div>
                                <div className="text-xl md:text-2xl font-black text-slate-800">5,000+</div>
                                <div className="text-[11px] font-bold text-slate-500">ชิ้นงานที่ผลิตแล้ว</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-2 md:px-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.bgIcon}`}>
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="text-xl md:text-2xl font-black text-slate-800">300+</div>
                                <div className="text-[11px] font-bold text-slate-500">ลูกค้าไว้วางใจ</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-2 md:px-6">
                            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <div className="text-xl md:text-2xl font-black text-slate-800">40+</div>
                                <div className="text-[11px] font-bold text-slate-500">จังหวัดที่จัดส่ง</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-2 md:px-6">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <Star size={24} className="fill-orange-500" />
                            </div>
                            <div>
                                <div className="text-xl md:text-2xl font-black text-slate-800">4.9/5</div>
                                <div className="text-[11px] font-bold text-slate-500">คะแนนความพึงพอใจ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── What is Technology? ─── */}
            <section className="py-24 px-4 lg:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left: Text Content */}
                        <div>
                            <p className={`${c.iconText} font-bold text-sm tracking-widest uppercase mb-4`}>เกี่ยวกับเทคโนโลยี</p>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6" dangerouslySetInnerHTML={{ __html: pageData.about.title }} />

                            <p className="text-slate-600 leading-[1.95] text-[15px] mb-5">
                                {pageData.about.content}
                            </p>
                            <p className="text-slate-500 leading-[1.95] text-[14px] mb-8">
                                {pageData.about.subContent}
                            </p>

                            <ul className="space-y-4 mb-10">
                                {pageData.about.bullets.map((pt: any, i: number) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 ${c.bgDot}`} />
                                        <div>
                                            <span className="font-bold text-slate-800 text-[14px]">{pt.title} — </span>
                                            <span className="text-slate-500 text-[14px] leading-relaxed">{pt.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: Image */}
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden bg-slate-100" style={{ aspectRatio: "4/3" }}>
                                <Image
                                    src={pageData.about.image}
                                    alt={pageData.about.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── Supported Materials ─── */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">{pageData.materials.title}</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-5">
                        {pageData.materials.items.map((mat: any, i: number) => (
                            <div key={i} className={`bg-white rounded-3xl border border-slate-100 flex flex-col ${c.hoverBorder} hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden group w-full max-w-[240px]`}>
                                <div className="relative w-full h-44 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 pt-6">
                                    <Image 
                                        src={mat.image} 
                                        alt={`${mat.name} Material`} 
                                        fill
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                
                                <div className="flex flex-col flex-1 p-5 pt-4">
                                    <h3 className="text-sm font-black text-slate-800 mb-3">{mat.name}</h3>
                                    <ul className="space-y-1.5 mb-4 flex-1">
                                        {[mat.desc1, mat.desc2, mat.desc3].map((desc, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5 text-[11px] font-medium text-slate-500">
                                                <span className={`${c.iconText} mt-0.5 leading-none`}>•</span>
                                                <span className="leading-snug">{desc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link 
                                        href={`/materials`} 
                                        className={`inline-flex items-center gap-1 text-[11px] font-bold ${c.iconText} hover:gap-2 transition-all`}
                                    >
                                        ดูรายละเอียด <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Process Steps ─── */}
            <section className="py-24 px-4 lg:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">{pageData.process.title}</h2>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-slate-100 border-t-2 border-dashed border-slate-200" />

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative z-10">
                            {pageData.process.steps.map((s: any) => (
                                <div key={s.step} className="flex flex-col items-center text-center group">
                                    <div className={`w-16 h-16 rounded-full border-4 border-white text-xl font-black flex items-center justify-center mb-4 shadow-sm transition-colors ${c.bgIcon} ${c.hoverBorder} group-hover:text-white group-hover:bg-opacity-100`} style={{ backgroundColor: 'var(--tw-gradient-from)', background: 'currentColor' }}>
                                        <span className="text-white mix-blend-difference">{s.step}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-sm mb-1">{s.title}</h3>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium px-2">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Bottom CTA ─── */}
            <section className="px-4 lg:px-6 pb-24">
                <div 
                    className="max-w-6xl mx-auto rounded-[2rem] overflow-hidden relative shadow-2xl bg-[#172136]"
                    style={{
                        backgroundImage: `url('/cover/banner.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="p-10 md:p-14 relative z-10 w-full">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                            พร้อมเริ่มต้นโปรเจกต์ของคุณแล้วหรือยัง?
                        </h2>
                        <p className="text-slate-300 font-medium text-sm mb-8">
                            อัปโหลดไฟล์ 3D เพื่อประเมินราคาและเช็คระยะเวลาผลิตทันที
                        </p>
                        
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            <div className="flex items-center gap-6 shrink-0">
                                <Link 
                                    href="/quote" 
                                    className={`inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl transition-colors ${c.btnBg} ${c.ctaShadow}`}
                                >
                                    <Upload size={18} />
                                    อัปโหลดไฟล์เลย
                                </Link>
                                <span className="text-sm font-medium text-slate-300">หรือ ติดต่อทีมงาน</span>
                            </div>

                            <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                                {/* Badges */}
                                <div className="flex items-center gap-3 bg-[#131b2f]/60 backdrop-blur-sm border border-slate-700/60 rounded-xl px-4 py-2.5">
                                    <Clock size={18} className={c.iconText} strokeWidth={2.5} />
                                    <div className="text-[11px] font-bold text-white leading-tight">
                                        ประเมินราคาไว<br/><span className="text-slate-400 font-medium">ภายใน 1 นาที</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#131b2f]/60 backdrop-blur-sm border border-slate-700/60 rounded-xl px-4 py-2.5">
                                    <Award size={18} className={c.iconText} strokeWidth={2.5} />
                                    <div className="text-[11px] font-bold text-white leading-tight">
                                        ไม่มีขั้นต่ำ<br/><span className="text-slate-400 font-medium">สั่ง 1 ชิ้นก็ทำ</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#131b2f]/60 backdrop-blur-sm border border-slate-700/60 rounded-xl px-4 py-2.5">
                                    <ShieldCheck size={18} className={c.iconText} strokeWidth={2.5} />
                                    <div className="text-[11px] font-bold text-white leading-tight">
                                        ปลอดภัย 100%<br/><span className="text-slate-400 font-medium">ข้อมูลไม่รั่วไหล</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}
