"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Search,
    Clock,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    UserCircle,
    FileDown,
    RefreshCw,
    Loader2,
    Inbox
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ApplicationStatus, Application as ApplicationType } from "@/types/application/application";

export default function Application() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedApplicant, setSelectedApplicant] = useState<ApplicationType | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const { applications, loading, error, fetchApplications, updateStatus, clearError } = useAdminApplications();

    const { isConnected } = useWebSocket({
        onMessage: (data) => {
            if (data.type === "APPLICATION_UPDATE") {
                fetchApplications();
            }
        },
    });

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const filteredApplicants = applications.filter((app) => {
        const matchesSearch = 
            app.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.personalInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDownload = () => {
        const headers = ["ID,Name,Email,Cohort,Status,Date"];
        const rows = filteredApplicants.map(a => {
            const date = a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : new Date(a.createdAt).toLocaleDateString();
            return `${a.id},"${a.personalInfo?.fullName || "N/A"}","${a.personalInfo?.email || "N/A"}","${a.cohortName || "N/A"}",${a.status},${date}`;
        });
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "applications_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case ApplicationStatus.ACCEPTED:
            case ApplicationStatus.APPROVED:
                return <CheckCircle size={16} className="mr-2" />;
            case ApplicationStatus.REJECTED:
            case ApplicationStatus.SYSTEM_REJECTED:
                return <XCircle size={16} className="mr-2" />;
            default: return <Clock size={16} className="mr-2" />;
        }
    };

    const getStatusDisplay = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.ACCEPTED:
            case ApplicationStatus.APPROVED:
                return "Accepted";
            case ApplicationStatus.REJECTED:
            case ApplicationStatus.SYSTEM_REJECTED:
                return "Rejected";
            case ApplicationStatus.PENDING:
            case ApplicationStatus.PENDING_REVIEW:
                return "Pending";
            case ApplicationStatus.UNDER_REVIEW:
                return "Under Review";
            case ApplicationStatus.INTERVIEW_SCHEDULED:
                return "Interview";
            case ApplicationStatus.SUBMITTED:
                return "Submitted";
            case ApplicationStatus.DRAFT:
                return "Draft";
            default:
                return status;
        }
    };

    const getStatusStyle = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.ACCEPTED:
            case ApplicationStatus.APPROVED:
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case ApplicationStatus.REJECTED:
            case ApplicationStatus.SYSTEM_REJECTED:
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default:
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    if (loading && applications.length === 0) {
        return (
            <Card className="border-gray-300 text-black overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
                    <p className="text-gray-500">Loading applications...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className=" border-gray-300 text-black overflow-hidden">
            <CardHeader className="border-b border-e-gray-200 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Recent Applications</CardTitle>
                        <p className="text-black text-sm mt-1">Manage and review student applications</p>
                    </div>

                    {/* Enhanced Action Area */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input with Focus "Popout" effect */}
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 bg-gray-200 border-gray-300 text-white h-11 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all rounded-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] bg-gray-100 border-gray-300 text-black h-11 focus:ring-2 focus:ring-blue-500/50">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="All">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Standout Export Button */}
                        <Button
                            variant="secondary"
                            onClick={handleDownload}
                            className="bg-blue-600 hover:bg-blue-500 text-white border-none h-11 px-6 font-medium shadow-blue-900/20"
                        >
                            <FileDown size={28} className="mr-2" /> Export In Exel
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <Table>
                    <TableHeader className="border-slate-700">
                        <TableRow className="hover:bg-transparent border-slate-700">
                            <TableHead className="text-black font-bold uppercase text-xs tracking-wider">Application ID</TableHead>
                            <TableHead className="text-black font-bold uppercase text-xs tracking-wider">Applicant</TableHead>
                            <TableHead className="text-black font-bold uppercase text-xs tracking-wider">Cohort</TableHead>
                            <TableHead className="text-black font-bold uppercase text-xs tracking-wider">Date Applied</TableHead>
                            <TableHead className="text-black font-bold uppercase text-xs tracking-wider">Status</TableHead>
                            <TableHead className="text-center text-black font-bold uppercase text-xs tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApplicants.length > 0 ? (
                            filteredApplicants.map((app) => (
                                <TableRow key={app.id} className="border-gray-300 hover:bg-gray-200 transition-colors group">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-md font-medium text-black">{app.id.slice(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-gray-400">
                                                <AvatarFallback className="bg-gray-300 text-black">{app.personalInfo?.fullName?.charAt(0) || "?"}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-md font-medium text-black">{app.personalInfo?.fullName || "N/A"}</span>
                                                <span className="text-xs text-slate-950 group-hover:text-slate-400 transition-colors">{app.personalInfo?.email || "N/A"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-black font-medium">{app.cohortName || "N/A"}</TableCell>
                                    <TableCell className="text-black">{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : new Date(app.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge className={`flex items-center w-fit px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(app.status)}`} variant="outline">
                                            {getStatusIcon(app.status)}
                                            {getStatusDisplay(app.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => { setSelectedApplicant(app); setIsDetailsOpen(true); }}
                                            className="bg-white/5 hover:bg-white/10 text-black border-slate-600/20 h-9 px-4 text-xs font-semibold"
                                        >
                                            View Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <Inbox className="w-12 h-12 text-gray-400 mb-3" />
                                        <p className="text-gray-500 font-medium">
                                            {error ? "Failed to load applications" : "No applications found"}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {error || (searchTerm || statusFilter !== "All" ? "Try adjusting your filters" : "Applications will appear here")}
                                        </p>
                                        {error && (
                                            <Button onClick={() => fetchApplications()} variant="outline" size="sm" className="mt-4">
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Retry
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Comprehensive Profile Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="bg-green-950 border-gray-100 text-white sm:max-w-md p-0 overflow-y-auto">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-orange-50 to-orange-300 w-full" />
                    <div className="px-6 -mt-12">
                        <SheetHeader className="mb-6 items-center text-center">
                            <Avatar className="h-24 w-24 border-4 border-gray-50 shadow-xl">
                                <AvatarFallback className="bg-gray-300 text-2xl font-bold">{selectedApplicant?.personalInfo?.fullName?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="mt-4">
                                <SheetTitle className="text-black text-2xl font-bold">{selectedApplicant?.personalInfo?.fullName || "N/A"}</SheetTitle>
                                <SheetDescription className="text-gray-500 font-medium uppercase text-md text-center">
                                    {selectedApplicant?.id.slice(0, 8)}...
                                </SheetDescription>
                            </div>
                        </SheetHeader>

                        {/* Profile Content */}
                        <div className="space-y-8 pb-10">
                            {/* Contact Section */}
                            <section>
                                <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <UserCircle size={14} /> Basic Information
                                </h4>
                                <div className="space-y-4 p-4 rounded-2xl border border-gray-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                            <Mail size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-700 font-bold uppercase">Email Address</span>
                                            <span className="text-sm text-black">{selectedApplicant?.personalInfo?.email || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                            <Phone size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase">Phone Number</span>
                                            <span className="text-sm text-slate-200">{selectedApplicant?.personalInfo?.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                                            <MapPin size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase">Nationality</span>
                                            <span className="text-sm text-slate-200">{selectedApplicant?.personalInfo?.nationality || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Background Section */}
                            <section>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Academic Background</h4>
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-md font-bold text-slate-100">{selectedApplicant?.education?.highestEducation || selectedApplicant?.education?.highestEducationLevel || "N/A"}</p>
                                        <p className="text-xs text-slate-400 mt-1 italic">Applied for {selectedApplicant?.cohortName || "N/A"}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="pt-6 flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <Button 
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white h-12 font-bold rounded-xl shadow-lg shadow-emerald-900/20"
                                        onClick={async () => {
                                            if (selectedApplicant) {
                                                await updateStatus(selectedApplicant.id, ApplicationStatus.ACCEPTED);
                                                setIsDetailsOpen(false);
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                                    </Button>
                                    <Button 
                                        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white h-12 font-bold rounded-xl shadow-lg shadow-rose-900/20"
                                        onClick={async () => {
                                            if (selectedApplicant) {
                                                await updateStatus(selectedApplicant.id, ApplicationStatus.REJECTED);
                                                setIsDetailsOpen(false);
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
                                    </Button>
                                </div>
                                <Button variant="outline" className="w-full bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white h-11 rounded-xl">
                                    Send Message
                                </Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </Card>
    );
}