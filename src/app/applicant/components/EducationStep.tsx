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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {formData.education.map((edu, index) => (
        <div key={index} className="p-3 sm:p-4 md:p-6 border border-gray-200 rounded-lg relative">
          {/* Remove Button */}
          {formData.education.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-500 hover:text-red-700 transition p-1"
              aria-label="Remove education"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          )}
          
          <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 pr-8">
            Education {index + 1}
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Institution */}
            <input
              type="text"
              value={edu.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
              placeholder="Institution name"
              required
            />
            
            {/* Degree */}
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
              placeholder="Degree"
              required
            />
            
            {/* Grade */}
            <input
              type="text"
              value={edu.grade}
              onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
              placeholder="Grade/GPA"
              required
            />
            
            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
                placeholder="Start date"
                required
              />
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
                placeholder="End date"
                required
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addEducation}
        className="w-full py-2.5 sm:py-3 text-sm sm:text-base border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition font-medium"
      >
        + Add Another Education
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

export default EducationStep;