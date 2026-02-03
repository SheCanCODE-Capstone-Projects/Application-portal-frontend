'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    ArrowLeft, Calendar, Check, X, Archive, FileText, User,
    Briefcase, Heart, AlertTriangle, Phone, Download, Lock, Users, ShieldAlert,
    Link as LinkIcon,
} from 'lucide-react';
import { adminService } from '@/services/admin/admin-service';
import { Application, ApplicationStatus } from '@/types/application/application';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicantDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [applicant, setApplicant] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [interviewModalOpen, setInterviewModalOpen] = useState(false);
    const [interviewData, setInterviewData] = useState({ date: '', time: '', instructions: '' });

    const fetchApplicant = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        try {
            const data = await adminService.getApplicationById(token, id);
            setApplicant(data);
        } catch (error) {
            toast.error("Failed to fetch application");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplicant(); }, [id]);

    const handleStatusChange = async (status: ApplicationStatus) => {
        const token = localStorage.getItem("access_token");
        if (!token || !applicant) return;
        try {
            const updated = await adminService.updateApplicationStatus(token, applicant.id, status);
            setApplicant(updated);
            toast.success(`Application ${status.toLowerCase()} successfully`);
        } catch (e) { toast.error("Action failed"); }
    };

    const handleScheduleInterview = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        if (!token || !applicant) return;

        const dateTime = `${interviewData.date}T${interviewData.time}`;

        try {
            const updated = await adminService.scheduleInterview(token, applicant.id, dateTime, interviewData.instructions);
            setApplicant(updated);
            setInterviewModalOpen(false);
            toast.success("Interview scheduled & Notification sent!");
        } catch (e) { toast.error("Failed to schedule interview"); }
    };

    const handleArchive = async () => {
        const token = localStorage.getItem("access_token");
        if (!token || !applicant) return;
        if (!confirm("Archive this application?")) return;
        try {
            await adminService.archiveApplication(token, applicant.id);
            toast.success("Application archived");
            router.push("/admin/dashboard/applications");
        } catch (e) { toast.error("Failed to archive"); }
    };

    if (loading) return <div className="flex justify-center h-screen items-center">Loading Application Data...</div>;
    if (!applicant) return <div>Application not found</div>;

    // Logic: Locked ONLY if Accepted/Approved.
    // Rejected/SystemRejected are NOT locked so you can edit/override them.
    const isLocked = [ApplicationStatus.ACCEPTED, ApplicationStatus.APPROVED].includes(applicant.status);
    const isSystemRejected = applicant.status === ApplicationStatus.SYSTEM_REJECTED || applicant.isSystemRejected;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-emerald-700">
                    <ArrowLeft className="mr-2" size={18} /> Back to List
                </button>
            </div>

            {/* System Rejection Alert */}
            {isSystemRejected && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-top-2">
                    <div className="p-2 bg-rose-100 rounded-full">
                        <ShieldAlert className="text-rose-600 w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-rose-800 font-bold text-lg">System Rejected</h3>
                        <p className="text-rose-700 text-sm mt-1">
                            Reason: <span className="font-semibold">{applicant.systemRejectionReason || "Criteria not met (Automatic)"}</span>
                        </p>
                        <p className="text-rose-600/80 text-xs mt-2">
                            * You can override this rejection by using the actions below.
                        </p>
                    </div>
                </div>
            )}

            {/* Header Card */}
            <Card className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-emerald-500 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600 shadow-inner">
                        {applicant.personalInfo?.fullName?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{applicant.personalInfo?.fullName}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={isLocked ? "default" : isSystemRejected ? "destructive" : "secondary"} className="text-sm px-3 py-1">
                                {applicant.status.replace(/_/g, " ")}
                            </Badge>
                            <span className="text-gray-400 text-xs uppercase tracking-wide font-medium">| {applicant.cohortName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isLocked ? (
                        <>
                            <Button onClick={() => setInterviewModalOpen(true)} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Calendar className="mr-2 h-4 w-4" /> Schedule Interview
                            </Button>
                            <Button onClick={() => handleStatusChange(ApplicationStatus.ACCEPTED)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                <Check className="mr-2 h-4 w-4" /> Accept
                            </Button>
                            {/* Only show Reject if not already rejected */}
                            {!isSystemRejected && applicant.status !== ApplicationStatus.REJECTED && (
                                <Button onClick={() => handleStatusChange(ApplicationStatus.REJECTED)} variant="destructive">
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-500 border border-gray-200">
                            <Lock size={16} /> <span>Application Finalized</span>
                        </div>
                    )}
                    <Button onClick={handleArchive} variant="secondary" className="hover:bg-gray-200">
                        <Archive className="mr-2 h-4 w-4" /> Archive
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Personal Information */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
                                <User size={18} className="text-blue-500" /> Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoRow label="Full Name" value={applicant.personalInfo?.fullName} />
                                <InfoRow label="Gender" value={applicant.personalInfo?.gender} />
                                <InfoRow label="Nationality" value={applicant.personalInfo?.nationality} />
                                <InfoRow label="Marital Status" value={applicant.personalInfo?.maritalStatus} />
                            </div>
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Email</span>
                                    <span className="text-sm font-medium text-gray-900">{applicant.personalInfo?.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Phone</span>
                                    <span className="text-sm font-medium text-gray-900">{applicant.personalInfo?.phone}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><LinkIcon size={12}/> Social Links</span>
                                    <a href={applicant.personalInfo?.socialLinks} target="_blank" className="text-sm font-medium text-blue-600 hover:underline truncate max-w-[200px]">
                                        {applicant.personalInfo?.socialLinks || "N/A"}
                                    </a>
                                </div>
                                {applicant.personalInfo?.additionalInformation && (
                                    <div className="pt-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Additional Info</span>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{applicant.personalInfo.additionalInformation}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Motivation */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
                                <Heart size={18} className="text-rose-500" /> Motivation & Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <InfoRow label="Preferred Course" value={applicant.motivation?.preferredCourse} />
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Why do you want to join?</h4>
                                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                                    {applicant.motivation?.whyJoin}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Future Goals</h4>
                                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                                    {applicant.motivation?.futureGoals}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Socioeconomic & Disability */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
                                <AlertTriangle size={18} className="text-amber-500" /> Socioeconomic & Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <InfoRow label="Household Income" value={applicant.vulnerability?.householdIncome} />
                            <InfoRow label="Childcare Needs" value={applicant.vulnerability?.hasChildcareNeeds ? "Yes" : "No"} />
                            {applicant.vulnerability?.description && (
                                <div className="pt-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Vulnerability Details</span>
                                    <p className="text-sm text-gray-700 mt-1">{applicant.vulnerability.description}</p>
                                </div>
                            )}

                            <div className="border-t border-gray-100 my-3 pt-3">
                                <InfoRow label="Has Disability" value={applicant.disability?.hasDisability ? "Yes" : "No"} />
                                {applicant.disability?.hasDisability && (
                                    <>
                                        <InfoRow label="Disability Type" value={applicant.disability.disabilityType} />
                                        <div className="pt-1">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Accommodations Needed</span>
                                            <p className="text-sm text-gray-700 mt-1">{applicant.disability.disabilityDescription}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Education */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
                                <Briefcase size={18} className="text-purple-500" /> Education & Work
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <InfoRow label="Highest Level" value={applicant.education?.highestEducationLevel} />
                            <InfoRow label="Qualification" value={applicant.education?.highestEducation} />
                            <InfoRow label="Current Occupation" value={applicant.education?.occupation} />
                            <InfoRow label="Employment Status" value={applicant.education?.employmentStatus} />
                            <InfoRow label="Years Experience" value={`${applicant.education?.yearsExperience} Year(s)`} />
                        </CardContent>
                    </Card>

                    {/* Emergency Contacts */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
                                <Users size={18} className="text-teal-500" /> Emergency Contacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {applicant.emergencyContacts?.map((contact, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{contact.name}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">{contact.relationship}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                                        <Phone size={12} className="text-gray-400" />
                                        {contact.phone}
                                    </div>
                                </div>
                            )) || <p className="text-sm text-gray-400 italic">No contacts provided</p>}
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
                                <FileText size={18} className="text-orange-500" /> Submitted Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-2 pt-4">
                            {applicant.documents?.map((doc, i) => (
                                <a key={i} href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                                   className="group flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-all bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-md group-hover:bg-orange-200 transition-colors">
                                            <FileText size={16} className="text-orange-600" />
                                        </div>
                                        <span className="text-sm font-medium capitalize text-gray-700 group-hover:text-orange-800">
                                            {doc.docType.toLowerCase().replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-orange-600">
                                        View <Download size={14} />
                                    </div>
                                </a>
                            ))}
                            {(!applicant.documents || applicant.documents.length === 0) && (
                                <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-sm">No documents uploaded.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Interview Modal */}
            <Dialog open={interviewModalOpen} onOpenChange={setInterviewModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
                    <form onSubmit={handleScheduleInterview} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Date</label>
                                <input type="date" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                       onChange={e => setInterviewData({ ...interviewData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Time</label>
                                <input type="time" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                       onChange={e => setInterviewData({ ...interviewData, time: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Instructions / Meeting Link</label>
                            <textarea
                                required
                                className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                placeholder="e.g. Please join via this Google Meet link: https://meet.google.com/..."
                                onChange={e => setInterviewData({ ...interviewData, instructions: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg">
                            Confirm & Send Invitation
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function InfoRow({ label, value }: { label: string, value: any }) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-[60%] break-words">
                {value || <span className="text-gray-300 italic">N/A</span>}
            </span>
        </div>
    );
}