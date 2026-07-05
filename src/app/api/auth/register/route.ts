import { setAuthCookie } from "@/lib/cookie";
import { connectToDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { AuthUser } from "@/features/auth/types/auth.types";
import { createUser, findUserByEmail } from "@/server/dao/auth.dao";
import { ApiError } from "@/server/utils/api-error";
import errorResponse from "@/server/utils/api-response";
import { registerSchema } from "@/server/validators/auth.validator";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) : Promise<NextResponse> {
    try {
        
        const body = await req.json();

        const result = registerSchema.safeParse(body);

        if(!result.success) {
            throw new ApiError(result.error.issues[0].message , 400);
        }

        await connectToDB();

        const { data } = result;

        const isExistingUser = await findUserByEmail(data.email)

        if(isExistingUser) {
            throw new ApiError("User already exists with this email address." , 409);
        }

        const newUser = await createUser(data);

        const token = generateToken({ id : newUser._id.toString()});

        await setAuthCookie(token);

        return NextResponse.json<ApiResponse<AuthUser>>({
            success : true,
            message : "User registered successfully.",
            data : {
                id : newUser._id.toString(),
                name : newUser.name,
                email : newUser.email,
            }
        },{
            status : 201
        })

    } catch (error) {
        return errorResponse(error);
    }
}