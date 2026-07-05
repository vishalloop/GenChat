import { IMessage, MessageDocument } from "@/types/message.types";
import MessageModel from "../models/message.model";

export function createMessage(data : IMessage) {
    return MessageModel.create(data);
};

export function getMessages(chatId : string) {
    return MessageModel.find({ chat : chatId }).sort({ createdAt: 1 });
};

export async function deleteMessages (chatId : string) {
    return await MessageModel.deleteMany({ chat: chatId });
};
