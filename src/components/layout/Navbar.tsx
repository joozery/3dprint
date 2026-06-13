"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import {
    Search, ShoppingCart, Menu, X, User as UserIcon, LogOut, ArrowRight,
    ChevronDown, Globe, Printer, Droplets, Palette, ScanLine, Layers,
    CircuitBoard, Sparkles, Leaf, Flame, Shield, FlaskConical, Zap,
    Box, BookOpen, HelpCircle, FileText, MessageCircle, Inbox,
    Building2, Factory, Users, Briefcase, TreePine, Phone,
    LayoutGrid, Wrench, Gem, Upload, ChevronRight, type LucideProps,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LANG_META } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// ─── Shared sub-component ────────────────────────────────────────────────────

function StandardItem({ href, icon: Icon, label, onClick }: { href: string; icon: React.FC<LucideProps>; label: string; onClick?: () => void; }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="group flex flex-row items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 active:bg-slate-100 no-underline"
        >
            <Icon size={16} className="text-slate-400 shrink-0 group-hover:text-blue-600 transition-colors" />
            <span className="text-[13px] font-medium text-slate-700 group-hover:text-blue-600">{label}</span>
        </Link>
    );
}

function MobileItem({
    href,
    icon: Icon,
    label,
    desc,
    onClick,
}: {
    href: string;
    icon: React.FC<LucideProps>;
    label: string;
    desc: string;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-blue-50 active:scale-[0.98] transition-all"
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon size={15} />
            </span>
            <div>
                <div className="text-sm font-semibold text-slate-800">{label}</div>
                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{desc}</div>
            </div>
        </Link>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const { data: session, status } = useSession();
    const [cartCount, setCartCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const { lang, t, setLang } = useLanguage();

    const close = () => setMobileOpen(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchCartCount = async () => {
            try {
                const localIds = JSON.parse(localStorage.getItem("guest_quote_ids") || "[]");
                if (localIds.length === 0) { setCartCount(0); return; }
                const res = await fetch(`/api/quote/pending?ids=${localIds.join(",")}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) setCartCount(data.quotes.length);
                }
            } catch { /* silent */ }
        };
        fetchCartCount();
        const handleStorage = () => fetchCartCount();
        window.addEventListener("storage", handleStorage);
        window.addEventListener("cart_updated", handleStorage);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("cart_updated", handleStorage);
        };
    }, [session]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center shrink-0 group">
                    <Image
                        src="/logo/logo.png"
                        alt="Print My Design Logo"
                        width={160} height={60} priority
                        className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className="hidden lg:flex items-center">
                    {isMounted && (
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList className="gap-0">

                                {/* ── บริการ ── */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-transparent text-slate-600 hover:text-blue-600 text-sm font-medium h-10 px-3">
                                        {t.nav.services}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[240px] p-2 shadow-lg rounded-xl bg-white border border-slate-100 flex flex-col gap-0.5">
                                            <StandardItem href="/services/fdm" icon={Printer} label={t.services.fdm} />
                                            <StandardItem href="/services/sla" icon={Droplets} label={t.services.sla} />
                                            <StandardItem href="/services/multicolor" icon={Palette} label={t.services.multicolor} />
                                            <StandardItem href="/services/scanning" icon={ScanLine} label={t.services.scanning} />
                                            <StandardItem href="/services/sheet-metal" icon={Layers} label={t.services.sheetMetal} />
                                            <StandardItem href="/services/pcb" icon={CircuitBoard} label={t.services.pcb} />
                                            <StandardItem href="/services/post-process" icon={Sparkles} label={t.services.postProcess} />
                                            
                                            <div className="h-px bg-slate-100 my-1 mx-2" />
                                            
                                            <Link href="/services" className="flex flex-row items-center justify-between px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg mx-1 transition-colors">
                                                ดูบริการทั้งหมด <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* ── วัสดุ ── */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-transparent text-slate-600 hover:text-blue-600 text-sm font-medium h-10 px-3">
                                        {t.nav.materials}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[420px] p-2 flex flex-col gap-0.5 shadow-lg rounded-xl bg-white border border-slate-100">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        {t.materials.filamentLabel}
                                                    </p>
                                                    <StandardItem href="/materials/pla" icon={Leaf} label={t.materials.pla} />
                                                    <StandardItem href="/materials/abs" icon={Flame} label={t.materials.abs} />
                                                    <StandardItem href="/materials/petg" icon={Shield} label={t.materials.petg} />
                                                    <StandardItem href="/materials/tpu" icon={Zap} label={t.materials.tpu} />
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        {t.materials.resinLabel}
                                                    </p>
                                                    <StandardItem href="/materials/resin" icon={FlaskConical} label={t.materials.resin} />
                                                    <StandardItem href="/materials/engineering-resin" icon={Box} label={t.materials.engResin} />
                                                    <StandardItem href="/materials/nylon" icon={Layers} label={t.materials.nylon} />
                                                </div>
                                            </div>
                                            <div className="h-px bg-slate-100 my-1 mx-2" />
                                            <Link href="/materials" className="flex flex-row items-center justify-between px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg mx-1 transition-colors">
                                                {t.materials.guideCta} <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* ── โมเดล 3D ฟรี ── */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-transparent text-slate-600 hover:text-blue-600 text-sm font-medium h-10 px-3">
                                        {t.nav.freeModels}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[200px] p-2 flex flex-col gap-0.5 shadow-lg rounded-xl bg-white border border-slate-100">
                                            <StandardItem href="/models" icon={LayoutGrid} label={t.models.gallery} />
                                            <StandardItem href="/models/functional" icon={Wrench} label={t.models.functional} />
                                            <StandardItem href="/models/decorative" icon={Gem} label={t.models.decorative} />
                                            <StandardItem href="/models/upload" icon={Upload} label={t.models.upload} />
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* ── ช่วยเหลือ ── */}
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-transparent text-slate-600 hover:text-blue-600 text-sm font-medium h-10 px-3">
                                        {t.nav.support}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[380px] p-2 shadow-lg rounded-xl bg-white border border-slate-100">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        {t.support.resourcesLabel}
                                                    </p>
                                                    <StandardItem href="/support/guide" icon={BookOpen} label={t.support.guide} />
                                                    <StandardItem href="/support/faq" icon={HelpCircle} label={t.support.faq} />
                                                    <StandardItem href="/support/blog" icon={FileText} label={t.support.blog} />
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                        {t.support.contactLabel}
                                                    </p>
                                                    <StandardItem href="/support/chat" icon={MessageCircle} label={t.support.chat} />
                                                    <StandardItem href="/support/ticket" icon={Inbox} label={t.support.ticket} />
                                                    <StandardItem href="/support/contact" icon={Phone} label={t.support.contact} />
                                                </div>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* ── เกี่ยวกับเรา ── */}
                                <NavigationMenuItem>
                                    <Link
                                        href="/about"
                                        className="inline-flex items-center h-10 px-3 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors rounded-md"
                                    >
                                        {t.nav.about}
                                    </Link>
                                </NavigationMenuItem>

                            </NavigationMenuList>
                        </NavigationMenu>
                    )}
                </nav>

                {/* ── Right Actions ── */}
                <div className="flex items-center gap-1.5">

                    {/* Language */}
                    {isMounted && (
                        <div className="hidden lg:flex items-center mr-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex h-9 items-center gap-1.5 px-3 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-xs border border-slate-100 shadow-sm active:scale-95 cursor-pointer bg-white">
                                        <span className="text-sm leading-none">{LANG_META[lang].flag}</span>
                                        <span className="leading-none">{LANG_META[lang].label}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36 mt-2 rounded-xl p-1.5 shadow-xl border-slate-100 bg-white">
                                    {Object.entries(LANG_META).map(([key, meta]) => (
                                        <DropdownMenuItem
                                            key={key}
                                            onClick={() => setLang(key as any)}
                                            className={cn(
                                                "cursor-pointer rounded-lg py-2 px-2.5 text-xs font-bold transition-all flex items-center justify-between",
                                                lang === key ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{meta.flag}</span>
                                                <span>{meta.name}</span>
                                            </div>
                                            {lang === key && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}

                    <button className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Search size={18} />
                    </button>

                    <Link href="/quote" className="relative hidden lg:flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <ShoppingCart size={18} />
                        {isMounted && cartCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden lg:inline-flex border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded-full px-4"
                        asChild
                    >
                        <Link href="/quote">{t.nav.orderNow}</Link>
                    </Button>

                    {/* Auth */}
                    {status === "loading" ? (
                        <div className="hidden lg:flex items-center ml-2 pl-2 border-l border-slate-200">
                            <div className="w-24 h-10 bg-slate-100 rounded-full animate-pulse ml-2" />
                        </div>
                    ) : session ? (
                        <div className="hidden lg:flex items-center ml-2 pl-2 border-l border-slate-200">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2.5 h-10 px-2 bg-transparent hover:bg-slate-100 rounded-full select-none outline-none">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden border border-blue-200 shrink-0">
                                            {session.user?.image ? (
                                                <Image src={session.user.image} alt={session.user.name || "User"} width={32} height={32} className="object-cover" />
                                            ) : (
                                                session.user?.name?.charAt(0).toUpperCase() || <UserIcon size={16} />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate pr-1">
                                            {session.user?.name || "Member"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60 mt-2 rounded-xl p-2 shadow-xl border-slate-100 bg-white">
                                    <DropdownMenuLabel className="font-normal px-2 py-1.5 pb-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold leading-none text-slate-800 truncate">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-slate-500 truncate">{session.user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-100 mb-1" />
                                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-blue-50 focus:bg-blue-50 py-2.5" asChild>
                                        <Link href="/profile" className="flex items-center w-full text-slate-700 font-medium h-full">
                                            <UserIcon className="w-4 h-4 mr-2.5 text-slate-400" />
                                            {t.nav.myAccount}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-blue-50 focus:bg-blue-50 py-2.5" asChild>
                                        <Link href="/orders" className="flex items-center w-full text-slate-700 font-medium h-full">
                                            <ShoppingCart className="w-4 h-4 mr-2.5 text-slate-400" />
                                            {t.nav.myOrders}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                    <DropdownMenuItem
                                        className="cursor-pointer rounded-lg text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 py-2.5 font-medium"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        <LogOut className="w-4 h-4 mr-2.5" />
                                        {t.nav.logout}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="hidden lg:inline-flex bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 ml-2 shadow-md shadow-blue-200"
                            asChild
                        >
                            <Link href="/login">{t.nav.login}</Link>
                        </Button>
                    )}

                    {/* Mobile toggle */}
                    <button
                        className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {mobileOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full max-h-[calc(100dvh-4rem)] overflow-y-auto bg-white border-t border-slate-100 shadow-xl z-40">
                    <div className="px-4 pb-6 pt-3">

                        {/* Language */}
                        {isMounted && (
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl mb-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Language
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {(Object.keys(LANG_META) as Array<keyof typeof LANG_META>).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setLang(key)}
                                            className={cn(
                                                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
                                                lang === key ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                                            )}
                                        >
                                            <span className="mr-1">{LANG_META[key].flag}</span>
                                            {LANG_META[key].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* User info */}
                        {status === "loading" ? (
                            <div className="h-20 w-full bg-slate-100 rounded-2xl animate-pulse mb-3" />
                        ) : session ? (
                            <div className="flex flex-col gap-1 mb-2">
                                <Link href="/profile" onClick={close}
                                    className="flex items-center gap-3 px-3 py-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100/60 shadow-sm active:scale-[0.98] transition-all"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-white shadow-md shadow-blue-200 shrink-0">
                                        {session.user?.image ? (
                                            <Image src={session.user.image} alt={session.user.name || "User"} width={48} height={48} className="object-cover" />
                                        ) : (
                                            session.user?.name?.charAt(0).toUpperCase() || <UserIcon size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-[15px] font-black text-slate-800 leading-tight">{t.nav.dashboard}</div>
                                        <div className="text-xs font-bold text-blue-600 mt-0.5">{session.user?.name}</div>
                                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{session.user?.email}</div>
                                    </div>
                                    <ArrowRight size={18} className="text-blue-400 ml-2 shrink-0" />
                                </Link>
                                <div className="grid grid-cols-2 gap-2 mt-2 px-1">
                                    <Link href="/profile" onClick={close} className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors">
                                        <UserIcon size={18} className="text-blue-500" />
                                        <span className="text-xs font-bold text-slate-700">{t.nav.myAccount}</span>
                                    </Link>
                                    <Link href="/orders" onClick={close} className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors">
                                        <ShoppingCart size={18} className="text-indigo-500" />
                                        <span className="text-xs font-bold text-slate-700">{t.nav.myOrders}</span>
                                    </Link>
                                </div>
                                <div className="h-px bg-slate-100 my-3 mx-2" />
                            </div>
                        ) : null}

                        {/* Nav sections with accordions */}
                        <nav className="flex flex-col gap-0.5">
                            {/* Services */}
                            <MobileSection
                                label={t.nav.services}
                                expanded={mobileExpanded === "services"}
                                onToggle={() => setMobileExpanded(mobileExpanded === "services" ? null : "services")}
                            >
                                <MobileItem href="/services/fdm" icon={Printer} label={t.services.fdm} desc={t.services.fdmDesc} onClick={close} />
                                <MobileItem href="/services/sla" icon={Droplets} label={t.services.sla} desc={t.services.slaDesc} onClick={close} />
                                <MobileItem href="/services/multicolor" icon={Palette} label={t.services.multicolor} desc={t.services.multicolorDesc} onClick={close} />
                                <MobileItem href="/services/scanning" icon={ScanLine} label={t.services.scanning} desc={t.services.scanningDesc} onClick={close} />
                                <MobileItem href="/services/sheet-metal" icon={Layers} label={t.services.sheetMetal} desc={t.services.sheetMetalDesc} onClick={close} />
                                <MobileItem href="/services/pcb" icon={CircuitBoard} label={t.services.pcb} desc={t.services.pcbDesc} onClick={close} />
                                <MobileItem href="/services/post-process" icon={Sparkles} label={t.services.postProcess} desc={t.services.postProcessDesc} onClick={close} />
                            </MobileSection>

                            {/* Materials */}
                            <MobileSection
                                label={t.nav.materials}
                                expanded={mobileExpanded === "materials"}
                                onToggle={() => setMobileExpanded(mobileExpanded === "materials" ? null : "materials")}
                            >
                                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.materials.filamentLabel}</p>
                                <MobileItem href="/materials/pla" icon={Leaf} label={t.materials.pla} desc={t.materials.plaDesc} onClick={close} />
                                <MobileItem href="/materials/abs" icon={Flame} label={t.materials.abs} desc={t.materials.absDesc} onClick={close} />
                                <MobileItem href="/materials/petg" icon={Shield} label={t.materials.petg} desc={t.materials.petgDesc} onClick={close} />
                                <MobileItem href="/materials/tpu" icon={Zap} label={t.materials.tpu} desc={t.materials.tpuDesc} onClick={close} />
                                <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.materials.resinLabel}</p>
                                <MobileItem href="/materials/resin" icon={FlaskConical} label={t.materials.resin} desc={t.materials.resinDesc} onClick={close} />
                                <MobileItem href="/materials/engineering-resin" icon={Box} label={t.materials.engResin} desc={t.materials.engResinDesc} onClick={close} />
                                <MobileItem href="/materials/nylon" icon={Layers} label={t.materials.nylon} desc={t.materials.nylonDesc} onClick={close} />
                            </MobileSection>

                            {/* Free Models */}
                            <MobileSection
                                label={t.nav.freeModels}
                                expanded={mobileExpanded === "models"}
                                onToggle={() => setMobileExpanded(mobileExpanded === "models" ? null : "models")}
                            >
                                <div className="pt-1 grid grid-cols-2 gap-1">
                                    <MobileItem href="/models" icon={LayoutGrid} label={t.models.gallery} desc={t.models.galleryDesc} onClick={close} />
                                    <MobileItem href="/models/functional" icon={Wrench} label={t.models.functional} desc={t.models.functionalDesc} onClick={close} />
                                    <MobileItem href="/models/decorative" icon={Gem} label={t.models.decorative} desc={t.models.decorativeDesc} onClick={close} />
                                    <MobileItem href="/models/upload" icon={Upload} label={t.models.upload} desc={t.models.uploadDesc} onClick={close} />
                                </div>
                            </MobileSection>

                            {/* Help */}
                            <MobileSection
                                label={t.nav.support}
                                expanded={mobileExpanded === "support"}
                                onToggle={() => setMobileExpanded(mobileExpanded === "support" ? null : "support")}
                            >
                                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.support.resourcesLabel}</p>
                                <MobileItem href="/support/guide" icon={BookOpen} label={t.support.guide} desc={t.support.guideDesc} onClick={close} />
                                <MobileItem href="/support/faq" icon={HelpCircle} label={t.support.faq} desc={t.support.faqDesc} onClick={close} />
                                <MobileItem href="/support/blog" icon={FileText} label={t.support.blog} desc={t.support.blogDesc} onClick={close} />
                                <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.support.contactLabel}</p>
                                <MobileItem href="/support/chat" icon={MessageCircle} label={t.support.chat} desc={t.support.chatDesc} onClick={close} />
                                <MobileItem href="/support/ticket" icon={Inbox} label={t.support.ticket} desc={t.support.ticketDesc} onClick={close} />
                                <MobileItem href="/support/contact" icon={Phone} label={t.support.contact} desc={t.support.contactDesc} onClick={close} />
                            </MobileSection>

                            {/* About */}
                            <MobileSection
                                label={t.nav.about}
                                expanded={mobileExpanded === "about"}
                                onToggle={() => setMobileExpanded(mobileExpanded === "about" ? null : "about")}
                            >
                                <div className="pt-1">
                                    <MobileItem href="/about" icon={Building2} label={t.about.company} desc={t.about.companyDesc} onClick={close} />
                                    <MobileItem href="/about/factory" icon={Factory} label={t.about.factory} desc={t.about.factoryDesc} onClick={close} />
                                    <MobileItem href="/about/team" icon={Users} label={t.about.team} desc={t.about.teamDesc} onClick={close} />
                                    <MobileItem href="/about/careers" icon={Briefcase} label={t.about.careers} desc={t.about.careersDesc} onClick={close} />
                                    <MobileItem href="/about/sustainability" icon={TreePine} label={t.about.sustainability} desc={t.about.sustainabilityDesc} onClick={close} />
                                    <MobileItem href="/support/contact" icon={Phone} label={t.about.contact} desc={t.about.contactDesc} onClick={close} />
                                </div>
                            </MobileSection>
                        </nav>

                        {/* CTA / auth */}
                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
                            <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 h-10 rounded-xl" asChild>
                                <Link href="/quote" onClick={close}>{t.nav.orderNow}</Link>
                            </Button>
                            {status === "loading" ? (
                                <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                            ) : session ? (
                                <Button size="sm" variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-700 h-10 rounded-xl"
                                    onClick={() => { signOut({ callbackUrl: "/" }); close(); }}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    {t.nav.logout}
                                </Button>
                            ) : (
                                <Button size="sm" className="w-full bg-blue-600 text-white h-10 rounded-xl" asChild>
                                    <Link href="/login" onClick={close}>{t.nav.loginRegister}</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

// ─── Mobile accordion section ─────────────────────────────────────────────────
function MobileSection({
    label,
    expanded,
    onToggle,
    children,
}: {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className={cn(
                    "flex w-full items-center justify-between px-3 py-3 text-sm font-semibold transition-colors",
                    expanded ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-50"
                )}
            >
                {label}
                <ChevronDown
                    size={16}
                    className={cn("text-slate-400 transition-transform duration-200", expanded && "rotate-180 text-blue-500")}
                />
            </button>
            {expanded && (
                <div className="bg-slate-50/60 px-1 pb-2">
                    {children}
                </div>
            )}
        </div>
    );
}
