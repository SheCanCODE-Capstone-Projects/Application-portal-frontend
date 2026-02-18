// src/components/dashboard/Header.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  ChevronLeft,
  Clock,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, userProfile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // State for the clock to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentDate(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // --- Logic: Location & Back Button ---
  const isMainDashboard = pathname === "/applicant/dashboard";

  // Format current path into a readable title
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return "Dashboard";

    return lastSegment
        .replace(/-/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  };

  // --- Logic: User Display ---
  const displayName = userProfile?.username || user?.name || "User";
  const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const status = user?.applicationStatus?.replace(/_/g, " ") || "Pending";

  // Determine status color
  const getStatusColor = (status: string) => {
    if (status.includes("ACCEPTED") || status.includes("APPROVED")) return "bg-green-500";
    if (status.includes("REJECTED")) return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 h-20 px-4 md:px-6 lg:px-8 transition-all duration-300">
        <div className="flex items-center justify-between h-full max-w-9xl mx-auto">

          {/* LEFT SECTION: Navigation & Breadcrumbs */}
          <div className="flex-1 flex items-center justify-start gap-4">
            {/* Mobile Menu Toggle */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2.5 rounded-full hover:bg-gray-100/80 text-gray-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              {/* Back Button (Conditional) */}
              {!isMainDashboard && (
                  <button
                      onClick={() => router.back()}
                      className="hidden md:flex p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all shadow-sm hover:shadow-md"
                      title="Go Back"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
              )}

              {/* Page Title / Context */}
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">
                  {getPageTitle()}
                </h1>
                <span className="text-xs text-gray-500 font-medium mt-1">
                Igire Rwanda Portal
              </span>
              </div>
            </div>
          </div>

          {/* CENTER SECTION: Time Widget (Hidden on small screens) */}
          <div className="hidden lg:flex flex-col items-center justify-center min-w-[200px]">
            {mounted && (
                <div className="flex flex-row items-center p-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-800 font-bold text-lg leading-none">
                    {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium uppercase tracking-wide mt-1">
                    {currentDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
            )}
          </div>

          {/* RIGHT SECTION: Notifications & Profile */}
          <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">

            {/* Notifications - Made more visible with a subtle background */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
              <NotificationDropdown />
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block h-8 w-px bg-gray-200"></div>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 pl-1.5 cursor-pointer group">
              {/* Text Info (Name aligned to right for reading flow) */}
              <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 transition-colors leading-tight">
                {displayName}
              </span>
                <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {userProfile?.cohortName || "Applicant"}
                </span>
                  <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      getStatusColor(user?.applicationStatus || "")
                  )}></span>
                </div>
              </div>

              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-white group-hover:ring-green-100 transition-all">
                  <span className="font-bold text-sm tracking-wider">{initials}</span>
                </div>
                {/* Online Indicator Dot */}
                <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full shadow-sm",
                    getStatusColor(user?.applicationStatus || "")
                )} title={`Status: ${status}`}></div>
              </div>
            </div>

          </div>
        </div>
      </header>
  );
}