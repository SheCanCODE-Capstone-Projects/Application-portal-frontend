'use client';

import React, { useEffect, useState } from 'react';
import { useCohorts } from '@/hooks/admin/useCohorts';
import { Cohort } from '@/types/cohort/cohort';
import {
    Loader2, Plus, Edit, Trash2, Calendar,
    CheckCircle2, XCircle, ListPlus, Users,
    AlertCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export default function CohortsPage() {
    const { cohorts, loading, saving, fetchCohorts, createCohort, updateCohort, deleteCohort } = useCohorts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);

    // Initial Form State
    const initialFormState: Partial<Cohort> = {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        isOpen: true,
        applicationLimit: 50,
        year: new Date().getFullYear(),
        requirements: [],
        rules: [],
        roles: ['APPLICANT']
    };

    const [formData, setFormData] = useState<Partial<Cohort>>(initialFormState);

    // --- Inputs for Array Fields ---
    const [newRequirement, setNewRequirement] = useState('');
    const [newRule, setNewRule] = useState('');

    useEffect(() => {
        fetchCohorts();
    }, [fetchCohorts]);

    // --- Modal Logic ---
    const openModal = (cohort: Cohort | null = null) => {
        if (cohort) {
            setEditingCohort(cohort);
            setFormData({ ...cohort });
        } else {
            setEditingCohort(null);
            setFormData(initialFormState);
        }
        setNewRequirement('');
        setNewRule('');
        setIsModalOpen(true);
    };

    // --- Array Manipulation Helpers ---
    const addArrayItem = (
        field: 'requirements' | 'rules',
        value: string,
        setValue: (v: string) => void
    ) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), value.trim()]
        }));
        setValue('');
    };

    const removeArrayItem = (field: 'requirements' | 'rules', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
        }));
    };

    // --- Actions ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || !formData.startDate || !formData.endDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        const success = editingCohort
            ? await updateCohort(editingCohort.id, formData)
            : await createCohort(formData);

        if (success) {
            toast.success(editingCohort ? "Cohort updated!" : "Cohort created!");
            setIsModalOpen(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this cohort? This action cannot be undone.")) {
            await deleteCohort(id);
            toast.success("Cohort deleted");
        }
    };

    const toggleOpenStatus = async (cohort: Cohort) => {
        try {
            await updateCohort(cohort.id, { isOpen: !cohort.isOpen });
            toast.success(`Cohort ${!cohort.isOpen ? 'Opened' : 'Closed'}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading && cohorts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
                <p className="text-gray-500 font-medium">Loading Cohorts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cohort Management</h1>
                    <p className="text-gray-500 mt-1">Create, manage, and configure application programs.</p>
                </div>
                <Button
                    onClick={() => openModal()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/20 p-4"
                >
                    <Plus className="w-4 h-4 mr-2" /> Create New Cohort
                </Button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cohorts.map((cohort) => (
                    <Card key={cohort.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden flex flex-col">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant={cohort.isOpen ? "default" : "destructive"} className={`mb-2 ${cohort.isOpen ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'} border-0`}>
                                        {cohort.isOpen ? (
                                            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Open for Applications</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><XCircle size={16} /> Closed</span>
                                        )}
                                    </Badge>
                                    <CardTitle className="text-xl font-bold text-gray-800 line-clamp-1" title={cohort.name}>
                                        {cohort.name}
                                    </CardTitle>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6 flex-1 space-y-4">
                            <div className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                                {cohort.description || "No description provided."}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Timeline</p>
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Calendar size={14} className="text-emerald-500" />
                                        <span>{cohort.year}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Capacity</p>
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Users size={14} className="text-blue-500" />
                                        <span>{cohort.applicationLimit} Spots</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                        {cohort.requirements?.length || 0} Requirements
                                    </Badge>
                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                        {cohort.rules?.length || 0} Rules
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t border-gray-100 bg-gray-50/30 p-4 flex gap-2">
                            <Button
                                variant={cohort.isOpen ? "destructive" : "default"}
                                size="sm"
                                className={`flex-1 ${!cohort.isOpen && 'bg-emerald-600 hover:bg-emerald-700'}`}
                                onClick={() => toggleOpenStatus(cohort)}
                            >
                                {cohort.isOpen ? "Close Applications" : "Open Applications"}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => openModal(cohort)}>
                                <Edit size={16} className="text-gray-600" />
                            </Button>
                            <Button variant="outline" size="icon" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => handleDelete(cohort.id)}>
                                <Trash2 size={16} />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {/* Empty State */}
                {cohorts.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900">No Cohorts Found</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first program cohort.</p>
                        <Button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700">
                            Create Cohort
                        </Button>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            {editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure the program details, timeline, and eligibility criteria.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <form id="cohort-form" onSubmit={handleSubmit} className="space-y-6 py-4 px-1">

                            {/* Section 1: Basic Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Cohort Name *</Label>
                                        <Input
                                            placeholder="e.g. Software Engineering Cohort 4"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Academic Year</Label>
                                        <Input
                                            type="number"
                                            value={formData.year}
                                            onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Describe the program goals, curriculum summary, etc..."
                                        className="min-h-[100px] resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Timeline & Limits */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date *</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date *</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Application Limit</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.applicationLimit}
                                        onChange={e => setFormData({...formData, applicationLimit: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Requirements Builder */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-emerald-700">
                                    <ListPlus size={16} /> Requirements
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a requirement (e.g., Must have a laptop)"
                                        value={newRequirement}
                                        onChange={e => setNewRequirement(e.target.value)}
                                        onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addArrayItem('requirements', newRequirement, setNewRequirement); }}}
                                    />
                                    <Button type="button" onClick={() => addArrayItem('requirements', newRequirement, setNewRequirement)} variant="secondary">Add</Button>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 space-y-1 min-h-[60px] border border-gray-100">
                                    {formData.requirements?.map((req, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white px-3 py-2 rounded border border-gray-200 text-sm">
                                            <span>{req}</span>
                                            <button type="button" onClick={() => removeArrayItem('requirements', i)} className="text-gray-400 hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!formData.requirements || formData.requirements.length === 0) && (
                                        <p className="text-xs text-gray-400 text-center py-2">No requirements added yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Section 4: Rules Builder */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-rose-700">
                                    <AlertCircle size={16} /> Rules & Guidelines
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a rule (e.g., Mandatory attendance)"
                                        value={newRule}
                                        onChange={e => setNewRule(e.target.value)}
                                        onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addArrayItem('rules', newRule, setNewRule); }}}
                                    />
                                    <Button type="button" onClick={() => addArrayItem('rules', newRule, setNewRule)} variant="secondary">Add</Button>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 space-y-1 min-h-[60px] border border-gray-100">
                                    {formData.rules?.map((rule, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white px-3 py-2 rounded border border-gray-200 text-sm">
                                            <span>{rule}</span>
                                            <button type="button" onClick={() => removeArrayItem('rules', i)} className="text-gray-400 hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!formData.rules || formData.rules.length === 0) && (
                                        <p className="text-xs text-gray-400 text-center py-2">No rules added yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Checkbox */}
                            <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <Checkbox
                                    id="isOpen"
                                    checked={formData.isOpen}
                                    onCheckedChange={(checked) => setFormData({...formData, isOpen: checked as boolean})}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="isOpen"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Open for Applications immediately
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        If unchecked, students cannot see or apply to this cohort yet.
                                    </p>
                                </div>
                            </div>

                        </form>
                    </ScrollArea>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button
                            type="submit"
                            form="cohort-form"
                            disabled={saving}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingCohort ? 'Save Changes' : 'Create Cohort'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}