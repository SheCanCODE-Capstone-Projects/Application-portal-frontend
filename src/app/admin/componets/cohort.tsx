"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this in ui components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    Plus,
    Edit3,
    Calendar,
    Users,
    Activity,
    Save,
    Trash2,
    Settings2,
    Info,
    CheckCircle2,
    Clock3, GraduationCap
} from "lucide-react";

export default function CohortManagement() {
    // 1. State Management
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCohort, setEditingCohort] = useState<any>(null);
    const [cohorts, setCohorts] = useState([
        {
            id: 1,
            name: "Cohort 4 - Software Engineering",
            description: "Advanced fullstack development program focusing on Next.js and Spring Boot.",
            startDate: "2025-01-15",
            endDate: "2025-06-15",
            status: "Upcoming",
            students: 0,
            limit: 50
        },
        {
            id: 2,
            name: "Cohort 2 - Data Science",
            description: "Intensive data analysis and machine learning cohort.",
            startDate: "2024-03-01",
            endDate: "2024-08-01",
            status: "Active",
            students: 32,
            limit: 40
        },
    ]);

    // 2. Handlers
    const handleOpenEditor = (cohort: any = null) => {
        setEditingCohort(cohort || {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            limit: 30,
            status: "Upcoming"
        });
        setIsEditorOpen(true);
    };

    const handleSave = () => {
        if (editingCohort.id) {
            setCohorts(cohorts.map(c => c.id === editingCohort.id ? editingCohort : c));
        } else {
            setCohorts([...cohorts, { ...editingCohort, id: Date.now(), students: 0 }]);
        }
        setIsEditorOpen(false);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Active": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Completed": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        }
    };

    return (
        <div className="space-y-6 bg-[#0f172a] min-h-screen p-2 sm:p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Cohort Management</h1>
                    <p className="text-slate-400 text-sm">Create and monitor learning tracks</p>
                </div>
                <Button
                    onClick={() => handleOpenEditor()}
                    className="bg-blue-600 hover:bg-blue-500 text-white h-11 px-6 rounded-xl shadow-lg shadow-blue-900/20"
                >
                    <Plus className="mr-2 h-5 w-5" /> Create New Cohort
                </Button>
            </div>

            {/* Main Cohort Card */}
            <Card className="bg-[#1e293b] border-none text-white shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-6">
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-lg font-semibold">Active System Cohorts</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 px-0 sm:px-6">
                    <Table>
                        <TableHeader className="border-slate-700/50">
                            <TableRow className="hover:bg-transparent border-slate-700/50">
                                <TableHead className="text-slate-400 uppercase text-[11px] font-bold tracking-widest">Cohort Details</TableHead>
                                <TableHead className="text-slate-400 uppercase text-[11px] font-bold tracking-widest">Timeline</TableHead>
                                <TableHead className="text-slate-400 uppercase text-[11px] font-bold tracking-widest">Capacity</TableHead>
                                <TableHead className="text-slate-400 uppercase text-[11px] font-bold tracking-widest">Status</TableHead>
                                <TableHead className="text-right text-slate-400 uppercase text-[11px] font-bold tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cohorts.map((cohort) => (
                                <TableRow key={cohort.id} className="border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                                    <TableCell className="py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-md font-bold text-slate-100">{cohort.name}</span>
                                            <span className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">{cohort.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                            {cohort.startDate}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="h-6 w-6 rounded-full bg-slate-700 border-2 border-[#1e293b]" />
                                                ))}
                                            </div>
                                            <span className="text-xs font-medium text-slate-400">
                                                {cohort.students}/{cohort.limit}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(cohort.status)}`} variant="outline">
                                            {cohort.status === 'Active' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock3 className="mr-1 h-3 w-3" />}
                                            {cohort.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenEditor(cohort)}
                                            className="text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 rounded-lg"
                                        >
                                            <Edit3 className="h-4 w-4 mr-2" /> Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modern Cohort Editor (Sheet) */}
            <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <SheetContent className="bg-[#0f172a] border-slate-800 text-white sm:max-w-lg p-0 overflow-y-auto">
                    {/* Visual Header */}
                    <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-800 w-full flex items-center px-8">
                        <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <GraduationCap className="text-white h-6 w-6" />
                        </div>
                    </div>

                    <div className="px-8 -mt-6">
                        <SheetHeader className="mb-8 text-left">
                            <div className="bg-[#0f172a] p-2 rounded-xl inline-block shadow-xl border border-slate-800">
                                <SheetTitle className="text-white text-2xl font-bold">
                                    {editingCohort?.id ? "Edit Cohort" : "New Cohort"}
                                </SheetTitle>
                            </div>
                            <SheetDescription className="text-slate-400 mt-2">
                                Configure the learning track details, capacity, and schedule.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-6 pb-24">
                            {/* General Info */}
                            <section className="space-y-4">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <Info size={14} /> Basic Information
                                </h4>
                                <div className="space-y-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Cohort Name</label>
                                        <Input
                                            value={editingCohort?.name}
                                            onChange={(e) => setEditingCohort({...editingCohort, name: e.target.value})}
                                            className="bg-slate-900 border-slate-700 text-slate-100 h-11 focus:ring-blue-500/50"
                                            placeholder="e.g. Software Engineering 2025"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                                        <Textarea
                                            value={editingCohort?.description}
                                            onChange={(e) => setEditingCohort({...editingCohort, description: e.target.value})}
                                            className="bg-slate-900 border-slate-700 text-slate-100 min-h-[100px] focus:ring-blue-500/50"
                                            placeholder="What will students learn in this cohort?"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Schedule & Limits */}
                            <section className="space-y-4">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} /> Logistics & Schedule
                                </h4>
                                <div className="grid grid-cols-2 gap-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Start Date</label>
                                        <Input
                                            type="date"
                                            value={editingCohort?.startDate}
                                            onChange={(e) => setEditingCohort({...editingCohort, startDate: e.target.value})}
                                            className="bg-slate-900 border-slate-700 text-slate-100 h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">End Date</label>
                                        <Input
                                            type="date"
                                            value={editingCohort?.endDate}
                                            onChange={(e) => setEditingCohort({...editingCohort, endDate: e.target.value})}
                                            className="bg-slate-900 border-slate-700 text-slate-100 h-11"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                                            Student Capacity <span>{editingCohort?.limit} People</span>
                                        </label>
                                        <Input
                                            type="number"
                                            value={editingCohort?.limit}
                                            onChange={(e) => setEditingCohort({...editingCohort, limit: parseInt(e.target.value)})}
                                            className="bg-slate-900 border-slate-700 text-slate-100 h-11"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-[#0f172a] border-t border-slate-800 flex flex-row gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditorOpen(false)}
                            className="flex-1 bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white h-12 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-12 font-bold rounded-xl shadow-lg shadow-blue-900/20"
                        >
                            <Save className="mr-2 h-4 w-4" /> Save Cohort
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}