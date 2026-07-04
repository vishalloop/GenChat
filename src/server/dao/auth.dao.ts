import { IUser, UserDocument } from "@/types/user.types";
import userModel from "../models/user.model";

export function createUser (data : IUser) : Promise<UserDocument> {
    return userModel.create(data);
}

export function findUserById (id : string) : Promise <UserDocument | null> {
    return userModel.findOne({ _id : id, });
}

export function findUserByEmail (email : string) : Promise <UserDocument | null> {
    return userModel.findOne({ email });
}

export function findUserByGoogleId (googleId : string) : Promise <UserDocument | null> {
    return userModel.findOne({ googleId });
}