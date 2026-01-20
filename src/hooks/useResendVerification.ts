import { useState } from "react";
import { toast } from "sonner";
import {resendVerificationRoute} from "@/app/api/resendverification/route";

export const useResendVerification = () => {
    const [loading, setLoading] = useState(false);

    const resend = async (email: string) => {
        if (!email) {
            toast.error("Email not provided. Cannot resend verification.");
            return;
        }

        try {
            setLoading(true);
            const data = await resendVerificationRoute(email);
            toast.success(data.message || "Verification email sent!");
        } catch (err: any) {
            toast.error(err.message || "Failed to resend verification email");
        } finally {
            setLoading(false);
        }
    };

    return { loading, resend };
};
