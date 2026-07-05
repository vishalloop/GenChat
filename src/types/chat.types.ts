import mongoose, { Document } from "mongoose";

export interface IChat {
    user : mongoose.Schema.Types.ObjectId | string;
    title : string;
    createdAt? : Date,
    updatedAt? : Date,
}

export interface ChatDocumment extends IChat , Document {}

export interface chatResponse {
    chat: ChatDocumment[];
}