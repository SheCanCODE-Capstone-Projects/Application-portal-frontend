import {NextResponse} from "next/server";
import {authService} from "@/services/auth/auth-service";

export async function POST(req: Request) {

    try {
        const payload = await req.json()
        const { token, newPassword } = payload;

        if (!token || !newPassword) {
            return NextResponse.json({ message: "Email and newPassword are required"},
                { status: 400}
            )
        }

        const data = await authService.resetPassword(payload);
        return NextResponse.json(
           data, {
                status: 200
            }
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to verify the email";
        return NextResponse.json({
            message,
        },
            {
                status: 400
            })
    }
}