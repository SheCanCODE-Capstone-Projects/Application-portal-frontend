"use client";

import { useState } from "react";
import { FileText, ArrowRight, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { DocumentDto } from "@/types/application/application";

export default function DocumentsStep({ onNext, onBack, saving }: any) {
  const [docs, setDocs] = useState<DocumentDto[]>([
    { docType: "NATIONAL_ID", fileUrl: "" }
  ]);

  const docTypes = ["NATIONAL_ID", "DEGREE_CERTIFICATE", "TRANSCRIPT", "CV", "OTHER"];

  const addDoc = () => setDocs([...docs, { docType: "OTHER", fileUrl: "" }]);
  const removeDoc = (index: number) => setDocs(docs.filter((_, i) => i !== index));
  const updateDoc = (index: number, field: keyof DocumentDto, value: string) => {
    const newDocs = [...docs];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setDocs(newDocs);
  };

  return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          {docs.map((doc, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-3xl flex flex-col md:flex-row gap-4 items-end bg-gray-50/30">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-1">Document Type</label>
                  <select
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      value={doc.docType}
                      onChange={(e) => updateDoc(index, 'docType', e.target.value)}
                  >
                    {docTypes.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="flex-[2] space-y-2 w-full">
                  <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-1">File URL / Link</label>
                  <input
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="https://drive.google.com/..."
                      value={doc.fileUrl}
                      onChange={(e) => updateDoc(index, 'fileUrl', e.target.value)}
                  />
                </div>
                {docs.length > 1 && (
                    <button onClick={() => removeDoc(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                )}
              </div>
          ))}
        </div>

        <button onClick={addDoc} className="flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline ml-2">
          <Plus size={18} /> Add Another Document
        </button>

        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <button onClick={onBack} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Back
          </button>
          <button
              onClick={() => onNext(docs)}
              disabled={saving || docs.some(d => !d.fileUrl)}
              className="flex-[2] py-4 bg-[#0f5d3f] hover:bg-[#0a4330] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" /> : <>Save & Continue <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
  );
}