import { connectToDB } from "@/lib/db";
import { getAuthCookie, clearAuthCookie } from "@/lib/cookie"; // Add clearAuthCookie
import { ApiError } from "../utils/api-error";
import { getBlacklistToken } from "../services/token-blacklist.service";
import { verifyToken } from "@/lib/jwt";
import { findUserById } from "../dao/auth.dao";
import { UserDocument } from "@/types/user.types";

export async function getCurrentUser () : Promise<UserDocument> {
    const token = await getAuthCookie(); // Make sure this is awaited

    if(!token) {
        throw new ApiError("Unauthorized access.", 401);
    };

    const isTokenBlackListed = await getBlacklistToken(token);

    if(isTokenBlackListed) {
        await clearAuthCookie(); // Clear invalid cookie from browser
        throw new ApiError("Unauthorized access.", 401);
    };

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch {
        await clearAuthCookie(); // Clear invalid cookie from browser
        throw new ApiError("Unauthorized Access: Invalid or expired token.", 401);
    };

    await connectToDB();
    const user = await findUserById(decoded.id);

    if(!user) {
        await clearAuthCookie(); // Clear invalid cookie from browser
        throw new ApiError("Unauthorized Access.", 401);
    }

    return user;
}