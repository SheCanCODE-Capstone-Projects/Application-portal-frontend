// src/components/dashboard/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  FileText,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Home", path: "/applicant/dashboard" },
  { icon: User, label: "Profile", path: "/applicant/dashboard/profile" },
  { icon: FileText, label: "Applications", path: "/applicant/dashboard/applications" },
];


const getStatusStyles = (status?: string) => {
  switch (status) {
    case "APPROVED":
    case "ACCEPTED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
    case "SYSTEM_REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "PENDING":
    case "SUBMITTED":
    case "UNDER_REVIEW":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
  };



  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-green-700 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-20 px-6 border-b border-green-600">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 rounded-lg p-2">
              <GraduationCap className="w-6 h-6 text-green-700" />
            </div>
            <span className="text-xl font-bold">Igire Rwanda Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-green-800 text-white"
                      : "text-green-100 hover:bg-green-800 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Application Status & Logout */}
        <div className="px-4 py-4 border-t border-green-600">
          <div className={`rounded-lg px-4 py-3 mb-3 border ${getStatusStyles(user?.applicationStatus)}`}>
            <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">Your Status</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">
                {user?.applicationStatus?.replace(/_/g, " ") || "No Application"}
              </p>
              {/* Optional: Add a small pulsing dot for pending status */}
        {/*      {user?.applicationStatus === "PENDING" && (*/}
        {/*          <span className="relative flex h-2 w-2">*/}
        {/*  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>*/}
        {/*  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>*/}
        {/*</span>*/}
        {/*      )}*/}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
              text-green-100 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}