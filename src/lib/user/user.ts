import axios from "axios";

export const userApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});