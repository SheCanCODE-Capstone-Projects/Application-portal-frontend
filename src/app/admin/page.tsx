"use client";

import React, { useEffect } from "react";
import { Users, GraduationCap, Ban, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";
import { useWebSocket } from "@/hooks/useWebSocket";
import StatisticsCard from "@/components/admin/statistics-card-01"; // Ensure this accepts props below
import SalesMetricsCard from "@/components/admin/chart-sales-metrics"; // Renaming to ApplicationTrends recommended
import TransactionDatatable from "@/components/admin/datatable-transaction";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
        {
            icon: <Users className="text-blue-600" />,
            title: "Total Applicants",
            value: stats?.totalApplicants?.toString() || "0",
            changePercentage: stats?.trends?.applicants || "+0%"
        },
        {
            icon: <GraduationCap className="text-purple-600" />,
            title: "Active Programs",
            value: stats?.activeCohorts?.toString() || "0",
            changePercentage: stats?.trends?.cohorts || "+0"
        },
        {
            icon: <Ban className="text-red-600" />,
            title: "System Rejections",
            value: stats?.systemRejects?.toString() || "0",
            changePercentage: stats?.trends?.rejects || "+0%"
        },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
            {/* Real Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
                {metrics.map((card, i) => (
                    <StatisticsCard
                        key={i}
                        {...card}
                        className="bg-white border-zinc-200/60 shadow-sm hover:border-emerald-200 transition-all"
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recruitment Trends Chart */}
                <div className="lg:col-span-2">
                    <SalesMetricsCard className="h-full border-zinc-200/60 bg-white shadow-sm rounded-xl" />
                </div>

                {/* Successful Registers Highlights */}
                <Card className="flex flex-col justify-center items-center bg-gradient-to-br from-emerald-900 to-emerald-950 text-white border-none shadow-xl relative overflow-hidden group rounded-xl p-8">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle size={120} />
                    </div>
                    <CheckCircle className="w-14 h-14 text-amber-500 mb-4 drop-shadow-md" />
                    <h3 className="text-emerald-100/80 text-sm font-bold uppercase tracking-widest mb-1">Total Registered</h3>
                    <p className="text-7xl font-black tracking-tighter">{stats?.successfulRegisters || 0}</p>
                    <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-emerald-200 text-xs font-semibold backdrop-blur-sm">
                        <TrendingUp size={14} /> <span>{stats?.trends?.registers || "0%"} vs last month</span>
                    </div>
                </Card>
            </div>

            {/* Recent Applications Table */}
            <Card className="border-zinc-200/60 shadow-md overflow-hidden bg-white rounded-xl">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <CardTitle className="text-lg font-bold text-emerald-950 tracking-tight uppercase">
                        Recent Applications
                    </CardTitle>
                    <Link href="/admin/applications" className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-600 transition-colors uppercase tracking-widest">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {/* We map the application data to the structure the generic table expects */}
                <TransactionDatatable
                    data={applications.slice(0, 8).map(app => ({
                        id: app.id,
                        // If Personal Info is missing (draft stage), show placeholder
                        name: app.personalInfo?.fullName || "Draft Application",
                        email: app.personalInfo?.email || "No Email",
                        // Re-purposing 'amount' field for Cohort Name if your table supports it, otherwise 0
                        amount: 0,
                        // Status mapping
                        status: app.status.toLowerCase().replace(/_/g, " "),
                        // Initials for avatar
                        avatarFallback: (app.personalInfo?.fullName || "A").charAt(0),
                        avatar: "",
                        // Optional: Pass date as a string if the table supports a date column
                        date: new Date(app.createdAt).toLocaleDateString()
                    }))}
                />
            </Card>
        </div>
    );
}