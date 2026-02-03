'use client';

import { useState, ReactNode } from 'react';
import Header from '@/components/admin/Header';
import MainContent from '@/components/admin/MainContent';
import Sidebar from '@/components/admin/sidebar'
import AdminGuard from "@/app/admin/AdminGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AdminGuard>
            {/* h-screen ensures the outer container doesn't scroll */}
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* flex-1 and flex-col allow the header to stay top and MainContent to scroll */}
                <div className="flex flex-col flex-1 w-0 overflow-hidden">
                    <Header setSidebarOpen={setSidebarOpen} />
                    <MainContent>{children}</MainContent>
                </div>
            </div>
        </AdminGuard>
    );
}