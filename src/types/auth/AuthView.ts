type AuthView = "login" | "register" | "forgot";

interface User {
    id: string;
    email: string;
    role: "ADMIN" | "APPLICANT" | string;
    name?: string;
    cohort?: string | null;
    cohortId?: string | null;
    cohortName?: string | null;
    applicationStatus?: "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED" | "DRAFT" | "SUBMITTED";
    applicationStep?: string;
    exp?: number;
    iat?: number;
}

interface UserProfile {
    id: string;
    username: string;
    email: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    cohortId: string | null;
    cohortName: string | null;
    createdAt: string;
}

interface AuthContextType {
    view: AuthView;
    setView: (view: AuthView) => void;
    user: User | null;
    userProfile: UserProfile | null;
    isAuthenticated: boolean;
    loginWithToken: (token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    refreshProfile: () => Promise<UserProfile | null>;
    hasCohort: boolean;
}

export type { AuthContextType, AuthView, User, UserProfile };
