// src/components/dashboard/Header.tsx
"use client";

import { Menu, Search } from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, userProfile } = useAuth();

  const displayName = userProfile?.username || user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-white border-b border-gray-200 h-20 px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between h-full">
        {/* Mobile Menu Button & Search */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search application details..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{initials}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-700 capitalize">{displayName}</p>
              <p className="text-xs text-gray-500">
                {userProfile?.cohortName || "Applicant"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
