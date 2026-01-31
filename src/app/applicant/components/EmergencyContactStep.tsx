"use client";

import { useState, useEffect } from "react";
import { Users, Phone, ArrowRight, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { EmergencyContactDto } from "@/types/application/application";
import { toast } from "sonner";

export default function EmergencyContactStep({ initialData, onNext, onBack, saving }: any) {
    const [contacts, setContacts] = useState<EmergencyContactDto[]>([
        { name: "", relationship: "", phone: "" }
    ]);

    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setContacts(initialData);
        }
    }, [initialData]);

    const addContact = () => setContacts([...contacts, { name: "", relationship: "", phone: "" }]);
    const updateContact = (index: number, field: keyof EmergencyContactDto, value: string) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    const handleNext = () => {
        if (contacts.some(c => !c.name || !c.phone || !c.relationship)) {
            toast.error("Please complete all fields for emergency contacts.");
            return;
        }
        onNext(contacts);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                {contacts.map((contact, index) => (
                    <div key={index} className="p-6 border border-gray-200 rounded-3xl space-y-4 bg-gray-50/30 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Full Name</label>
                                <input
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    value={contact.name}
                                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                                    placeholder="Contact Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Relationship</label>
                                <input
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    placeholder="e.g. Parent, Sibling"
                                    value={contact.relationship}
                                    onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Phone Number</label>
                                <input
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    value={contact.phone}
                                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                                    placeholder="+250..."
                                />
                            </div>
                        </div>
                        {contacts.length > 1 && (
                            <button onClick={() => setContacts(contacts.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={addContact} className="flex items-center gap-2 text-emerald-700 font-bold text-sm ml-2">
                <Plus size={18} /> Add Another Contact
            </button>

            <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button onClick={onBack} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={saving}
                    className="flex-[2] py-4 bg-[#0f5d3f] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#0a4330] transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
                </button>
            </div>
        </div>
    );
}