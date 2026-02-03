"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    Layers,
    BarChart3,
    Bell,
    X,
    ShieldAlert,
    LogOut,
    GraduationCap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notification/notification-service";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnread = async () => {
            const token = localStorage.getItem("access_token");
            if(token) {
                try {
                    const notifs = await notificationService.getUnread(token);
                    setUnreadCount(notifs.length);
                } catch(e) { }
            }
        };
        fetchUnread();
    }, []); // Run once on mount

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
        { icon: FileText, label: "Applications", href: "/admin/dashboard/applications" },
        { icon: Layers, label: "Cohorts", href: "/admin/dashboard/cohorts" },
        { icon: Users, label: "Users", href: "/admin/dashboard/users" },
        { icon: BarChart3, label: "Reports", href: "/admin/dashboard/reports" },
        { icon: ShieldAlert, label: "System Rejects", href: "/admin/dashboard/system-reject" },
        { icon: Bell, label: "Notifications", href: "/admin/dashboard/notifications", badge: unreadCount },
    ];

    return (
        <>
            <div
                onClick={() => setSidebarOpen(false)}
                className={`fixed inset-0 z-20 transition-opacity bg-black/50 lg:hidden ${
                    sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition-transform duration-300 transform bg-[#0f172a] text-white lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between h-20 px-6 bg-[#0f172a] border-b border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
                        <div className="p-1.5 bg-emerald-600 rounded-lg">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <span>ADMIN</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex flex-col mt-6 px-4 gap-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon
                                        size={20}
                                        className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`}
                                    />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-[#0f172a]">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}