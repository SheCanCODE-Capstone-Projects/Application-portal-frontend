"use client";

import React, { useEffect, useState } from "react";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";
import { ApplicationStatus } from "@/types/application/application";
import { useRouter } from "next/navigation";
import {
    AlertTriangle, Search, Eye, RefreshCw, FileX, Calendar, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function RejectsPage() {
    const { applications, loading, fetchApplications } = useAdminApplications();
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const rejects = (applications || []).filter(app =>
        app.status === ApplicationStatus.SYSTEM_REJECTED &&
        (
            (app.personalInfo?.fullName?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (app.id || "").includes(search)
        )
    );

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-rose-800 flex items-center gap-2">
                        <FileX className="h-8 w-8" /> Automated Rejections
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Applicants filtered out by system criteria.
                    </p>
                </div>
                <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-lg text-rose-800 text-sm font-medium">
                    Count: {rejects.length}
                </div>
            </header>

            <Card className="border-rose-100 shadow-sm">
                <CardHeader className="border-b border-gray-100 bg-white pb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            className="pl-9 bg-gray-50 border-gray-200 focus:ring-rose-500"
                            placeholder="Search rejected applicants..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="pl-6 py-4 font-bold text-gray-600">Applicant</TableHead>
                                <TableHead className="py-4 font-bold text-gray-600">Cohort</TableHead>
                                <TableHead className="py-4 font-bold text-gray-600">Rejection Reason</TableHead>
                                <TableHead className="py-4 font-bold text-gray-600">Date</TableHead>
                                <TableHead className="pr-6 py-4 text-right font-bold text-gray-600">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex justify-center"><RefreshCw className="animate-spin text-gray-400" /></div>
                                    </TableCell>
                                </TableRow>
                            ) : rejects.length > 0 ? (
                                rejects.map((app) => (
                                    <TableRow key={app.id} className="hover:bg-rose-50/30 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{app.personalInfo?.fullName || "Unknown"}</p>
                                                <p className="text-xs text-gray-500">{app.personalInfo?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-gray-600 border-gray-200 font-normal">
                                                {app.cohortName}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-md w-fit text-sm font-medium border border-rose-100">
                                                <AlertTriangle size={14} />
                                                {app.systemRejectionReason || "System Criteria"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
                                            {new Date(app.submittedAt || app.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/admin/dashboard/applications/${app.id}`)}
                                                className="border-rose-200 text-rose-700 hover:bg-rose-100"
                                            >
                                                View Application <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        No system rejections found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}