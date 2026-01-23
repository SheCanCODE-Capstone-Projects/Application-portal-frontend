import { NextResponse } from "next/server";
import { authService } from "@/services/auth/auth-service";
import {ResendVerificationRequest} from "@/types/ResendVerificationRequest";


export async function POST(req: Request) {
    try {
        const body: ResendVerificationRequest = await req.json();

        const data = await authService.resendVerify(body.email);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to resend verification email";

        return NextResponse.json({ message }, { status: 400 });
    }
}
