import { useState } from "react";
import { toast } from "sonner";

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const sendResetLink = async (email: string) => {
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send reset link");
            }

            toast.success(data.message || "Reset link sent!");
            return data;
        } catch (err: unknown) {
            let msg = "Failed to send reset link";
            if (err instanceof Error) msg = err.message;
            toast.error(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendResetLink };
};