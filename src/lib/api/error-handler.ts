import { AxiosError } from "axios";

export interface ApiError {
    message: string;
    code: string;
    status: number;
    details?: Record<string, string[]>;
}

export class AppError extends Error {
    public code: string;
    public status: number;
    public details?: Record<string, string[]>;

    constructor(error: ApiError) {
        super(error.message);
        this.name = "AppError";
        this.code = error.code;
        this.status = error.status;
        this.details = error.details;
    }
}

export function parseApiError(error: unknown): ApiError {
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code,
            status: error.status,
            details: error.details,
        };
    }

    if (error instanceof AxiosError) {
        const response = error.response;
        
        if (response) {
            const data = response.data;
            
            return {
                message: data?.message || data?.error || getDefaultMessage(response.status),
                code: data?.code || `HTTP_${response.status}`,
                status: response.status,
                details: data?.errors || data?.details,
            };
        }

        if (error.code === "ERR_NETWORK") {
            return {
                message: "Unable to connect to the server. Please check your internet connection.",
                code: "NETWORK_ERROR",
                status: 0,
            };
        }

        if (error.code === "ECONNABORTED") {
            return {
                message: "Request timed out. Please try again.",
                code: "TIMEOUT",
                status: 0,
            };
        }
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            code: "UNKNOWN_ERROR",
            status: 0,
        };
    }

    return {
        message: "An unexpected error occurred. Please try again.",
        code: "UNKNOWN_ERROR",
        status: 0,
    };
}

function getDefaultMessage(status: number): string {
    switch (status) {
        case 400:
            return "Invalid request. Please check your input.";
        case 401:
            return "Session expired. Please log in again.";
        case 403:
            return "You don't have permission to perform this action.";
        case 404:
            return "The requested resource was not found.";
        case 409:
            return "This operation conflicts with existing data.";
        case 422:
            return "The provided data is invalid.";
        case 429:
            return "Too many requests. Please wait a moment and try again.";
        case 500:
            return "Server error. Please try again later.";
        case 502:
        case 503:
        case 504:
            return "Service temporarily unavailable. Please try again later.";
        default:
            return "An error occurred. Please try again.";
    }
}

export function getErrorMessage(error: unknown): string {
    return parseApiError(error).message;
}

export function isAuthError(error: unknown): boolean {
    const parsed = parseApiError(error);
    return parsed.status === 401;
}

export function isNetworkError(error: unknown): boolean {
    const parsed = parseApiError(error);
    return parsed.code === "NETWORK_ERROR" || parsed.code === "TIMEOUT";
}
