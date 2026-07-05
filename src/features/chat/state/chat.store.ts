import { create } from "zustand";
import { ChatState } from "../types/chat.types";

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  messages: [],
  streamingContent: "",
  isStreaming: false,

  setActiveChatId: (id) => set({ activeChatId: id, messages: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  appendStreamChunk: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),

  setIsStreaming: (isStreaming) => set({ isStreaming }),

  clearStreaming: () => set({ streamingContent: "", isStreaming: false }),

  reset: () =>
    set({
      activeChatId: null,
      messages: [],
      streamingContent: "",
      isStreaming: false,
    }),
}));