import { Document } from "mongoose";

export interface UserDocument extends IUser , Document{
    comparePassword(candidatePassword : string) : Promise<boolean>,
}

export interface IUser {
    name : string;
    email : string;
    password : string;
    role? : string;
    googleId? : string;
    createdAt? : Date;
    updatedAt? : Date;
}

export interface jwtPayload {
    id : string;
    email? : string;
}