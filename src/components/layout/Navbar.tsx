"use client";

import Link from "next/link";
import { useState } from "react";
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
import { Search, ShoppingCart, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
    {
        label: "บริการ",
        href: "/services",
        children: [
            { label: "FDM Printing (เส้นพลาสติก)", href: "/services/fdm", desc: "ราคาประหยัด เหมาะกับต้นแบบ" },
            { label: "SLA Resin (เรซิ่น)", href: "/services/sla", desc: "ความละเอียดสูง พื้นผิวเนียน" },
            { label: "Multi-color", href: "/services/multicolor", desc: "พิมพ์หลายสีในชิ้นเดียว" },
        ],
    },
    {
        label: "วัสดุ",
        href: "/materials",
        children: [
            { label: "PLA", href: "/materials/pla", desc: "เป็นมิตรกับสิ่งแวดล้อม" },
            { label: "ABS", href: "/materials/abs", desc: "ทนความร้อน แข็งแรง" },
            { label: "PETG", href: "/materials/petg", desc: "ยืดหยุ่น ทนสารเคมี" },
            { label: "Resin", href: "/materials/resin", desc: "ละเอียดสูง" },
        ],
    },
    { label: "โมเดล 3D ฟรี", href: "/models" },
    {
        label: "ช่วยเหลือ",
        href: "/support",
        children: [
            { label: "คู่มือการใช้งาน", href: "/support/guide", desc: "เริ่มต้นใช้งานระบบ" },
            { label: "FAQ", href: "/support/faq", desc: "คำถามที่พบบ่อย" },
            { label: "ติดต่อเรา", href: "/support/contact", desc: "พูดคุยกับทีมงาน" },
        ],
    },
    { label: "เกี่ยวกับเรา", href: "/about" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo/3dev.png"
                        alt="3DEV Logo"
                        width={120}
                        height={36}
                        priority
                        className="h-9 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-0">
                            {navLinks.map((link) =>
                                link.children ? (
                                    <NavigationMenuItem key={link.label}>
                                        <NavigationMenuTrigger className="bg-transparent text-slate-600 hover:text-blue-600 text-sm font-medium h-10 px-3">
                                            {link.label}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[320px] gap-1 p-3">
                                                {link.children.map((child) => (
                                                    <li key={child.label}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={child.href}
                                                                className="block select-none rounded-md px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                            >
                                                                <div className="text-sm font-medium text-slate-800">{child.label}</div>
                                                                <div className="text-xs text-slate-500 mt-0.5">{child.desc}</div>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                ) : (
                                    <NavigationMenuItem key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="inline-flex items-center px-3 h-10 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </NavigationMenuItem>
                                )
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <button className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Search size={18} />
                    </button>
                    <button className="relative hidden lg:flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <ShoppingCart size={18} />
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                            0
                        </span>
                    </button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden lg:inline-flex border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded-full px-4"
                        asChild
                    >
                        <Link href="/quote">สั่งพิมพ์เลย</Link>
                    </Button>

                    {/* Auth Status (Desktop) */}
                    {session ? (
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
                                        <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate hide-mobile pr-1">
                                            {session.user?.name || "Member"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60 mt-2 rounded-xl p-2 shadow-xl border-slate-100">
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
                                            บัญชีของฉัน
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-blue-50 focus:bg-blue-50 py-2.5" asChild>
                                        <Link href="/orders" className="flex items-center w-full text-slate-700 font-medium h-full">
                                            <ShoppingCart className="w-4 h-4 mr-2.5 text-slate-400" />
                                            ออเดอร์ของฉัน
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                    <DropdownMenuItem className="cursor-pointer rounded-lg text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 py-2.5 font-medium" onClick={() => signOut({ callbackUrl: "/" })}>
                                        <LogOut className="w-4 h-4 mr-2.5" />
                                        ออกจากระบบ
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
                            <Link href="/login">เข้าสู่ระบบ</Link>
                        </Button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-slate-100 bg-white px-4 pb-4 shadow-xl absolute w-full top-16 left-0">
                    <nav className="flex flex-col gap-1 pt-3">
                        {/* User info on Mobile if logged in */}
                        {session && (
                            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden border border-blue-200">
                                    {session.user?.image ? (
                                        <Image src={session.user.image} alt={session.user.name || "User"} width={40} height={40} className="object-cover" />
                                    ) : (
                                        session.user?.name?.charAt(0).toUpperCase() || <UserIcon size={20} />
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{session.user?.name}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{session.user?.email}</div>
                                </div>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
                            <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 h-10" asChild>
                                <Link href="/quote" onClick={() => setMobileOpen(false)}>สั่งพิมพ์ 3D เลย</Link>
                            </Button>
                            
                            {session ? (
                                <Button size="sm" variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-700 h-10" onClick={() => signOut({ callbackUrl: "/" })}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    ออกจากระบบ
                                </Button>
                            ) : (
                                <Button size="sm" className="w-full bg-blue-600 text-white h-10" asChild>
                                    <Link href="/login" onClick={() => setMobileOpen(false)}>เข้าสู่ระบบ / สมัครสมาชิก</Link>
                                </Button>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
