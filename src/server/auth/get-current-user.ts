import { connectToDB } from "@/app/lib/db";
import { getAuthCookie } from "@/app/lib/cookie";
import { ApiError } from "../utils/api-error";
import { getBlacklistToken } from "../services/token-blacklist.service";
import { verifyToken } from "@/app/lib/jwt";
import { findUserById } from "../dao/auth.dao";
import { UserDocument } from "@/types/user.types";

export async function getCurrentUser () : Promise<UserDocument> {

        const token = getAuthCookie();

        if(!token) {
            throw new ApiError("Unauthorized access.", 401);
        };

        const isTokenBlackListed = await getBlacklistToken(token as unknown as string);

        if(isTokenBlackListed) {
            throw new ApiError("Unauthorized access.", 401);
        };

        let decoded;
        try {
            decoded = verifyToken(token as unknown as string);
        } catch {
            throw new ApiError("Unauthorized Access: Invalid or expired token.", 401);
        };

        await connectToDB();

        const user = await findUserById(decoded.id);

        if(!user) {
            throw new ApiError("Unauthorized Access.", 401);
        }

        return user;

}