import { jwtPayload } from "@/types/user.types"
import jwt from "jsonwebtoken"
import { config } from "./config"

export function generateToken (data : jwtPayload) : string {
    return jwt.sign(data, config.JWT_SECRET, { expiresIn: "7d" });
};
export function verifyToken (token : string) : jwtPayload {
    return jwt.verify(token , config.JWT_SECRET) as jwtPayload;
}