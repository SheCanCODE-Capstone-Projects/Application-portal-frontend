'use client';

import {useEffect, useState, useMemo, JSX} from 'react';
import {
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { adminService } from '@/services/admin/admin-service';
import { Application, ApplicationStatus } from '@/types/application/application';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area,
} from 'recharts';
import { Activity, RefreshCw, Users, Layers, UserCheck, UserX } from 'lucide-react';


interface ExtendedDashboardStats {
    totalApplicants: number;
    activeCohorts: number;
    systemRejects: number;
    successfulRegisters: number;
    duplicateRejections: number;
    charts: {
        dailyTrend: { date: string; count: number }[];
        cohortBreakdown: { name: string; ACCEPTED: number; REJECTED: number; PENDING: number }[];
    };
    trends: {
        applicants: string;
        cohorts: string;
        rejects: string;
        registers: string;
    };
}

interface graphicalCard {
    title: string;
    value: number;
    icon: JSX.Element;
    trend?: string;
    progress?: number;
    subtext?: string;
    isWarning?: boolean;
    color?: string;
    bg?: string;
    chartData?: { date: string; count: number }[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<ExtendedDashboardStats | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCohort, setSelectedCohort] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [sortOption, setSortOption] = useState('date-desc');

    useEffect(() => {
        const loadDashboardData = async () => {
            const token = localStorage.getItem("access_token");

            // FIX: If no token, stop loading and return (Guard will handle redirect)
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const [statsData, appsData] = await Promise.all([
                    adminService.getDashboardStats(token),
                    adminService.getAllApplications(token)
                ]);
                setStats(statsData as unknown as ExtendedDashboardStats);
                setApplications(appsData);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const uniqueCohorts = useMemo(() => {
        const cohorts = new Set(applications.map(app => app.cohortName).filter(Boolean));
        return Array.from(cohorts).sort();
    }, [applications]);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const matchesSearch = (
                (app.personalInfo?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (app.personalInfo?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                app.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesCohort = selectedCohort === 'all' || app.cohortName === selectedCohort;
            const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

            return matchesSearch && matchesCohort && matchesStatus;
        }).sort((a, b) => {
            switch (sortOption) {
                case 'name-asc': return (a.personalInfo?.fullName || '').localeCompare(b.personalInfo?.fullName || '');
                case 'name-desc': return (b.personalInfo?.fullName || '').localeCompare(a.personalInfo?.fullName || '');
                case 'date-asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'date-desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default: return 0;
            }
        });
    }, [applications, searchTerm, selectedCohort, selectedStatus, sortOption]);

    const handleDownloadCSV = () => {
        const headers = ['Application ID', 'Cohort', 'Date', 'Name', 'Email', 'Status'];
        const rows = filteredApplications.map(app =>
            `"${app.id}","${app.cohortName || ''}","${app.createdAt}","${app.personalInfo?.fullName || ''}","${app.personalInfo?.email || ''}","${app.status}"`
        );
        const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applicants_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    const rejectionRate = stats ? (stats.systemRejects / (stats.totalApplicants || 1)) * 100 : 0;
    const syncIssueRate = stats ? (stats.duplicateRejections / (stats.totalApplicants || 1)) * 100 : 0;

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">System performance and application metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-sm font-medium">
                        <Activity size={16} />
                        System Status: Operational
                    </div>
                    <Button onClick={handleDownloadCSV} variant="outline" className="flex items-center gap-2">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Graphical Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* 1. Total Applicants with Sparkline */}
                <GraphicalCard
                    title="Total Applicants"
                    value={stats?.totalApplicants || 0}
                    icon={<Users className="text-blue-600 w-5 h-5" />}
                    trend={stats?.trends?.applicants}
                    chartData={stats?.charts?.dailyTrend}
                    color="#2563eb"
                    bg="bg-blue-50/50"
                />

                {/* 2. Active Cohorts */}
                <GraphicalCard
                    title="Active Cohorts"
                    value={stats?.activeCohorts || 0}
                    icon={<Layers className="text-purple-600 w-5 h-5" />}
                    trend={stats?.trends?.cohorts}
                    color="#9333ea"
                    bg="bg-purple-50/50"
                />

                {/* 3. System Rejects with Progress Ring */}
                <GraphicalCard
                    title="System Rejects"
                    value={stats?.systemRejects || 0}
                    icon={<UserX className="text-rose-600 w-5 h-5" />}
                    trend={stats?.trends?.rejects}
                    color="#e11d48"
                    bg="bg-rose-50/50"
                    progress={rejectionRate}
                    subtext="Automated Filters"
                />

                {/* 4. Sync Duplicates with Warning Visual */}
                <GraphicalCard
                    title="Sync Duplicates"
                    value={stats?.duplicateRejections || 0}
                    icon={<RefreshCw className="text-orange-600 w-5 h-5" />}
                    color="#ea580c"
                    bg="bg-orange-50/50"
                    progress={syncIssueRate} // Reuse progress for bar or ring
                    subtext="Applied Twice"
                    isWarning
                />

                {/* 5. Registered Users */}
                <GraphicalCard
                    title="Registered Users"
                    value={stats?.successfulRegisters || 0}
                    icon={<UserCheck className="text-emerald-600 w-5 h-5" />}
                    trend={stats?.trends?.registers}
                    color="#059669"
                    bg="bg-emerald-50/50"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Application Trend</CardTitle>
                        <CardDescription>Volume of new applications received per day</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.charts?.dailyTrend || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                    tick={{fontSize: 12, fill: '#6b7280'}}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
                                <Area type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Cohort Breakdown Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cohort Performance</CardTitle>
                        <CardDescription>Status distribution across active cohorts</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.charts?.cohortBreakdown || []} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px'}} />
                                <Legend />
                                <Bar dataKey="ACCEPTED" name="Accepted" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="PENDING" name="Pending" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="REJECTED" name="Rejected" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Applications Table */}
            <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-gray-200">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <CardTitle>Recent Applications</CardTitle>
                            <CardDescription>Manage and review applicant details.</CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search applicants..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
                                />
                            </div>
                            <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Cohort" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cohorts</SelectItem>
                                    {uniqueCohorts.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {Object.values(ApplicationStatus).map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Applicant</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Cohort</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Date Applied</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {filteredApplications.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No applicants found.</td></tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-gray-200">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                        {app.personalInfo?.fullName?.substring(0, 2).toUpperCase() || 'NA'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Link href={`admin/dashboard/applications/${app.id}`} className="font-semibold text-gray-900 hover:text-emerald-600">
                                                        {app.personalInfo?.fullName || 'Unknown'}
                                                    </Link>
                                                    <p className="text-xs text-gray-500">{app.personalInfo?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Badge variant="outline" className="font-normal text-gray-600">{app.cohortName || 'N/A'}</Badge></td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/dashboard/applications/${app.id}`}>
                                                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">View Details</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function GraphicalCard({ title, value, icon, trend, color, bg, chartData, progress, subtext, isWarning }: graphicalCard) {
    const isUp = trend && (trend.includes('+') || trend === 'Active');
    const isDown = trend && trend.includes('-');

    return (
        <div className={`relative p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white`}>
            {/* Header */}
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-3xl font-extrabold text-gray-900">{value.toLocaleString()}</h3>
                        {trend && (
                            <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${isUp ? 'text-emerald-700 bg-emerald-50' : isDown ? 'text-rose-700 bg-rose-50' : 'text-gray-600 bg-gray-100'}`}>
                                {isUp ? <ArrowTrendingUpIcon className="w-3 h-3 mr-1"/> : <ArrowTrendingDownIcon className="w-3 h-3 mr-1"/>}
                                {trend}
                            </span>
                        )}
                    </div>
                    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
            </div>

            {/* Graphical Elements at Bottom */}
            <div className="mt-4 h-12 relative">
                {chartData ? (
                    // Sparkline Area Chart
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <Area type="monotone" dataKey="count" stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : progress !== undefined ? (
                    // Progress Bar or Ring
                    <div className="flex flex-col justify-end h-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Rate</span>
                            <span className="font-bold">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${isWarning ? 'bg-orange-500' : 'bg-rose-500'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`absolute -right-4 -bottom-6 w-24 h-24 rounded-full opacity-10 ${
                            (bg ?? '').replace('/50', '')
                        }`}
                    />

                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const styles: Record<string, string> = {
        [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-700 border-green-200',
        [ApplicationStatus.APPROVED]: 'bg-green-100 text-green-700 border-green-200',
        [ApplicationStatus.REJECTED]: 'bg-red-50 text-red-700 border-red-100',
        [ApplicationStatus.SYSTEM_REJECTED]: 'bg-red-50 text-red-700 border-red-100',
        [ApplicationStatus.PENDING_REVIEW]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        [ApplicationStatus.SUBMITTED]: 'bg-blue-50 text-blue-700 border-blue-200',
        [ApplicationStatus.DRAFT]: 'bg-gray-100 text-gray-600 border-gray-200',
        [ApplicationStatus.INTERVIEW_SCHEDULED]: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    const style = styles[status] || 'bg-gray-100 text-gray-600';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
}