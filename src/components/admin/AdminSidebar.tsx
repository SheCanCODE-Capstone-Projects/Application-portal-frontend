// src/components/admin/AdminSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard, Users, GraduationCap, FileText,
    Bell, ShieldAlert, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Cohorts", href: "/admin/cohorts", icon: GraduationCap },
    { title: "Applications", href: "/admin/applications", icon: FileText },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Notifications", href: "/admin/notifications", icon: Bell, badge: 3 },
    { title: "System Rejects", href: "/admin/system-reject", icon: ShieldAlert },
];

export function AdminSidebar({
                                 className,
                                 isCollapsed,
                                 setIsCollapsed
                             }: {
    className?: string;
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
}) {
    const pathname = usePathname();

    return (
        <div className={cn(
            "relative flex h-full flex-col bg-[#2f573d] text-emerald-50 border-r border-emerald-800 transition-all duration-300 ease-in-out shadow-xl",
            isCollapsed ? "w-20" : "w-[280px]",
            className
        )}>
            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 z-50 h-6 w-6 rounded-full bg-[#b56918] text-white flex items-center justify-center hover:bg-[#a05a15] transition-colors shadow-lg"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Logo Section */}
            <div className={cn(
                "flex h-24 items-center px-6 mb-2",
                isCollapsed ? "justify-center px-2" : "justify-start"
            )}>
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 bg-white rounded-lg p-1">
                        <Image src="/images/logo-igire.png" alt="Logo" fill className="object-contain p-1" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-lg leading-tight">Igire Rwanda</span>
                            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">Admin Portal</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                                isActive
                                    ? "bg-[#b56918] text-white shadow-md"
                                    : "hover:bg-emerald-800/50 text-emerald-100"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-emerald-300")} />
                            {!isCollapsed && <span className="text-sm font-semibold flex-1">{item.title}</span>}
                            {item.badge && !isCollapsed && (
                                <span className="bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}