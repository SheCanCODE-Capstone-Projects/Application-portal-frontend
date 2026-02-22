"use client";

import React, { useEffect, useState } from "react";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notificationService } from "@/services/notification/notification-service";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user, userProfile } = useAuth(); // Get userProfile from context
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const pathname = usePathname();

  // Display Name Logic: Profile Username > Auth User Name > Email prefix
  const displayName = userProfile?.username || user?.name || user?.email?.split('@')[0] || "Admin";

  // Real-time Clock Logic (Hydration-safe)
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Unread Notifications
  useEffect(() => {
    const fetchUnread = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const notifs = await notificationService.getUnread(token);
          setUnreadCount(notifs.length);
        } catch (e) {
          console.error("Notif error", e);
        }
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate breadcrumbs from current URL path
  const pathNames = pathname.split("/").filter((path) => path);

  return (
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-10">

        {/* LEFT: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1">
          <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block">
            <Breadcrumb>
              <BreadcrumbList>
                {pathNames.map((link, index) => {
                  const href = `/${pathNames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathNames.length - 1;
                  // Format text (e.g., "api-status" -> "Api Status")
                  const title = link
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase());

                  return (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {isLast ? (
                              <BreadcrumbPage className="font-semibold text-gray-800">
                                {title}
                              </BreadcrumbPage>
                          ) : (
                              <BreadcrumbLink asChild>
                                <Link href={href}>{title}</Link>
                              </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* CENTER: Real-Time Date & Clock */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1">
          {currentTime ? (
              <>
                <p className="text-lg font-mono font-bold text-gray-800 tracking-tight">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-0.5">
                  {currentTime.toLocaleDateString([], {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </>
          ) : (
              <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-md" />
          )}
        </div>

        {/* RIGHT: Notifications & Profile (Unchanged) */}
        <div className="flex items-center justify-end gap-6 flex-1">
          <Link href="/admin/dashboard/notifications">
            <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
              </span>
              )}
            </button>
          </Link>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{displayName}</p>
              <p className="text-xs text-emerald-600 font-medium">
                {user?.role || "Administrator"}
              </p>
            </div>
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
              <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${displayName}&background=0f5d3f&color=fff`}
              />
              <AvatarFallback className="bg-emerald-700 text-white">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
  );
}