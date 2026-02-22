// Update your existing User type
export interface User {
    id: string;
    email: string;
    username: string;
    status: string;
    cohortId?: string;
    cohortName?: string;
    createdAt: string;
    provider?: string; // <-- NEW
    role?: string;     // <-- NEW
}

// --- NEW TYPES ---
export interface SynchronizedUser {
    id: string;
    fullName: string;
    phoneNumber: string;
    originSystemId: string;
    cohortJoined: string;
    applicationDate: string;
    role: string;
    provider: string;
    syncedAt: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: any;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}