import Redis from "ioredis";
import { config } from "./config";

const globalForRedis = globalThis as unknown as { redis: Redis };

export const redis =
    globalForRedis.redis ??
    new Redis({
        host: config.REDIS_HOST,
        port: Number(config.REDIS_PORT),
        password: config.REDIS_PASSWORD,
    });

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}

redis.on("connect", () => {
    console.log("Connected to redis successfully.");
});

redis.on("error", (err) => {
    console.log("Redis Error:", err);
});

export default redis;