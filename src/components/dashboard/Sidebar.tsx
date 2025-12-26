// src/components/dashboard/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  FileText,
  BarChart,
  MessageSquare,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Home", path: "/applicant/dashboard" },
  { icon: User, label: "Profile", path: "/applicant/dashboard/profile" },
  { icon: FileText, label: "My Application", path: "/applicant/dashboard/application" },
  { icon: BarChart, label: "Progress", path: "/applicant/dashboard/progress" },
  { icon: MessageSquare, label: "Messages", path: "/applicant/dashboard/messages" },
  { icon: Settings, label: "Settings", path: "/applicant/dashboard/settings" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    // Add your logout logic here
    router.push("/");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-blue-600 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-20 px-6 border-b border-blue-500">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 rounded-lg p-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold">Applicant Portal</span>
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
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
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
        <div className="px-4 py-4 border-t border-blue-500">
          <div className="bg-blue-700 rounded-lg px-4 py-3 mb-3">
            <p className="text-xs text-blue-200">Application Status</p>
            <p className="text-sm font-semibold">Under Review</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
              text-blue-100 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}