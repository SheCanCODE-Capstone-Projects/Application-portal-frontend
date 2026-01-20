"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import {AuthProvider, useAuth} from "@/context/AuthContext";

export default function AuthSwitcher() {
    return (
        <AuthProvider>
            <AuthSwitcherContent />
        </AuthProvider>
    );
}

function AuthSwitcherContent() {
    const { view } = useAuth();

    return (
        <>
            {view === "login" && <LoginForm />}
            {view === "register" && <RegisterForm />}
            {view === "forgot" && <ForgotPasswordForm />}
        </>


    );
}
