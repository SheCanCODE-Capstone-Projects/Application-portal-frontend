"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Bell,
  Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Logo from "@/components/share/logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/applicant/dashboard" },
  { icon: User, label: "My Profile", path: "/applicant/dashboard/profile" },
  { icon: FileText, label: "Applications", path: "/applicant/dashboard/applications" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const unreadNotifications = 3;

  const handleNavigation = (path: string) => {
    router.push(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                onClick={onClose}
            />
        )}

        {/* Sidebar Aside */}
        <aside
            className={cn(
                "fixed lg:static inset-y-0 left-0 z-30 bg-green-900 text-white shadow-xl",
                "transition-all duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                isCollapsed ? "lg:w-20" : "lg:w-72",
                "w-64"
            )}
        >
          {/* Header: Logo & Toggle */}
          <div className="flex items-center h-20 px-4 border-b border-green-800/50 justify-between">
            {!isCollapsed ? (
                // Full Logo
                <div className="flex items-center space-x-3 overflow-hidden transition-opacity duration-300 opacity-100">
                  <div className="flex items-center justify-center shrink-0">
                    <Logo />
                  </div>
                  <span className="text-lg font-bold whitespace-nowrap">
                Dashboard
              </span>
                </div>
            ) : (

                <div className="w-full flex justify-center">
                  <span className="font-bold text-green-400 text-xl">
                    <Logo />
                  </span>
                </div>
            )}

            {/* Toggle Button (Desktop only) */}
            <button
                onClick={toggleSidebar}
                className={cn(
                    "hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-green-800 hover:bg-green-700 text-green-100 transition-colors",
                    isCollapsed ? "absolute -right-4 top-9 shadow-md bg-green-700 border border-green-600" : ""
                )}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-visible">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                  <div key={item.path} className="relative group">
                    <button
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                            "w-full flex items-center p-3 rounded-xl transition-all duration-200",
                            isActive
                                ? "bg-green-600 shadow-md text-white"
                                : "text-green-100 hover:bg-white/10 hover:text-white",
                            isCollapsed ? "justify-center" : "space-x-3"
                        )}
                    >
                      <Icon className={cn("shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />

                      <span className={cn(
                          "font-medium whitespace-nowrap transition-all duration-300",
                          isCollapsed ? "hidden" : "block"
                      )}>
                    {item.label}
                  </span>
                    </button>

                    {/* Tooltip: Displayed "on top" via z-index and absolute positioning outside the button */}
                    {isCollapsed && (
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block">
                          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap relative">
                            {item.label}
                            {/* Little triangle arrow pointing left */}
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                          </div>
                        </div>
                    )}
                  </div>
              );
            })}

            {/* Notifications Link */}
            <div className="relative group">
              <button
                  onClick={() => handleNavigation("/applicant/dashboard/notifications")}
                  className={cn(
                      "w-full flex items-center p-3 rounded-xl transition-all duration-200",
                      pathname === "/applicant/dashboard/notifications"
                          ? "bg-green-600 shadow-md text-white"
                          : "text-green-100 hover:bg-white/10 hover:text-white",
                      isCollapsed ? "justify-center" : "space-x-3"
                  )}
              >
                <div className="relative">
                  <Bell className={cn("shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
                  {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                   </span>
                  )}
                </div>

                <span className={cn(
                    "font-medium whitespace-nowrap transition-all duration-300 flex-1 text-left",
                    isCollapsed ? "hidden" : "block"
                )}>
                Notifications
              </span>

                {!isCollapsed && unreadNotifications > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Tooltip for Notifications */}
              {isCollapsed && (
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block">
                    <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap relative">
                      Notifications
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </div>
              )}
            </div>
          </nav>

          {/* Footer / Status & Logout */}
          <div className="p-4 border-t border-green-800/50 space-y-4">

            {/* Status Section */}
            {/* If collapsed: Icon Only (Activity) */}
            {/* If open: Full Status Card */}
            <div className="transition-all duration-300">
              {isCollapsed ? (
                  <div className="flex justify-center group relative cursor-help">
                    <div className="p-2 rounded-lg bg-green-800/40 text-yellow-400 hover:bg-green-800/60 transition-colors">
                      <Activity className="w-6 h-6" />
                    </div>
                    {/* Status Tooltip */}
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
                        <p className="font-semibold text-green-400 uppercase text-[10px]">Status</p>
                        <p>{user?.applicationStatus?.replace(/_/g, " ") || "Pending"}</p>
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="bg-green-800/40 rounded-xl p-4 transition-all duration-300">
                    <div>
                      <p className="text-xs text-green-300 uppercase font-semibold tracking-wider mb-1">Status</p>
                      <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white truncate max-w-[140px]">
                                {user?.applicationStatus?.replace(/_/g, " ") || "Pending"}
                            </span>
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="relative group">
              <button
                  onClick={() => logout()}
                  className={cn(
                      "w-full flex items-center p-3 rounded-xl transition-colors duration-200",
                      "text-green-100 hover:bg-red-500/20 hover:text-red-100",
                      isCollapsed ? "justify-center" : "space-x-3"
                  )}
              >
                <LogOut className={cn("shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
                <span className={cn(
                    "font-medium whitespace-nowrap transition-all duration-300",
                    isCollapsed ? "hidden" : "block"
                )}>
                Logout
              </span>
              </button>
              {/* Tooltip for logout */}
              {isCollapsed && (
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block">
                    <div className="bg-red-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap relative">
                      Logout
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-red-900"></div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </aside>
      </>
  );
}