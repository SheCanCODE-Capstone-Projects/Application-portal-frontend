"use client";

import RegisterForm from "@/app/components/auth/RegisterForm";
import LoginForm from "@/app/components/auth/LoginForm";
import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";
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
