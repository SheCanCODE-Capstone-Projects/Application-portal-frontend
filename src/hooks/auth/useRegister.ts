import { RegisterFormData } from "@/types/auth/register";

export const useRegister = () => {
    const register = async (data: RegisterFormData) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Registration failed");
        }
        return result;
    };

    return { register };
};