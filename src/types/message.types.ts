import mongoose from "mongoose";

export interface IMessage {
    user : mongoose.Schema.Types.ObjectId | string,
    chat : mongoose.Schema.Types.ObjectId | string,
    content : string,
    role : string,
    createdAt? : Date,
    updatedAt? : Date,
}

export interface MessageDocument extends IMessage , Document {}

export interface messsageResponse {
    chatId: string;
    answer: string;
    userMessageId: mongoose.Schema.Types.ObjectId;
    assistantMessageId: mongoose.Schema.Types.ObjectId;
}