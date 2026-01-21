import {LoginFormData} from "@/types/LoginFormData";


export const useUserLogin = () => {
    const login = async (data: LoginFormData) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Something went wrong");
        }
        return result;
    }

    return { login };
}