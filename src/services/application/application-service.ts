

export const applicationService = {
    // Fetch the current user's application
    getMyApplication: async (token: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/applications/my-application`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            if (res.status === 404) return null; // Not found = Not applied
            throw new Error("Failed to fetch application");
        }

        const json = await res.json();
        return json.data; // Assuming ApiResponse structure { success: true, data: ... }
    },

    // Admin: Fetch all applications
    getAllApplications: async (token: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/applications`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Failed to fetch applications");
        const json = await res.json();
        return json.data;
    }
};