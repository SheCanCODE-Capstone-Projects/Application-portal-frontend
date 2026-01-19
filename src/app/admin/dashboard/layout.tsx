// src/app/admin/dashboard/layout.tsx
'use client';

import { useState, ReactNode } from 'react';
import Header from '@/components/admin/Header';
import  Sidebar  from '@/components/admin/Sidebar'; 
import MainContent from '@/components/admin/MainContent';
import { AdminApplicationProvider } from '@/contexts/AdminApplicationContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminApplicationProvider>
      <div className="flex min-h-screen bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1">
          <Header setSidebarOpen={setSidebarOpen} />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </AdminApplicationProvider>
  );
}