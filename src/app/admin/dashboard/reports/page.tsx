'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStatsResponse } from '@/services/admin/admin-service';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { useSynchronizedUsers } from '@/hooks/admin/useSynchronizedUsers';

export default function ReportsPage() {
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // Using the new pagination hook
    const { data: syncData, loading: loadingSync, page, setPage } = useSynchronizedUsers();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if(token) {
            adminService.getDashboardStats(token)
                .then(setStats)
                .catch(() => setStats(null))
                .finally(() => setLoadingStats(false));
        }
    }, []);

    if (loadingStats) return (
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
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-end border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Performance Report</h1>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0 print:hidden">
                    <span className="text-gray-500">Generated on {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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

            {/* NEW: Synchronized Users Data Table */}
            <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle>Synchronized Master Data Report</CardTitle>
                    <CardDescription>A step-by-step view of all users successfully pushed to the master database.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-500 font-semibold uppercase text-xs">
                            <tr>
                                <th className="p-4 pl-6">Full Name</th>
                                <th className="p-4">Phone Number</th>
                                <th className="p-4">Cohort Joined</th>
                                <th className="p-4">Provider</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 pr-6">Sync Date</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loadingSync ? (
                                <tr><td colSpan={6} className="p-8 text-center">Loading synchronized data...</td></tr>
                            ) : !syncData || syncData.content.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No synchronized users found yet.</td></tr>
                            ) : (
                                syncData.content.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6 font-medium text-gray-900">{user.fullName}</td>
                                        <td className="p-4 text-gray-600">{user.phoneNumber}</td>
                                        <td className="p-4 text-gray-600">{user.cohortJoined}</td>
                                        <td className="p-4">
                                            <Badge variant={user.provider === 'GOOGLE' ? 'default' : 'secondary'}>
                                                {user.provider || 'LOCAL'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline">{user.role || 'APPLICANT'}</Badge>
                                        </td>
                                        <td className="p-4 pr-6 text-gray-500">
                                            {new Date(user.syncedAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Step-by-Step Pagination Controls */}
                    {syncData && syncData.totalPages > 1 && (
                        <div className="flex justify-between items-center p-4 border-t bg-white">
                            <p className="text-sm text-gray-500">
                                Showing page {syncData.number + 1} of {syncData.totalPages} ({syncData.totalElements} total)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setPage(page - 1)}
                                    disabled={syncData.first}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setPage(page + 1)}
                                    disabled={syncData.last}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <footer className="text-center text-xs text-gray-400 pt-8">
                Confidential Internal Report • Igire Rwanda Application Portal
            </footer>
        </div>
    );
}