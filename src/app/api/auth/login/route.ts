import {LoginFormData} from "@/types/LoginFormData";
import {authService} from "@/services/auth/auth-service";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const body : LoginFormData = await req.json();
        console.log("login route received body:", body);

        const data = await authService.login(body);

        return NextResponse.json( data, { status: 201});
    } catch (error) {
        const message =
            error instanceof Error
        ? error.message
                : "Login failed";
        console.error("Registration error:", message);
        return NextResponse.json(
            {
                message,
            },
            {
                status: 400
            }
        )
    }
}