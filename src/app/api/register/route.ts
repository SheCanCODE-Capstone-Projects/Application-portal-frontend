import { NextResponse } from "next/server";
import { authService } from "@/services/auth/auth-service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = await authService.register(body);

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Registration failed" },
            { status: 400 }
        );
    }
}
