// src/app/admin/componets/cohort.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Plus, Save, Loader2, GraduationCap, Calendar, Settings2 } from "lucide-react";
import { useCohorts } from "@/hooks/admin/useCohorts";
import { Cohort } from "@/types/cohort/cohort";
import { toast } from "sonner";

// Import text editor dynamically to avoid SSR errors
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function CohortManagement() {
    const { cohorts, loading, saving, fetchCohorts, createCohort, updateCohort } = useCohorts();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCohort, setEditingCohort] = useState<Partial<Cohort>>({});

    useEffect(() => {
        fetchCohorts(); // Fetch cohorts from backend
    }, [fetchCohorts]);

    const handleOpenEditor = (cohort: Cohort | null = null) => {
        setEditingCohort(cohort || {
            name: "", description: "", applicationLimit: 30, isOpen: true,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            requirements: [], rules: [], year: new Date().getFullYear()
        });
        setIsEditorOpen(true);
    };

    const handleSave = async () => {
        if (!editingCohort.name) return toast.error("Program name is required");

        const success = editingCohort.id
            ? await updateCohort(editingCohort.id, editingCohort) // Update existing
            : await createCohort(editingCohort); // Create new

        if (success) {
            setIsEditorOpen(false);
            toast.success(`Cohort ${editingCohort.id ? 'updated' : 'created'} successfully`);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">PROGRAM COHORTS</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure academic cycles and admission limits.</p>
                </div>
                <Button onClick={() => handleOpenEditor()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-900/20 transition-all">
                    <Plus className="mr-2 h-5 w-5" /> New Cohort
                </Button>
            </div>

            <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-2xl">
                <CardHeader className="border-b border-gray-50 bg-white">
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-800">Active Programs</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="border-gray-100">
                                <TableHead className="font-bold text-slate-700">Program Details</TableHead>
                                <TableHead className="font-bold text-slate-700 text-center">Capacity</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 px-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={3} className="text-center py-16"><Loader2 className="animate-spin mx-auto text-indigo-600" /></TableCell></TableRow>
                            ) : cohorts.map((c) => (
                                <TableRow key={c.id} className="hover:bg-indigo-50/30 transition-colors border-gray-50">
                                    <TableCell className="py-4">
                                        <div className="font-bold text-slate-800">{c.name}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1" dangerouslySetInnerHTML={{ __html: c.description }} />
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-slate-700">{c.applicationLimit}</TableCell>
                                    <TableCell className="text-right px-6">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditor(c)} className="text-indigo-600 hover:bg-indigo-50 font-bold uppercase text-[10px] tracking-widest">
                                            Update
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Editor Sheet */}
            <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <SheetContent className="sm:max-w-xl p-0 overflow-y-auto bg-white border-l border-gray-100">
                    <div className="h-24 bg-indigo-600 flex items-center px-8 text-white">
                        <GraduationCap size={32} />
                        <span className="ml-4 font-bold text-xl">Cohort Settings</span>
                    </div>

                    <div className="p-8 space-y-8 pb-32">
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold text-slate-800">{editingCohort.id ? "Update Cohort" : "Create New Program"}</SheetTitle>
                            <SheetDescription>Use the editor below to format requirements and rules.</SheetDescription>
                        </SheetHeader>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Cohort Name</label>
                                <Input className="bg-white border-gray-200" value={editingCohort.name} onChange={(e) => setEditingCohort({...editingCohort, name: e.target.value})} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Requirements & Description</label>
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={editingCohort.description || ""}
                                        onChange={(val) => setEditingCohort({...editingCohort, description: val})}
                                        className="h-40 mb-12"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Start Date</label>
                                    <Input type="date" value={editingCohort.startDate} onChange={(e) => setEditingCohort({...editingCohort, startDate: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">End Date</label>
                                    <Input type="date" value={editingCohort.endDate} onChange={(e) => setEditingCohort({...editingCohort, endDate: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="absolute bottom-0 w-full p-8 bg-gray-50 border-t border-gray-100 flex flex-row gap-4">
                        <Button variant="ghost" onClick={() => setIsEditorOpen(false)} className="flex-1 font-bold text-slate-400">Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl shadow-lg">
                            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                            Save Changes
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}