const ONBOARDING_KEY = 'onboarding_completed';

export const onboardingUtils = {
  isCompleted: (): boolean => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },

  setCompleted: () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },

  reset: () => {
    localStorage.removeItem(ONBOARDING_KEY);
  },
};
