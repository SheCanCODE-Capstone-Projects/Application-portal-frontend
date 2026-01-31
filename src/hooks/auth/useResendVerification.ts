import { useState } from "react";
import { toast } from "sonner";

export const useResendVerification = () => {
    const [loading, setLoading] = useState(false);

    const resend = async (email: string) => {
        if (!email) {
            toast.error("Email not provided. Cannot resend verification.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to resend verification email");
            }

            toast.success(data.message || "Verification email sent!");
        } catch (error) {
            const msg =
                error instanceof Error
                    ? error.message
                    : "Failed to resend verification email";

            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { loading, resend };
};
