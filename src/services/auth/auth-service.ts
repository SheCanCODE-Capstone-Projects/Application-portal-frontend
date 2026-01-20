import axios from "axios";
import { RegisterFormData } from "@/hooks/useRegisterForm";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authService = {
    register: async (payload: RegisterFormData) => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/auth/register`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    },
};

export const verifyEmailService = async (token: string) => {
    const res = await axios.post(`${BACKEND_URL}/api/v1/auth/verify-email`, { token }, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return res.data; 
}

export const resendVerificationService = async (email: string) => {
    const res = await axios.post(`${BACKEND_URL}/api/v1/auth/resend-verification`, {email});
    return res.data;
}

