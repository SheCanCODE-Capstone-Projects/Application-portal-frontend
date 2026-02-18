"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <NotificationProvider>
                <div className="flex h-screen bg-gray-50">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </NotificationProvider>
        </AuthProvider>
    );
}