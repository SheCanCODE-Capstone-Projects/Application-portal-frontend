// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { authService } from "@/services/auth/auth-service";
import { RegisterFormData } from "@/types/auth/register";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const body: RegisterFormData = await req.json();
        const data = await authService.register(body);
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        // ✅ Check if it's an Axios error and dig into response.data
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Registration failed";
            const status = error.response?.status || 400;

            console.error("Backend error:", message);

            return NextResponse.json({ message }, { status });
        }

        return NextResponse.json(
            { message: "Registration failed" },
            { status: 500 }
        );
    }
}