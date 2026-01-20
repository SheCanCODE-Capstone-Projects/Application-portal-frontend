import {resendVerificationService} from "@/services/auth/auth-service";


export const resendVerificationRoute = async (email: string) => {
    try {
        const data = await resendVerificationService(email);
        return data;
    } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Failed to resend verification email";
        throw new Error(msg);
    }
};
