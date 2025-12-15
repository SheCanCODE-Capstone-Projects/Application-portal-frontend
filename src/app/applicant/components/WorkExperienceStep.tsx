'use client';

import React from 'react';
import { StepProps, WorkExperience } from '../types/form.types';
import { ChevronRight, X } from 'lucide-react';

const WorkExperienceStep: React.FC<StepProps> = ({ formData, updateFormData, onNext, onBack }) => {
  const handleInputChange = (index: number, field: keyof WorkExperience, value: string) => {
    const updatedWork = formData.workExperience.map((work, i) =>
      i === index ? { ...work, [field]: value } : work
    );
    updateFormData({ workExperience: updatedWork });
  };

  const addWorkExperience = () => {
    updateFormData({
      workExperience: [
        ...formData.workExperience,
        { company: '', position: '', duration: '', responsibilities: '' },
      ],
    });
  };

  const removeWorkExperience = (index: number) => {
    if (formData.workExperience.length > 1) {
      updateFormData({
        workExperience: formData.workExperience.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {formData.workExperience.map((work, index) => (
        <div key={index} className="p-3 sm:p-4 md:p-6 border border-gray-200 rounded-lg relative">
          {/* Remove Button */}
          {formData.workExperience.length > 1 && (
            <button
              type="button"
              onClick={() => removeWorkExperience(index)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-500 hover:text-red-700 transition p-1"
              aria-label="Remove work experience"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          )}
          
          <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 pr-8">
            Work Experience {index + 1}
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Company */}
            <input
              type="text"
              value={work.company}
              onChange={(e) => handleInputChange(index, 'company', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Company name"
              required
            />
            
            {/* Position */}
            <input
              type="text"
              value={work.position}
              onChange={(e) => handleInputChange(index, 'position', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Position"
              required
            />
            
            {/* Duration */}
            <input
              type="text"
              value={work.duration}
              onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
              required
            />
            
            {/* Responsibilities */}
            <textarea
              value={work.responsibilities}
              onChange={(e) => handleInputChange(index, 'responsibilities', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Key responsibilities"
              required
            />
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addWorkExperience}
        className="w-full py-2.5 sm:py-3 text-sm sm:text-base border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition font-medium"
      >
        + Add Another Experience
      </button>

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

export default WorkExperienceStep;