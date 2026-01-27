import axios from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
