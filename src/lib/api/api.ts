import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    withCredentials: true,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Only run on client side
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Only run on client side
            if (typeof window !== "undefined") {
                // Clear token and redirect to login
                localStorage.removeItem("access_token");
                
                // Don't redirect if already on login page
                if (!window.location.pathname.includes("/login")) {
                    const currentPath = window.location.pathname + window.location.search;
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                }
            }
        }

        return Promise.reject(error);
    }
);

// Helper to create authenticated request config
export function getAuthConfig() {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
}
