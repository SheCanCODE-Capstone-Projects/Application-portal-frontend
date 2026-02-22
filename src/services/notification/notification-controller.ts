export const NOTIFICATION_ROUTES = {
    ALL_NOTIFICATIONS: "/api/v1/notifications",
    UNREAD_NOTIFICATIONS: "/api/v1/notifications/unread",
    UNREAD_COUNT: "/api/v1/notifications/unread/count",
    MARK_AS_READ: "/api/v1/notifications/{id}/read",
    MARK_ALL_AS_READ: "/api/v1/notifications/read-all",
    DELETE: "/api/v1/notifications/{id}", // Added DELETE route

    // Admin notifications
    ADMIN_ALL: "/api/v1/admin/notifications",
    ADMIN_UNREAD: "/api/v1/admin/notifications/unread",
    ADMIN_UNREAD_COUNT: "/api/v1/admin/notifications/unread/count",
    ADMIN_MARK_AS_READ: "/api/v1/admin/notifications/{id}/read",
    ADMIN_MARK_ALL_AS_READ: "/api/v1/admin/notifications/read-all",
};