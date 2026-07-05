import { ChatDocumment, IChat } from "@/types/chat.types";
import ChatModel from "../models/chat.model";

export function createChat(data : IChat) : Promise<ChatDocumment> {
    return ChatModel.create(data);
};

export function deleteChat(id : string) : Promise<ChatDocumment | null> {
    return ChatModel.findOneAndDelete({ _id : id });
};

export function getChats (userId : string) {
    return ChatModel.find({ user : userId }).sort({ updatedAt : -1});
};

export function getParticularChat (id : string) {
    return ChatModel.findOne( { _id : id });
}