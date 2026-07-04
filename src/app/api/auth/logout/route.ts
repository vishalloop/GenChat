import { clearAuthCookie, getAuthCookie } from "@/app/lib/cookie";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { setBlacklistToken } from "@/server/services/token-blacklist.service";
import erroResponse from "@/server/utils/api-response";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST() : Promise<NextResponse> {
    try {
        await getCurrentUser();

        const token = getAuthCookie();

        await setBlacklistToken(token as unknown as string);

        await clearAuthCookie();

        return NextResponse.json<ApiResponse>({
            success : true,
            message : "User logged out successfully."
        },{
            status : 200,
        })
    } catch (error) {
        return erroResponse(error);
    }
}