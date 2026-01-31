import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VerificationStatus } from "@/types/auth/verificationstatus";

export const useVerifyEmail = (token: string | null) => {
    const [status, setStatus] = useState<VerificationStatus>("verifying");
    const [message, setMessage] = useState("Verifying your email address...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            toast.error("Invalid verification link");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Verification failed");
                }

                setStatus("success");
                setMessage(data.message);
                toast.success(data.message);
            } catch (error) {
                const msg =
                    error instanceof Error ? error.message : "Verification failed";

                setStatus("error");
                setMessage(msg);
                toast.error(msg);
            }
        };

        verify();
    }, [token]);

    return { status, message };
};
