import { clearAuthCookie, getAuthCookie } from "@/lib/cookie";
import { setBlacklistToken } from "@/server/services/token-blacklist.service";
import errorResponse from "@/server/utils/api-response";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
    try {
        // 1. Get the token (Make sure to await it!)
        const token = await getAuthCookie();

        // 2. If token exists, blacklist it in Redis
        if (token) {
            await setBlacklistToken(token);
        }

        // 3. Always clear the cookie from the browser
        await clearAuthCookie();

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "User logged out successfully."
        }, {
            status: 200,
        });
    } catch (error) {
        // Even if Redis fails, make sure we clear the cookie so the user isn't stuck
        await clearAuthCookie();
        return errorResponse(error);
    }
}