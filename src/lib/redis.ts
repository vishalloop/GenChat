// src/lib/redis.ts
import Redis from "ioredis";
import { config } from "./config";

const redis = new Redis({
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
  password: config.REDIS_PASSWORD,
  tls: config.NODE_ENV === "production" ? {} : undefined,
  retryStrategy: (times) => {
    return Math.min(times * 50, 3000);
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected.");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redis;