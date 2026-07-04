import { cookies } from "next/headers";
import { config } from "./config";

const AUTH_COOKIE_NAME : string = "token";
const WEEK_IN_DAYS : number = 60 * 60 * 24 * 7;

export async function setAuthCookie (token : string) : Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME , token , {
        httpOnly : true,
        secure : config.NODE_ENV === "production",
        sameSite : "lax",
        path : "/",
        maxAge : WEEK_IN_DAYS,
    });
};

export async function getAuthCookie () : Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get(AUTH_COOKIE_NAME)?.value;
};

export async function clearAuthCookie() : Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(AUTH_COOKIE_NAME);
}