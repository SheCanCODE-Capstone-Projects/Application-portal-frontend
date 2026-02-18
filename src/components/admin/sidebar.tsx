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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notification/notification-service";
import Logo from "../share/logo";

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
      if (token) {
        try {
          const notifs = await notificationService.getUnread(token);
          setUnreadCount(notifs.length);
        } catch {}
      }
    };
    fetchUnread();
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    {
      icon: FileText,
      label: "Applications",
      href: "/admin/dashboard/applications",
    },
    { icon: Layers, label: "Cohorts", href: "/admin/dashboard/cohorts" },
    { icon: Users, label: "Users", href: "/admin/dashboard/users" },
    { icon: BarChart3, label: "Reports", href: "/admin/dashboard/reports" },
    {
      icon: ShieldAlert,
      label: "System Rejects",
      href: "/admin/dashboard/system-reject",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/admin/dashboard/notifications",
      badge: unreadCount,
    },
  ];

return (
  <>
    {/* Overlay */}
    <div
      onClick={() => setSidebarOpen(false)}
      className={`fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    />

    {/* Sidebar */}
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-[#0f172a] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wider w-full min-w-0">
          <div className="flex items-center justify-center shrink-0">
            <Logo />
          </div>

          <span className="truncate bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Igire Dashboard
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white rounded-full bg-slate-400/50  p-2 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-6 px-3 gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-orange-500 rounded-r-full" />
              )}

              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={`transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-white"
                  }`}
                />
                <span className="font-medium text-sm">
                  {item.label}
                </span>
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

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
        <button
          onClick={() => {
            setSidebarOpen(false);
            logout();
          }}
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
