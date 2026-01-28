// src/app/admin/layout.tsx
"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
      <div className="flex min-h-screen w-full bg-zinc-50 transition-all duration-300 ease-in-out">
        {/* Sidebar - Controlled by isCollapsed */}
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out lg:static lg:block",
                isCollapsed ? "w-20" : "w-[280px]"
            )}
        >
          <AdminSidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              className="h-full"
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}