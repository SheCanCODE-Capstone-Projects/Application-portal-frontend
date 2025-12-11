'use client';

import React from 'react';
import { StepProps } from '../types/form.types';
import { ChevronRight, Upload, X } from 'lucide-react';

const DocumentsStep: React.FC<StepProps> = ({ formData, updateFormData, onNext, onBack }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'cv' | 'coverLetter') => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      updateFormData({ [fieldName]: file });
    } else {
      alert('Please upload only PDF or JPG files');
    }
  };

  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type === 'application/pdf' || file.type.startsWith('image/')
    );
    updateFormData({ certificates: [...formData.certificates, ...files] });
  };

  const removeCertificate = (index: number) => {
    updateFormData({
      certificates: formData.certificates.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cv) {
      alert('Please upload your CV');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CV / Resume <span className="text-red-500">*</span> (PDF or JPG)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition">
          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => handleFileUpload(e, 'cv')}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="cursor-pointer text-emerald-700 font-medium hover:text-emerald-800"
          >
            {formData.cv ? (
              <span className="text-gray-700">✓ {formData.cv.name}</span>
            ) : (
              'Click to upload CV'
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter (PDF or JPG)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition">
          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => handleFileUpload(e, 'coverLetter')}
            className="hidden"
            id="cover-upload"
          />
          <label
            htmlFor="cover-upload"
            className="cursor-pointer text-emerald-700 font-medium hover:text-emerald-800"
          >
            {formData.coverLetter ? (
              <span className="text-gray-700">✓ {formData.coverLetter.name}</span>
            ) : (
              'Click to upload Cover Letter'
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2">Optional</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certificates (PDF or JPG)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition">
          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg"
            multiple
            onChange={handleMultipleFileUpload}
            className="hidden"
            id="cert-upload"
          />
          <label
            htmlFor="cert-upload"
            className="cursor-pointer text-emerald-700 font-medium hover:text-emerald-800"
          >
            Click to upload Certificates (multiple files)
          </label>
          <p className="text-xs text-gray-500 mt-2">Optional - You can upload multiple files</p>
        </div>
        {formData.certificates.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.certificates.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeCertificate(index)}
                  className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition flex items-center gap-2"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </form>
  );
};

export default DocumentsStep;