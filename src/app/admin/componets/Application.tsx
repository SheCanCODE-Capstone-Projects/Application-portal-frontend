"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  Search,
  Clock,
  CheckCircle,
  XCircle,
  FileDown,
  Loader2,
  Inbox,
  Filter,
  User,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";
// import { useWebSocket } from "@/hooks/useWebSocket";
import {
  ApplicationStatus,
} from "@/types/application/application";

export default function Application() {
  const router = useRouter();

  // --- Filters State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cohortFilter, setCohortFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [educationFilter, setEducationFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");

  const { applications, loading, fetchApplications } =
    useAdminApplications();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const uniqueCohorts = useMemo(() => {
    const cohorts = new Set(
      applications.map((app) => app.cohortName).filter(Boolean),
    );
    return Array.from(cohorts).sort();
  }, [applications]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Advanced Filtering Logic
const filteredApplicants = useMemo(() => {
        return applications
            .filter((app) => {
                const matchesSearch =
                    (app.personalInfo?.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                    (app.personalInfo?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                    app.id.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus = statusFilter === "All" || app.status === statusFilter;
                const matchesCohort = cohortFilter === "All" || app.cohortName === cohortFilter;
                const matchesGender = genderFilter === "All" || app.personalInfo?.gender === genderFilter;
                const matchesEducation = educationFilter === "All" || app.education?.highestEducationLevel === educationFilter;

                let matchesExperience = true;
                if (experienceFilter !== "All") {
                    const exp = app.education?.yearsExperience || 0;
                    if (experienceFilter === "0-1") matchesExperience = exp <= 1;
                    if (experienceFilter === "2-4") matchesExperience = exp >= 2 && exp <= 4;
                    if (experienceFilter === "5+") matchesExperience = exp >= 5;
                }

                return matchesSearch && matchesStatus && matchesCohort && matchesGender && matchesEducation && matchesExperience;
            })
            // Sort by submittedAt (latest first), fallback to createdAt
            .sort((a, b) => {
                const dateA = new Date(a.submittedAt || a.createdAt).getTime();
                const dateB = new Date(b.submittedAt || b.createdAt).getTime();
                return dateB - dateA;
            });
    }, [applications, searchTerm, statusFilter, cohortFilter, genderFilter, educationFilter, experienceFilter]);

    const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
    // Reset to page 1 when filters change
    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
    const paginatedApplicants = filteredApplicants.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

  const handleDownload = () => {
    const headers = [
      "ID,Name,Email,Phone,Gender,Cohort,Education,Experience,Status,Submitted,Why Join,Future Goals,Preferred Course,Emergency Contacts,Documents",
    ];

    const rows = filteredApplicants.map((a) => {
      const date = a.submittedAt
        ? new Date(a.submittedAt).toLocaleDateString()
        : new Date(a.createdAt).toLocaleDateString();

      const whyJoin = a.motivation?.whyJoin || "";
      const futureGoals = a.motivation?.futureGoals || "";
      const preferredCourse = a.motivation?.preferredCourse || "";

      const emergencyContacts =
        a.emergencyContacts
          ?.map((c) => `${c.name} (${c.relationship}): ${c.phone}`)
          .join("; ") || "";

      const documents =
        a.documents?.map((d) => `${d.docType}: ${d.fileUrl}`).join("; ") || "";

      return `"${a.id}","${a.personalInfo?.fullName || "N/A"}","${a.personalInfo?.email || "N/A"}","${a.personalInfo?.phone || "N/A"}","${a.personalInfo?.gender || "N/A"}","${a.cohortName || "N/A"}","${a.education?.highestEducationLevel || "N/A"}","${a.education?.yearsExperience || 0}","${a.status}","${date}","${whyJoin}","${futureGoals}","${preferredCourse}","${emergencyContacts}","${documents}"`;
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "applications_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.APPROVED:
        return <CheckCircle size={14} className="mr-1.5" />;
      case ApplicationStatus.REJECTED:
      case ApplicationStatus.SYSTEM_REJECTED:
        return <XCircle size={14} className="mr-1.5" />;
      default:
        return <Clock size={14} className="mr-1.5" />;
    }
  };

  const getStatusStyle = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.APPROVED:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case ApplicationStatus.REJECTED:
      case ApplicationStatus.SYSTEM_REJECTED:
        return "bg-rose-50 text-rose-700 border-rose-200";
      case ApplicationStatus.SUBMITTED:
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCohortFilter("All");
    setGenderFilter("All");
    setEducationFilter("All");
    setExperienceFilter("All");
  };

  if (loading && applications.length === 0) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
          <p className="text-gray-500">Loading applications...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-6 bg-white space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-800">
              Applications
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Showing{" "}
              <span className="font-semibold text-emerald-600">
                {filteredApplicants.length}
              </span>{" "}
              of {applications.length} applications
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              size="sm"
            >
              <FileDown size={16} className="mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* --- Filters Area --- */}
        <div className="flex flex-col gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                className="pl-9 bg-white border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Cohort Filter */}
            <Select value={cohortFilter} onValueChange={setCohortFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-white border-gray-200">
                <Filter className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <SelectValue placeholder="Cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cohorts</SelectItem>
                {uniqueCohorts.map((cohort) => (
                  <SelectItem key={cohort} value={cohort}>
                    {cohort}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px] bg-white border-gray-200">
                <Clock className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {Object.values(ApplicationStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full md:w-[140px] bg-white border-gray-200 text-xs">
                <User className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Genders</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>

            {/* Education Filter */}
            <Select value={educationFilter} onValueChange={setEducationFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-200 text-xs">
                <GraduationCap className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <SelectValue placeholder="Education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Education</SelectItem>
                <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                <SelectItem value="BACHELOR">Bachelor&#39;s</SelectItem>
                <SelectItem value="MASTER">Master&#39;s</SelectItem>
                <SelectItem value="PHD">PhD</SelectItem>
                <SelectItem value="DIPLOMA">Diploma</SelectItem>
              </SelectContent>
            </Select>

            {/* Experience Filter */}
            <Select
              value={experienceFilter}
              onValueChange={setExperienceFilter}
            >
              <SelectTrigger className="w-full md:w-[160px] bg-white border-gray-200 text-xs">
                <Briefcase className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Experience</SelectItem>
                <SelectItem value="0-1">0 - 1 Years</SelectItem>
                <SelectItem value="2-4">2 - 4 Years</SelectItem>
                <SelectItem value="5+">5+ Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
                            <TableHead className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4 pl-6">Applicant</TableHead>
                            <TableHead className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4">Cohort Id</TableHead>
                            <TableHead className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4">Cohort Name</TableHead>
                            <TableHead className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4">Education</TableHead>
                            <TableHead className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4">Submitted</TableHead>
                            <TableHead className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4">Status</TableHead>
                            <TableHead className="text-center text-gray-500 font-semibold text-xs uppercase tracking-wider py-4 pr-6">Action</TableHead>
                        </TableRow>
          </TableHeader>
           <TableBody>
                        {paginatedApplicants.length > 0 ? (
                            paginatedApplicants.map((app) => (
                                <TableRow key={app.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-gray-200">
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xs">
                                                    {app.personalInfo?.fullName?.charAt(0) || "A"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{app.personalInfo?.fullName || "Unknown"}</span>
                                                <span className="text-xs text-gray-500">{app.personalInfo?.email || "No email"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 font-medium text-sm">{app.cohortId || "N/A"}</TableCell>
                                    <TableCell className="text-gray-600 font-medium text-sm">{app.cohortName || "N/A"}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-700 capitalize">
                                                {app.education?.highestEducationLevel?.toLowerCase().replace(/_/g, " ") || "N/A"}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {app.education?.yearsExperience} Year(s) Exp
                                            </span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-gray-500 text-sm">
                                        {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : new Date(app.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(app.status)}`} variant="outline">
                                            {getStatusIcon(app.status)}
                                            {app.status.replace(/_/g, " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center pr-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/admin/dashboard/applications/${app.id}`)}
                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 text-xs font-medium group-hover:bg-emerald-100"
                                        >
                                            View Details <ArrowRight size={14} className="ml-1" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                                            <Inbox className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-900 font-semibold">No applications found</p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Try adjusting filters or checking back later.
                                        </p>
                                        <Button onClick={clearFilters} variant="link" className="text-emerald-600 mt-2">
                                            Clear Filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
        </Table>
        
        {totalPages > 1 && (
                    <div className="flex justify-end items-center gap-2 p-8">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={safeCurrentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            Prev
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .map(pageNum => {
                                
                                if (pageNum === 1 || pageNum === totalPages || Math.abs(safeCurrentPage - pageNum) <= 2) {
                                    return (
                                        <Button
                                            key={pageNum}
                                            size="sm"
                                            variant={pageNum === safeCurrentPage ? "default" : "outline"}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                }
                                // Ellipsis
                                if (pageNum === 2 && safeCurrentPage > 4) return <span key="start-ellipsis">...</span>;
                                if (pageNum === totalPages - 1 && safeCurrentPage < totalPages - 3) return <span key="end-ellipsis">...</span>;
                                return null;
                            })}
                        
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={safeCurrentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
    </Card>
  );
}
