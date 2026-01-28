// src/app/api/auth/login/route.ts
import { authService } from "@/services/auth/auth-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const backendRes = await authService.login(body);

        // 1. Get the cookies from backend headers
        const setCookieHeader = backendRes.headers['set-cookie'];

        // 2. Extract access_token value if it exists
        let accessToken = backendRes.data?.access_token; // Check if it's already in the body

        if (!accessToken && setCookieHeader) {
            // Manual extraction if it's ONLY in the cookie
            const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join(';') : setCookieHeader;
            const match = cookieString.match(/access_token=([^;]+)/);
            if (match) accessToken = match[1];
        }

        // 3. Return the data AND the token so the frontend can use it
        return NextResponse.json({
            ...backendRes.data,
            access_token: accessToken
        }, { status: 200 });

    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "Login failed";
        return NextResponse.json({ message }, { status: error.response?.status || 400 });
    }
}