type AuthView = "login" | "register" | "forgot";

interface User {
    id: number;
    email: string;
    role: "ADMIN" | "APPLICANT" | string;
    name: string;
    cohort?: string | null;
    applicationStatus?: "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";
    applicationStep?: string;
}

interface AuthContextType {
    view: AuthView;
    setView: (view: AuthView) => void;
    user: User | null;
    isAuthenticated: boolean;
    loginWithToken: (token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export type { AuthContextType, AuthView, User };