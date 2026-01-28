"use client";

import React, { useState } from "react";
import {
    AlertTriangle,
    Trash2,
    Search,
    FileDown,
    Eye,
    RotateCcw,
    Filter,
    ShieldAlert,
    UserX,
    FileWarning,
    Info,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock Data
const initialRejects = [
    { id: "REJ-001", name: "John Doe", email: "john.d@example.com", reason: "Age requirement not met", date: "2025-01-10", ruleId: "RULE-AGE-01", details: "Applicant is 17 years old. Minimum required: 18." },
    { id: "REJ-002", name: "Jane Smith", email: "jane.s@example.com", reason: "Incomplete application", date: "2025-01-12", ruleId: "RULE-DOC-04", details: "Missing mandatory 'National ID' upload." },
    { id: "REJ-003", name: "Mike Johnson", email: "mike.j@example.com", reason: "Location out of bounds", date: "2025-01-15", ruleId: "RULE-LOC-02", details: "Resident of outside operating region." },
];

export default function SystemRejectPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [reasonFilter, setReasonFilter] = useState("All");
    const [selectedReject, setSelectedReject] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Filter Logic
    const filteredRejects = initialRejects.filter((rej) => {
        const matchesSearch = rej.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rej.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesReason = reasonFilter === "All" || rej.reason === reasonFilter;
        return matchesSearch && matchesReason;
    });

    const handleExport = () => {
        const headers = ["ID,Name,Email,Reason,Date,RuleID"];
        const rows = filteredRejects.map(r => `${r.id},${r.name},${r.email},"${r.reason}",${r.date},${r.ruleId}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "system_rejects_log.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-[#0f172a] min-h-screen p-4 sm:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-rose-500 h-8 w-8" /> System Rejects
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Automated decisions based on cohort eligibility rules</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 h-11"
                    >
                        <FileDown className="mr-2 h-4 w-4" /> Export Log
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard title="Total Rejections" value="124" icon={UserX} color="text-rose-400" bgColor="bg-rose-500/10" />
                <SummaryCard title="Top Reason" value="Incomplete Docs" icon={FileWarning} color="text-amber-400" bgColor="bg-amber-500/10" />
                <SummaryCard title="Rule Accuracy" value="99.2%" icon={History} color="text-blue-400" bgColor="bg-blue-500/10" />
            </div>

            {/* Main Table Card */}
            <Card className="bg-[#1e293b] border-none text-white shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800/50 flex flex-col sm:flex-row items-center gap-4 bg-[#1e293b]/50">
                    <div className="relative group w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white h-11 focus:ring-2 focus:ring-rose-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Select value={reasonFilter} onValueChange={setReasonFilter}>
                            <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700 text-white h-11">
                                <Filter className="mr-2 h-4 w-4 text-slate-500" />
                                <SelectValue placeholder="Reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="All">All Reasons</SelectItem>
                                <SelectItem value="Age requirement not met">Age Requirement</SelectItem>
                                <SelectItem value="Incomplete application">Incomplete App</SelectItem>
                                <SelectItem value="Location out of bounds">Location Issue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-900/50 border-slate-800">
                            <TableRow className="hover:bg-transparent border-slate-800">
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Applicant</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Rejection Reason</TableHead>
                                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Date</TableHead>
                                <TableHead className="text-right text-slate-500 font-bold uppercase text-[10px] tracking-widest py-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRejects.map((app) => (
                                <TableRow key={app.id} className="border-slate-800 hover:bg-slate-800/40 transition-colors group">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-slate-700">
                                                <AvatarFallback className="bg-slate-800 text-slate-400 text-xs">{app.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-100">{app.name}</span>
                                                <span className="text-xs text-slate-500">{app.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 px-3 py-1 rounded-full text-[11px] font-semibold">
                                            <AlertTriangle className="mr-1.5 h-3 w-3" /> {app.reason}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">{app.date}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setSelectedReject(app); setIsDetailsOpen(true); }}
                                                className="bg-white/5 border-slate-700 text-slate-300 hover:bg-white/10 h-8 px-3 text-xs"
                                            >
                                                <Eye className="mr-2 h-3.5 w-3.5" /> Details
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Rule Detail Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="bg-[#0f172a] border-slate-800 text-white sm:max-w-md p-0 overflow-y-auto">
                    <div className="h-32 bg-gradient-to-r from-rose-600 to-orange-700 w-full flex items-center justify-center">
                        <ShieldAlert className="h-12 w-12 text-white/50" />
                    </div>
                    <div className="px-6 -mt-12">
                        <SheetHeader className="mb-8 items-center text-center">
                            <Avatar className="h-24 w-24 border-4 border-[#0f172a] shadow-xl">
                                <AvatarFallback className="bg-slate-800 text-2xl font-bold text-rose-500">{selectedReject?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="mt-4">
                                <SheetTitle className="text-white text-2xl font-bold">Rejection Details</SheetTitle>
                                <SheetDescription className="text-rose-400 font-medium uppercase text-[10px] tracking-widest mt-1">
                                    Decision Log: {selectedReject?.id}
                                </SheetDescription>
                            </div>
                        </SheetHeader>

                        <div className="space-y-8 pb-10">
                            {/* Applicant Section */}
                            <section className="space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Applicant</h4>
                                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                                    <p className="text-sm font-bold text-slate-200">{selectedReject?.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">{selectedReject?.email}</p>
                                </div>
                            </section>

                            {/* Failure Section */}
                            <section className="space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Info size={14} className="text-rose-400" /> Triggered Rule
                                </h4>
                                <div className="bg-rose-500/5 p-5 rounded-2xl border border-rose-500/20">
                                    <p className="text-xs font-bold text-rose-400 uppercase mb-2">{selectedReject?.ruleId}</p>
                                    <p className="text-sm text-slate-200 leading-relaxed italic">
                                        "{selectedReject?.details}"
                                    </p>
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="pt-6 flex flex-col gap-3">
                                <Button className="bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <RotateCcw size={18} /> Restore for Manual Review
                                </Button>
                                <Button variant="outline" className="border-slate-700 text-slate-400 h-12 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
                                    Dismiss Record Permanently
                                </Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function SummaryCard({ title, value, icon: Icon, color, bgColor }: any) {
    return (
        <Card className="bg-[#1e293b] border-none text-white shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${bgColor} ${color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}