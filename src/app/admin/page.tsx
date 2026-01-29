"use client";

import React, { useEffect } from "react";
import { Users, GraduationCap, Ban, CheckCircle, TrendingUp } from "lucide-react";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";
import { useWebSocket } from "@/hooks/useWebSocket";
import StatisticsCard from "@/components/admin/statistics-card-01";
import SalesMetricsCard from "@/components/admin/chart-sales-metrics";
import TransactionDatatable from "@/components/admin/datatable-transaction";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    const { stats, fetchStats } = useAdminDashboard();
    const { applications, fetchApplications } = useAdminApplications();

    // Real-time synchronization via WebSockets
    useWebSocket({
        onMessage: (data) => {
            if (data.type === "APPLICATION_UPDATE" || data.type === "STATS_UPDATE") {
                fetchStats();
                fetchApplications();
            }
        },
    });

    useEffect(() => {
        fetchStats();
        fetchApplications();
    }, [fetchStats, fetchApplications]);

    const metrics = [
        { icon: <Users />, title: "Total Applicants", value: stats?.totalApplicants?.toString() || "0", changePercentage: stats?.trends?.applicants || "+0%" },
        { icon: <GraduationCap />, title: "Active Programs", value: stats?.activeCohorts?.toString() || "0", changePercentage: stats?.trends?.cohorts || "+0" },
        { icon: <Ban />, title: "System Rejections", value: stats?.systemRejects?.toString() || "0", changePercentage: stats?.trends?.rejects || "+0%" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Real Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
                {metrics.map((card, i) => (
                    <StatisticsCard key={i} {...card} className="bg-white border-zinc-200/60 shadow-sm hover:border-emerald-200 transition-all" />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Repurposed Sales Block for Recruitment Trends */}
                <div className="lg:col-span-2">
                    <SalesMetricsCard className="h-full border-zinc-200/60 bg-white" />
                </div>

                {/* Successful Registers Highlights */}
                <Card className="flex flex-col justify-center items-center bg-gradient-to-br from-emerald-900 to-emerald-950 text-white border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle size={120} />
                    </div>
                    <CheckCircle className="w-14 h-14 text-amber-500 mb-4 drop-shadow-md" />
                    <h3 className="text-emerald-100/80 text-sm font-bold uppercase tracking-widest mb-1">Total Registers</h3>
                    <p className="text-7xl font-black tracking-tighter">{stats?.successfulRegisters || 0}</p>
                    <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-emerald-200 text-xs font-semibold backdrop-blur-sm">
                        <TrendingUp size={14} /> <span>{stats?.trends?.registers || "0%"} monthly growth</span>
                    </div>
                </Card>
            </div>

            {/* Real Recent Applications Table */}
            <Card className="border-zinc-200/60 shadow-md overflow-hidden bg-white">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <CardTitle className="text-lg font-bold text-emerald-950 tracking-tight uppercase">Recent Activity</CardTitle>
                    <a href="/admin/applications" className="text-xs font-bold text-amber-700 hover:text-amber-600 transition-colors uppercase tracking-widest">Full Pipeline &rarr;</a>
                </div>
                <TransactionDatatable
                    data={applications.slice(0, 8).map(app => ({
                        id: app.id,
                        name: app.personalInfo?.fullName || "Incomplete Profile",
                        email: app.personalInfo?.email || "N/A",
                        amount: 0,
                        status: app.status.toLowerCase() as any,
                        avatarFallback: app.personalInfo?.fullName?.[0] || "?",
                        avatar: "",
                        paidBy: "visa" as any
                    }))}
                />
            </Card>
        </div>
    );
}