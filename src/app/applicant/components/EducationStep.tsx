'use client';

import React from 'react';
import { StepProps, Education } from '../types/form.types';
import { ChevronRight, X } from 'lucide-react';

const EducationStep: React.FC<StepProps> = ({ formData, updateFormData, onNext, onBack }) => {
  const handleInputChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = formData.education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    updateFormData({ education: updatedEducation });
  };

  const addEducation = () => {
    updateFormData({
      education: [
        ...formData.education,
        { name: '', degree: '', grade: '', startDate: '', endDate: '' },
      ],
    });
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      updateFormData({
        education: formData.education.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formData.education.map((edu, index) => (
        <div key={index} className="p-4 md:p-6 border border-gray-200 rounded-lg relative">
          {formData.education.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
            >
              <X size={20} />
            </button>
          )}
          <h3 className="font-semibold text-gray-700 mb-4">Education {index + 1}</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={edu.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Institution name"
              required
            />
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Degree (e.g., Bachelor of Science)"
              required
            />
            <input
              type="text"
              value={edu.grade}
              onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="Grade/GPA (e.g., 3.8/4.0)"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Start date (e.g., Jan 2020)"
                required
              />
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="End date (e.g., Dec 2024)"
                required
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition font-medium"
      >
        + Add Another Education
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

export default EducationStep;