import { userService } from "@/services/user/user-service";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies

export async function GET(req: Request) {
    try {
        // 1. Try to get token from cookies first
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("token") || cookieStore.get("accessToken");
        let token = tokenCookie?.value;

        // 2. If no cookie, try Authorization header
        if (!token) {
            const authHeader = req.headers.get("Authorization");
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized: No token found" },
                { status: 401 }
            );
        }

        // 3. Call the service
        const data = await userService.me(token);
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to get user data";
        // Handle 401 specifically if the backend rejects the token
        const status = message.includes("401") || message.toLowerCase().includes("unauthorized") ? 401 : 400;

        return NextResponse.json({ message }, { status });
    }
}