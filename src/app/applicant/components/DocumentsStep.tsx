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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* CV Upload */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          CV / Resume <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-emerald-500 transition">
          <Upload className="mx-auto mb-2 text-gray-400" size={28} />
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => handleFileUpload(e, 'cv')}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="cursor-pointer text-emerald-700 text-sm sm:text-base font-medium hover:text-emerald-800"
          >
            {formData.cv ? (
              <span className="text-gray-700 break-all">✓ {formData.cv.name}</span>
            ) : (
              'Click to upload CV'
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2">PDF or JPG, max 10MB</p>
        </div>
      </div>

      {/* Cover Letter Upload */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Cover Letter
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-emerald-500 transition">
          <Upload className="mx-auto mb-2 text-gray-400" size={28} />
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => handleFileUpload(e, 'coverLetter')}
            className="hidden"
            id="cover-upload"
          />
          <label
            htmlFor="cover-upload"
            className="cursor-pointer text-emerald-700 text-sm sm:text-base font-medium hover:text-emerald-800"
          >
            {formData.coverLetter ? (
              <span className="text-gray-700 break-all">✓ {formData.coverLetter.name}</span>
            ) : (
              'Click to upload Cover Letter'
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2">Optional</p>
        </div>
      </div>

      {/* Certificates Upload */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Certificates
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-emerald-500 transition">
          <Upload className="mx-auto mb-2 text-gray-400" size={28} />
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
            className="cursor-pointer text-emerald-700 text-sm sm:text-base font-medium hover:text-emerald-800"
          >
            Click to upload Certificates
          </label>
          <p className="text-xs text-gray-500 mt-2">Multiple files allowed</p>
        </div>
        
        {/* Certificate List */}
        {formData.certificates.length > 0 && (
          <div className="mt-3 sm:mt-4 space-y-2">
            {formData.certificates.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-xs sm:text-sm text-gray-700 truncate flex-1 mr-2">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeCertificate(index)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                  aria-label="Remove certificate"
                >
                  <X size={16} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition flex items-center justify-center gap-2"
        >
          Next
          <ChevronRight size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
};

export default DocumentsStep;