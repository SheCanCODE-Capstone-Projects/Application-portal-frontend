// hooks/useVerifyEmail.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {VerificationStatus} from "@/types/verificationstatus";
import {verifyEmailRoute} from "@/app/api/verifyEmail/route";


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
                const data = await verifyEmailRoute(token);
                setStatus("success");
                setMessage(data.message || "Email verified successfully!");
                toast.success(data.message || "Email verified successfully!");
            } catch (err: any) {
                const msg = err.response?.data?.message || err.message || "Verification failed";
                setStatus("error");
                setMessage(msg);
                toast.error(msg);
            }
        };

        verify();
    }, [token]);

    return { status, message };
};
