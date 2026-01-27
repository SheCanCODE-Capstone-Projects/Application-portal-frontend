import React, { useState } from "react";
import { RestFormData, RestFieldErrors } from "@/types/auth/RestFormData";

const passwordMinLength = 8;

const hasNumber = (value: string) => /\d/.test(value);
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasSpecialChar = (value: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(value);

export const useResetPasswordForm = () => {
    const [formData, setFormData] = useState<RestFormData>({
        token: "",
        newPassword: "",
    });

    const [errors, setErrors] = useState<RestFieldErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: RestFieldErrors = {};
        const { token, newPassword } = formData;

        if (!token) {
            newErrors.token = "Reset token is required";
        }

        if (!newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (newPassword.length < passwordMinLength) {
            newErrors.newPassword = `Password must be at least ${passwordMinLength} characters`;
        } else if (!hasNumber(newPassword)) {
            newErrors.newPassword = "Password must contain at least one number";
        } else if (!hasUppercase(newPassword)) {
            newErrors.newPassword = "Password must contain at least one uppercase letter";
        } else if (!hasLowercase(newPassword)) {
            newErrors.newPassword = "Password must contain at least one lowercase letter";
        } else if (!hasSpecialChar(newPassword)) {
            newErrors.newPassword = "Password must contain at least one special character";
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

        if (errors[name as keyof RestFieldErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmitNewPassword =
        (onSubmit: (data: RestFormData) => Promise<void>) =>
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
        handleSubmitNewPassword,
        setFormData
    };
};
