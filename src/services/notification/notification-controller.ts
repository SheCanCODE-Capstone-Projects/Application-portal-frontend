export const NOTIFICATION_ROUTES = {
    ALL_NOTIFICATIONS: "/api/v1/notifications",
    UNREAD_NOTIFICATIONS: "/api/v1/notifications/unread",
    UNREAD_COUNT: "/api/v1/notifications/unread/count",
    MARK_AS_READ: "/api/v1/notifications/{id}/read",
    MARK_ALL_AS_READ: "/api/v1/notifications/read-all",
    DELETE: "/api/v1/notifications/{id}", // Added DELETE route
};