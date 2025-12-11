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
    <form onSubmit={handleSubmit} className="space-y-6">
      {formData.workExperience.map((work, index) => (
        <div key={index} className="p-4 md:p-6 border border-gray-200 rounded-lg relative">
          {formData.workExperience.length > 1 && (
            <button
              type="button"
              onClick={() => removeWorkExperience(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
            >
              <X size={20} />
            </button>
          )}
          <h3 className="font-semibold text-gray-700 mb-4">Work Experience {index + 1}</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={work.company}
              onChange={(e) => handleInputChange(index, 'company', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Company name"
              required
            />
            <input
              type="text"
              value={work.position}
              onChange={(e) => handleInputChange(index, 'position', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Position/Job title"
              required
            />
            <input
              type="text"
              value={work.duration}
              onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
              required
            />
            <textarea
              value={work.responsibilities}
              onChange={(e) => handleInputChange(index, 'responsibilities', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Key responsibilities and achievements"
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addWorkExperience}
        className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition font-medium"
      >
        + Add Another Experience
      </button>

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

export default WorkExperienceStep;