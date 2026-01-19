"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthView = "login" | "register" | "forgot";

interface AuthContextType {
    view: AuthView;
    setView: (view: AuthView) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [view, setView] = useState<AuthView>("login");

    return (
        <AuthContext.Provider value={{ view, setView }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
