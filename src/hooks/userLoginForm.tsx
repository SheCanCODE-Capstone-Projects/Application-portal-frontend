import React, { useState } from "react";
import { LoginFormData, LoginErrors } from "@/types/LoginFormData";
import { useUserLogin } from "@/hooks/userLogin";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 8;

const hasNumber = (value: string) => /\d/.test(value);
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasSpecialChar = (value: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(value);

export const useLoginForm = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<LoginErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useUserLogin();

    const validate = (): boolean => {
        const newErrors: LoginErrors = {};
        const { email, password } = formData;

        if (!email) newErrors.email = "Email is required";
        else if (!emailRegex.test(email))
            newErrors.email = "Please enter a valid email";

        if (!password) newErrors.password = "Password is required";
        else {
            if (password.length < passwordMinLength)
                newErrors.password = `Password must be at least ${passwordMinLength} characters`;
            else if (!hasNumber(password))
                newErrors.password = "Password must contain at least one number";
            else if (!hasUppercase(password))
                newErrors.password = "Password must contain at least one uppercase letter";
            else if (!hasLowercase(password))
                newErrors.password = "Password must contain at least one lowercase letter";
            else if (!hasSpecialChar(password))
                newErrors.password = "Password must contain at least one special character";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof LoginErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit =
        (rememberMe: boolean) =>
            async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (!validate()) return;

                try {
                    setIsLoading(true);
                    const result = await login(formData);
                    console.log("Login success:", result);
                } catch (error) {
                    if (error instanceof Error) {
                        setErrors({
                            email: error.message || "Login failed",
                        });
                    }

                } finally {
                    setIsLoading(false);
                }
            };

    return {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
        setErrors,
        setFormData,
    };
};
