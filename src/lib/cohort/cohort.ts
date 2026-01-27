import axios from "axios";

export const cohortApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
