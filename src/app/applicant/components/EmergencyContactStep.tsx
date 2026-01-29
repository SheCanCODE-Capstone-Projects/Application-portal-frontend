"use client";

import { useState } from "react";
import { Users, Phone, ArrowRight, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { EmergencyContactDto } from "@/types/application/application";

export default function EmergencyContactStep({ onNext, onBack, saving }: any) {
    const [contacts, setContacts] = useState<EmergencyContactDto[]>([
        { name: "", relationship: "", phone: "" }
    ]);

    const addContact = () => setContacts([...contacts, { name: "", relationship: "", phone: "" }]);
    const updateContact = (index: number, field: keyof EmergencyContactDto, value: string) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                {contacts.map((contact, index) => (
                    <div key={index} className="p-6 border border-gray-200 rounded-3xl space-y-4 bg-gray-50/30 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Full Name</label>
                                <input
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={contact.name}
                                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Relationship</label>
                                <input
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. Parent, Sibling"
                                    value={contact.relationship}
                                    onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Phone Number</label>
                                <input
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={contact.phone}
                                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                                />
                            </div>
                        </div>
                        {contacts.length > 1 && (
                            <button onClick={() => setContacts(contacts.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-red-500">
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
                <button onClick={onBack} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400">
                    Back
                </button>
                <button
                    onClick={() => onNext(contacts)}
                    disabled={saving || contacts.some(c => !c.name || !c.phone)}
                    className="flex-[2] py-4 bg-[#0f5d3f] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
                </button>
            </div>
        </div>
    );
}