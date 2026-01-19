'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { onboardingUtils } from '@/utils/onboarding';
import { ROLE_ROUTES } from '@/constants/roles';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedCohort, setSelectedCohort] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (onboardingUtils.isCompleted() && user) {
      router.push(ROLE_ROUTES[user.role]);
    }
  }, [user, router]);

  const handleComplete = () => {
    onboardingUtils.setCompleted();
    if (user) {
      router.push(ROLE_ROUTES[user.role]);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1ed] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#0f5d3f] mb-4">
              Welcome to the Application Portal!
            </h1>
            <p className="text-gray-600 mb-8">
              We're excited to have you here. Let's get you started with a quick introduction.
            </p>
            <button
              onClick={() => setStep(2)}
              className="bg-[#0f5d3f] text-white px-6 py-3 rounded-full hover:bg-[#0d4e35] transition"
            >
              Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-[#0f5d3f] mb-4">
              Select Your Cohort
            </h2>
            <p className="text-gray-600 mb-6">
              Choose the cohort you'd like to apply to:
            </p>
            <div className="space-y-4 mb-8">
              {['Cohort 2025 Spring', 'Cohort 2025 Summer', 'Cohort 2025 Fall'].map((cohort) => (
                <label
                  key={cohort}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedCohort === cohort
                      ? 'border-[#0f5d3f] bg-[#0f5d3f]/5'
                      : 'border-gray-300 hover:border-[#0f5d3f]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="cohort"
                    value={cohort}
                    checked={selectedCohort === cohort}
                    onChange={(e) => setSelectedCohort(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-lg font-medium text-gray-800">{cohort}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedCohort}
                className="bg-[#0f5d3f] text-white px-6 py-3 rounded-full hover:bg-[#0d4e35] disabled:bg-gray-400 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0f5d3f] mb-4">
              You're All Set!
            </h2>
            <p className="text-gray-600 mb-8">
              You've selected <strong>{selectedCohort}</strong>. You can now proceed to complete your application form.
            </p>
            <button
              onClick={handleComplete}
              className="bg-[#0f5d3f] text-white px-6 py-3 rounded-full hover:bg-[#0d4e35] transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
