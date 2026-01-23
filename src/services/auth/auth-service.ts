import {AUTH_ROUTES} from "@/services/auth/auth-controller";
import {api} from "@/lib/authapi";
import {RestFormData} from "@/types/RestFormData";
import {LoginFormData} from "@/types/LoginFormData";
import {RegisterFormData} from "@/types/register";


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
