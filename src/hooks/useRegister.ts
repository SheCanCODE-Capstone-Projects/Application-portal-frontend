import { authService } from "@/services/auth/auth-service";
import { RegisterFormData } from "@/hooks/useRegisterForm";

export const useRegister = () => {
    const register = async (data: RegisterFormData) => {
        try {
            return await authService.register(data);
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return { register };
};
