import { toast } from "sonner";
import { RestFormData } from "@/types/auth/RestFormData";

export const useResetPassword = () => {
    const resetPassword = async (data: RestFormData) => {
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Password reset failed");
        }

        toast.success(result.message || "Password reset successful");
        return result;
    };

    return { resetPassword };
};
