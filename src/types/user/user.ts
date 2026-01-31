export enum UserStatus {
    ACTIVE = 'ACTIVE',
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
    DISABLED = 'DISABLED',
    ARCHIVED = 'ARCHIVED'
}

export interface UserResponse {
    id: string;           // UUID
    username: string;
    email: string;
    status: UserStatus;
    cohortId?: string;    // UUID
    cohortName?: string;
    createdAt: string;    // ISO LocalDateTime
}
