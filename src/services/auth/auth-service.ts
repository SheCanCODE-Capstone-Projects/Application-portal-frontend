import {AUTH_ROUTES} from "@/services/auth/auth-controller";
import {api} from "@/lib/auth/authapi";
import {RestFormData} from "@/types/auth/RestFormData";
import {LoginFormData} from "@/types/auth/LoginFormData";
import {RegisterFormData} from "@/types/auth/register";


export const authService = {
    register: async (payload: RegisterFormData) => {
        const res = await api.post(AUTH_ROUTES.REGISTER, payload);
        return res.data;
    },

    verify: async (token: string) => {
        const res = await api.post(AUTH_ROUTES.VERIFY_EMAIL, { token });
        return res.data;
    },

    resendVerify: async (email: string) => {
        const res = await api.post(AUTH_ROUTES.RESEND_VERIFICATION, { email });
        return res.data;
    },

    forgotPassword: async (email: string) => {
        const res = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
        return res.data;
    },

    resetPassword: async (payload: RestFormData) => {
        const res = await api.post(AUTH_ROUTES.RESET_PASSWORD, payload);
        return res.data;
    },

    login: async (payload: LoginFormData) => {
        const res = await api.post(AUTH_ROUTES.LOGIN, payload);
        return res.data;
    },
};

export const googleAuthService = {
    signup: () => {
        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/google/signup`;
    },

    login: () => {
        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`;
    },
};