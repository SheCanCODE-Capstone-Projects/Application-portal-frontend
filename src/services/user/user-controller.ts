export const USER_ROUTES = {
    ME: "/api/v1/users/me",
    APPLY_COHORT: "/api/v1/users/apply/{cohortId}",

    // Admin only
    GET_ALL: "/api/v1/users",
    DELETE: "/api/v1/users/{id}",
    ARCHIVE: "/api/v1/users/{id}/archive",
};
