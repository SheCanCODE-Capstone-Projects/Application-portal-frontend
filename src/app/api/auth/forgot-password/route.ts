import { NextResponse } from "next/server";
import { authService } from "@/services/auth/auth-service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const data = await authService.forgotPassword(email);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send reset link";
        return NextResponse.json({ message }, { status: 400 });
    }
}
