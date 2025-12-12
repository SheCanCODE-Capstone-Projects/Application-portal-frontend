'use client';

import React, { useState } from 'react';
import { StepProps } from '../types/form.types';
import { Loader2 } from 'lucide-react';

const ReviewStep: React.FC<StepProps> = ({ formData, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const submitData = new FormData();

    // Append personal info
    Object.entries(formData.personalInfo).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    // Append education and work experience as JSON
    submitData.append('education', JSON.stringify(formData.education));
    submitData.append('workExperience', JSON.stringify(formData.workExperience));

    // Append files
    if (formData.cv) submitData.append('cv', formData.cv);
    if (formData.coverLetter) submitData.append('coverLetter', formData.coverLetter);
    formData.certificates.forEach((file, index) => {
      submitData.append(`certificate_${index}`, file);
    });

    try {
      const response = await fetch('/api/v1/applications', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        alert('Application submitted successfully! 🎉');
        // Optionally redirect: window.location.href = '/success';
      } else {
        const error = await response.json();
        alert(`Submission failed: ${error.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span>{' '}
            <span className="text-gray-600">
              {formData.personalInfo.firstName} {formData.personalInfo.lastName}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>{' '}
            <span className="text-gray-600">{formData.personalInfo.email}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Phone:</span>{' '}
            <span className="text-gray-600">{formData.personalInfo.phone}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Address:</span>{' '}
            <span className="text-gray-600">{formData.personalInfo.address}</span>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0">
            <p className="text-sm mb-1">
              <span className="font-medium text-gray-700">Institution:</span>{' '}
              <span className="text-gray-600">{edu.name}</span>
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium text-gray-700">Degree:</span>{' '}
              <span className="text-gray-600">{edu.degree}</span>
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium text-gray-700">Grade:</span>{' '}
              <span className="text-gray-600">{edu.grade}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-700">Period:</span>{' '}
              <span className="text-gray-600">
                {edu.startDate} - {edu.endDate}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Work Experience */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Work Experience</h3>
        {formData.workExperience.map((work, index) => (
          <div key={index} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0">
            <p className="text-sm mb-1">
              <span className="font-medium text-gray-700">Company:</span>{' '}
              <span className="text-gray-600">{work.company}</span>
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium text-gray-700">Position:</span>{' '}
              <span className="text-gray-600">{work.position}</span>
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium text-gray-700">Duration:</span>{' '}
              <span className="text-gray-600">{work.duration}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-700">Responsibilities:</span>{' '}
              <span className="text-gray-600">{work.responsibilities}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">Documents</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-700">CV:</span>{' '}
            <span className="text-gray-600">{formData.cv?.name || 'Not uploaded'}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Cover Letter:</span>{' '}
            <span className="text-gray-600">{formData.coverLetter?.name || 'Not uploaded'}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Certificates:</span>{' '}
            <span className="text-gray-600">{formData.certificates.length} file(s)</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-emerald-700 text-white font-medium rounded-lg hover:bg-emerald-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;