import { useState } from "react";

export const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false);

    const sendGoogleAuth = () => {
        setLoading(true);

        window.location.href = "/api.ts/auth/google";
    };

    return { loading, sendGoogleAuth };
}