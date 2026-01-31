export interface NotificationDto {
    id: string;          // UUID
    userId: string;      // UUID
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;   // ISO LocalDateTime
    updatedAt?: string;  // ISO LocalDateTime
}
