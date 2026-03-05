"use client";

import Link from "next/link";
import { useState } from "react";
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
import { Search, ShoppingCart, Menu, X } from "lucide-react";

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

                    <Button
                        size="sm"
                        className="hidden lg:inline-flex bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 shadow-md shadow-blue-200"
                        asChild
                    >
                        <Link href="/login">เข้าสู่ระบบ</Link>
                    </Button>

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
                <div className="lg:hidden border-t border-slate-100 bg-white px-4 pb-4">
                    <nav className="flex flex-col gap-1 pt-3">
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
                        <div className="mt-3 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 border-blue-600 text-blue-600" asChild>
                                <Link href="/quote">สั่งพิมพ์เลย</Link>
                            </Button>
                            <Button size="sm" className="flex-1 bg-blue-600 text-white" asChild>
                                <Link href="/login">เข้าสู่ระบบ</Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
