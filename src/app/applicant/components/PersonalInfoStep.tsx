'use client';

import React from 'react';
import { StepProps } from '../types/form.types';
import { ChevronRight } from 'lucide-react';

const PersonalInfoStep: React.FC<StepProps> = ({ formData, updateFormData, onNext }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({
      personalInfo: {
        ...formData.personalInfo,
        [name]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.personalInfo.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            placeholder="First name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.personalInfo.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.personalInfo.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          placeholder="your.email@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.personalInfo.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
          placeholder="+250 123 456 789"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.personalInfo.address}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
          placeholder="Your full address"
          required
        />
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
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

export default PersonalInfoStep;