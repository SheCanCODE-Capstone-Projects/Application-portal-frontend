import { NextResponse } from "next/server";
import { authService } from "@/services/auth/auth-service";
import {RegisterFormData} from "@/types/auth/register";

export async function POST(req: Request) {
    try {
        const body: RegisterFormData = await req.json();

        console.log("Register route received body:", body);

        const data = await authService.register(body);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Registration failed";

        console.error("Registration error:", message);
        return NextResponse.json(
            { message },
            { status: 400 }
        );
    }
}
