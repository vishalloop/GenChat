import { Chat, Message } from "../types/chat.types";

export const chatApi = {

  async getChats(): Promise<{ success: boolean; data: { chat: Chat[] } }> {
    const res = await fetch("/api/chat/get-chats");
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch chats");
    return result;
  },

  async deleteChat(chatId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/chat/delete-chat?chatId=${chatId}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete chat");
    return result;
  },


  async getMessages(
    chatId: string
  ): Promise<{ success: boolean; data: { messages: Message[] } }> {
    const res = await fetch(`/api/message/get-messages?chatId=${chatId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to fetch messages");
    return result;
  },

  async createMessage(data: {
    content: string;
    chatId?: string;
  }): Promise<{
    success: boolean;
    data: { chatId: string; answer: string };
  }> {
    const res = await fetch("/api/message/create-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to send message");
    return result;
  },
};