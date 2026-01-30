export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface Application {
  id: string;
  title: string;
  status: string;
  submittedAt: string;
  cohort: string;
}

export interface ApplicationProgress {
  id: string;
  personalInfo: number;
  academicHistory: number;
  references: number;
  documents: number;
  overall: number;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'APP-2025-001',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+250 788 123 456',
          role: 'applicant'
        });
      }, 500);
    });
  },

  async getApplications(): Promise<Application[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([{
          id: 'APP-2025-001',
          title: 'Software Engineering Program',
          status: 'under_review',
          submittedAt: '2024-12-15T00:00:00Z',
          cohort: 'Spring 2025'
        }]);
      }, 500);
    });
  },

  async getApplicationProgress(applicationId: string): Promise<ApplicationProgress> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: applicationId,
          personalInfo: 100,
          academicHistory: 100,
          references: 75,
          documents: 50,
          overall: 75
        });
      }, 500);
    });
  }
};