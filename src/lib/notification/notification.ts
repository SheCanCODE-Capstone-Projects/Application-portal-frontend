import axios from "axios";


export const notificationApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});