import Redis from "ioredis";
import { config } from "./config";

const redis = new Redis({
    host : config.REDIS_HOST,
    port : Number(config.REDIS_PORT),
    password : config.REDIS_PASSWORD,
});

redis.on("connect" , () => {
    console.log("Redis is connected successfully.");
});

redis.on("error" , (err) => {
    console.log("Redis Error: " , err);
});

export default redis;