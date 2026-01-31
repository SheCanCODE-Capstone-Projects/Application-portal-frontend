// src/app/admin/layout.tsx
"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminGuard from "./AdminGuard";
import {AppSidebar} from "@/components/admin/sidebar";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <SidebarProvider>
                <div className="flex h-screen w-full bg-zinc-50/50 overflow-hidden">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col min-w-0">
                        <AdminHeader />
                        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </AdminGuard>
    );
}