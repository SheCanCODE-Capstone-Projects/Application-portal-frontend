import { user } from "@/lib/user/user";
import {USER_ROUTES} from "@/services/user/user-controller";


export const applicantService = {
    me: async (token: string) => {

        const res = await user.get(USER_ROUTES.ME, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res.data;
    },
};