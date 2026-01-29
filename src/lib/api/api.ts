import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    withCredentials: true,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

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


api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (typeof window !== "undefined") {

                localStorage.removeItem("access_token");

                if (!window.location.pathname.includes("/login")) {
                    const currentPath = window.location.pathname + window.location.search;
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                }
            }
        }

        return Promise.reject(error);
    }
);

export function getAuthConfig() {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
}
