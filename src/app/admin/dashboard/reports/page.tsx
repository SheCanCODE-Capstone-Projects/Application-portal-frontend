'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStatsResponse } from '@/services/admin/admin-service';
import { Printer, Calendar, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';



export default function ReportsPage() {
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if(token) {
            adminService.getDashboardStats(token)
                .then(setStats)
                .catch(() => setStats(null))
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-emerald-600" />
            <p className="text-gray-500 font-medium">Generating Report...</p>
        </div>
    );

    if (!stats) return <div className="p-10 text-center text-gray-500">Failed to load report data.</div>;

    const statusDistribution = stats.charts?.cohortBreakdown
        ? stats.charts.cohortBreakdown.map(c => ({
            name: c.name,
            Accepted: c.ACCEPTED || 0,
            Rejected: c.REJECTED || 0,
            Pending: c.PENDING || 0
        }))
        : [];

    const dailyTrend = stats.charts?.dailyTrend || [];

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-end border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Performance Report</h1>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0 print:hidden">
                    <span>Generated on {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-emerald-50 border-emerald-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-emerald-800">Total Applicants</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-emerald-900">{stats.totalApplicants}</div></CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-800">Active Cohorts</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-blue-900">{stats.activeCohorts}</div></CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-orange-800">Successful Registers</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-orange-900">{stats.successfulRegisters || 0}</div></CardContent>
                </Card>
                <Card className="bg-rose-50 border-rose-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-rose-800">System Rejections</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-rose-900">{stats.systemRejects}</div></CardContent>
                </Card>
            </div>

            {/* Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Application Trends */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Application Volume</CardTitle>
                        <CardDescription>Daily application submissions over the last 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {day: 'numeric', month:'short'})} />
                                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Cohort Breakdown */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Cohort Breakdown</CardTitle>
                        <CardDescription>Status distribution per cohort.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280'}} />
                                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} />
                                <RechartsTooltip cursor={{fill: 'transparent'}} />
                                <Legend />
                                <Bar dataKey="Accepted" stackId="a" fill="#10b981" />
                                <Bar dataKey="Pending" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="Rejected" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Key Metrics Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Metric Category</th>
                            <th className="p-4 font-semibold text-gray-600">Current Value</th>
                            <th className="p-4 font-semibold text-gray-600">Trend Indicator</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        <tr>
                            <td className="p-4">Total Applicant Growth</td>
                            <td className="p-4 font-medium">{stats.totalApplicants}</td>
                            <td className="p-4 text-green-600 font-medium">{stats.trends?.applicants || "Stable"}</td>
                        </tr>
                        <tr>
                            <td className="p-4">Cohort Utilization</td>
                            <td className="p-4 font-medium">{stats.activeCohorts} Active</td>
                            <td className="p-4 text-blue-600 font-medium">{stats.trends?.cohorts || "Stable"}</td>
                        </tr>
                        <tr>
                            <td className="p-4">Auto-Rejection Rate</td>
                            <td className="p-4 font-medium">{stats.totalApplicants ? ((stats.systemRejects / stats.totalApplicants)*100).toFixed(1) : 0}%</td>
                            <td className="p-4 text-rose-600 font-medium">{stats.trends?.rejects || "Stable"}</td>
                        </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <footer className="text-center text-xs text-gray-400 pt-8">
                Confidential Internal Report • Igire Rwanda Application Portal
            </footer>
        </div>
    );
}