import { NextResponse } from "next/server";
import { googleAuthService } from "@/services/auth/auth-service";

export async function GET() {
    const redirectUrl = googleAuthService.signup();
    return NextResponse.redirect(redirectUrl);
}