export type AuthView = "login" | "register" | "forgot";

export type UserRole = "ADMIN" | "APPLICANT";

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

export interface AuthContextType {
    view: AuthView;
    setView: (view: AuthView) => void;

    user: User | null;
    isAuthenticated: boolean;

    loginWithUser: (user: User) => void;
    logout: () => void;
}
