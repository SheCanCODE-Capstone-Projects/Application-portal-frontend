'use client';

import { useState, ReactNode } from 'react';
import Header from '@/app/components/admin/Header';
import MainContent from '@/app/components/admin/MainContent';
import Sidebar from '@/app/components/admin/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar (mobile: off-canvas, desktop: fixed) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1">
        {/* Top Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}