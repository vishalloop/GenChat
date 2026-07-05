export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  createdAt: string;
}

export interface ChatState {
  activeChatId: string | null;
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;

  setActiveChatId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  appendStreamChunk: (chunk: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  clearStreaming: () => void;
  reset: () => void;
}