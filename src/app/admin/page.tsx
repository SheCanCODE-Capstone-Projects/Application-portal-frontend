"use client";

import React, { useEffect } from "react";
import {
    Users,
    Package,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Ban,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { useWebSocket } from "@/hooks/useWebSocket";
import Application from "@/app/admin/componets/Application";
import SystemRejects from "@/app/admin/componets/systemRejects";
import SystemReport from "@/app/admin/componets/systemreport";

export default function DashboardPage() {
    const { stats, loading, error, fetchStats } = useAdminDashboard();

    // WebSocket for real-time updates
    const { isConnected, lastMessage } = useWebSocket({
        onMessage: (data) => {
            if (data.type === "STATS_UPDATE" || data.type === "APPLICATION_UPDATE") {
                fetchStats();
            }
        },
    });

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="text-slate-400">Loading dashboard...</p>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white">
                <AlertCircle className="w-16 h-16 text-red-400" />
                <h2 className="text-xl font-semibold">Failed to load dashboard</h2>
                <p className="text-slate-400">{error}</p>
                <Button onClick={fetchStats} variant="outline" className="mt-4">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen p-8 text-white">
            {/* Connection Status */}
            <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-400">
                    {isConnected ? 'Real-time updates active' : 'Connecting...'}
                </span>
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-slate-400 ml-2" />}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                    <Button size="sm" variant="ghost" onClick={fetchStats} className="ml-auto text-red-400 hover:text-red-300">
                        Retry
                    </Button>
                </div>
            )}

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Applicants" 
                    value={stats?.totalApplicants?.toLocaleString() ?? "0"} 
                    trend={stats?.trends?.applicants ?? "+0%"} 
                    trendType={stats?.trends?.applicants?.startsWith('+') ? "up" : "down"} 
                    icon={Users} 
                    iconColor="text-blue-400" 
                    bgColor="bg-blue-900/20" 
                />
                <StatCard 
                    title="Active Cohorts" 
                    value={stats?.activeCohorts?.toString() ?? "0"} 
                    trend={stats?.trends?.cohorts ?? "+0"} 
                    trendType="up" 
                    icon={Package} 
                    iconColor="text-orange-400" 
                    bgColor="bg-orange-900/20" 
                />
                <StatCard 
                    title="System Rejects" 
                    value={stats?.systemRejects?.toString() ?? "0"} 
                    trend={stats?.trends?.rejects ?? "+0%"} 
                    trendType="down" 
                    icon={Ban} 
                    iconColor="text-rose-400" 
                    bgColor="bg-rose-900/20" 
                />
                <StatCard 
                    title="Successful Registers" 
                    value={stats?.successfulRegisters?.toLocaleString() ?? "0"} 
                    trend={stats?.trends?.registers ?? "+0%"} 
                    trendType={stats?.trends?.registers?.startsWith('+') ? "up" : "down"} 
                    icon={Zap} 
                    iconColor="text-emerald-400" 
                    bgColor="bg-emerald-900/20" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SystemReport />
                <SystemRejects />
            </div>
            <Application />
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    trendType: "up" | "down";
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
}

function StatCard({ title, value, trend, trendType, icon: Icon, iconColor, bgColor }: StatCardProps) {
    return (
        <Card className="border-none text-white overflow-hidden">
            <CardContent className="p-6 relative">
                <div className={`p-2 rounded-lg w-fit mb-4 ${bgColor} ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className={`absolute bottom-6 right-6 flex items-center gap-1 text-sm ${trendType === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trendType === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {trend}
                </div>
            </CardContent>
        </Card>
    );
}
