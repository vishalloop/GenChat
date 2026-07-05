import { setAuthCookie } from "@/lib/cookie";
import { connectToDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { AuthUser } from "@/features/auth/types/auth.types";
import { findUserByEmail } from "@/server/dao/auth.dao";
import { ApiError } from "@/server/utils/api-error";
import erroResponse from "@/server/utils/api-response";
import { loginSchema } from "@/server/validators/auth.validator";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req : NextRequest) : Promise<NextResponse> {
    try {

        const body = await req.json();
        
        const result = loginSchema.safeParse(body);

        if(!result.success){
            throw new ApiError(result.error.issues[0].message , 400)
        };

        await connectToDB();

        const {data} = result;

        const isExistingUser = await findUserByEmail(data.email);

        if(!isExistingUser) {
            throw new ApiError("Email address or password is incorrect.", 401);
        };

        const isMatch = isExistingUser.comparePassword(isExistingUser.password);

        if(!isMatch) {
            throw new ApiError("Email address or password is incorrect.", 401);
        };

        const token = await generateToken({id : isExistingUser._id.toString()});

        await setAuthCookie(token);

        return NextResponse.json<ApiResponse<AuthUser>>({
            success : false,
            message : "User logged In successfully.",
            data : {
                id : isExistingUser._id.toString(),
                name : isExistingUser.name,
                email : isExistingUser.email
            }
        },{});
    } catch (error) {
        return erroResponse(error);
    }
}