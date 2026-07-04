import { ApiError } from "@/server/utils/api-error";
import { IConfig } from "@/types/config.types";

function required (key : string) : string{
    const value = process.env[key];

    if(!value) {
        throw new ApiError(`${key} is not found`);
    }

    return value;
};

export const config : IConfig = {
    MONGO_URI : required("MONGO_URI"),
    JWT_SECRET : required("JWT_SECRET"),
    NODE_ENV : required("NODE_ENV"),
    REDIS_HOST : required("REDIS_HOST"),
    REDIS_PORT : required("REDIS_PORT"),
    REDIS_PASSWORD : required("REDIS_PASSWORD"),
}