import { NextResponse } from "next/server";
import { authService } from "@/services/auth/auth-service";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        const data = await authService.verify(token);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message =
        error instanceof Error
        ? error.message
            : "Failed to verify verification email";
        return NextResponse.json(
            { message },
            { status: 400 }
        );
    }
}
