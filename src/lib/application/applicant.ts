import axios from "axios";

export const applicationApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/applications`,
    withCredentials: true, // send cookies automatically
    headers: {
        "Content-Type": "application/json",
    },
});
