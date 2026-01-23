import React, { useState } from "react";
import {FieldErrors, RegisterFormData} from "@/types/register";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 8;

const hasNumber = (value: string) => /\d/.test(value);
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasSpecialChar = (value: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(value);


export const useRegisterForm = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        email: "",
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState<FieldErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: FieldErrors = {};
        const { email, username, password } = formData;

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!username) {
            newErrors.username = "Username is required";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else {
            if (password.length < passwordMinLength) {
                newErrors.password = `Password must be at least ${passwordMinLength} characters`;
            } else if (!hasNumber(password)) {
                newErrors.password = "Password must contain at least one number";
            } else if (!hasUppercase(password)) {
                newErrors.password = "Password must contain at least one uppercase letter";
            } else if (!hasLowercase(password)) {
                newErrors.password = "Password must contain at least one lowercase letter";
            } else if (!hasSpecialChar(password)) {
                newErrors.password = "Password must contain at least one special character";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof FieldErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit =
        (onSubmit: (data: RegisterFormData) => Promise<void> | void) =>
            async (e: React.FormEvent) => {
                e.preventDefault();

                if (!validate()) return;

                try {
                    setIsLoading(true);
                    await onSubmit(formData);
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
