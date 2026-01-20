import {verifyEmailService} from "@/services/auth/auth-service";

export const verifyEmailRoute = async (token: string) => {
    return await verifyEmailService(token);
}