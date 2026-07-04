import redis from "@/app/lib/redis";

export async function setBlacklistToken(token:string) : Promise<void> {
    await redis.set(token, "Blacklisted" , "EX" , 60 * 60 * 24 * 7);
}

export async function getBlacklistToken(token:string) : Promise<string | null> {
    return redis.get(token);
}