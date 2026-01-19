const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export const googleAuthApi = {
  login: () => {
    window.location.href = `${API_BASE}/api/v1/auth/google/login`;
  },

  signup: () => {
    window.location.href = `${API_BASE}/api/v1/auth/google/signup`;
  },
};
