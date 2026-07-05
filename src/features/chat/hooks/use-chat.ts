"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import { chatApi } from "../api/chat.api";
import { useChatStore } from "../state/chat.store";
import { Message } from "../types/chat.types";

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: chatApi.getChats,
    select: (data) => data.data.chat,
  });
}

export function useMessages(chatId: string | null) {
  const setMessages = useChatStore((s) => s.setMessages);

  const query = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => chatApi.getMessages(chatId!),
    enabled: !!chatId,
    select: (data) => data.data.messages,
  });

  useEffect(() => {
    if (query.data) {
      setMessages(query.data);
    }
  }, [query.data, setMessages]);

  return query;
}

export function useDeleteChat() {
  const queryClient = useQueryClient();
  const { activeChatId, reset } = useChatStore();

  return useMutation({
    mutationFn: chatApi.deleteChat,
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (activeChatId === deletedId) {
        reset();
      }
    },
  });
}

export function useStreamMessage() {
  const queryClient = useQueryClient();
  const {
    activeChatId,
    setActiveChatId,
    addMessage,
    appendStreamChunk,
    setIsStreaming,
    clearStreaming,
    streamingContent,
    isStreaming,
  } = useChatStore();

  const abortRef = useRef<(() => void) | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      const tempUserMsg: Message = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      addMessage(tempUserMsg);
      setIsStreaming(true);

      const res = await fetch("/api/message/stream-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          chatId: activeChatId ?? undefined,
        }),
      });

      if (!res.ok || !res.body) {
        clearStreaming();
        console.error("Stream failed");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      abortRef.current = () => reader.cancel();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const rawData = line.slice(6).trim();
            try {
              const parsed = JSON.parse(rawData);

              const eventLine = lines[lines.indexOf(line) - 1] ?? "";
              const eventName = eventLine.replace("event: ", "").trim();

              if (eventName === "chunk") {
                appendStreamChunk(parsed);
              } else if (eventName === "done") {
                const resolvedChatId = parsed as string;
                if (!activeChatId) {
                  setActiveChatId(resolvedChatId);
                }
                const aiMsg: Message = {
                  id: `ai-${Date.now()}`,
                  role: "ai",
                  content: useChatStore.getState().streamingContent,
                  createdAt: new Date().toISOString(),
                };
                addMessage(aiMsg);
                clearStreaming();
                queryClient.invalidateQueries({ queryKey: ["chats"] });
                queryClient.invalidateQueries({ queryKey: ["messages", resolvedChatId] });
              } else if (eventName === "error") {
                console.error("Stream error:", parsed);
                clearStreaming();
              }
            } catch {
            }
          }
        }
      }

      setIsStreaming(false);
    },
    [
      activeChatId,
      isStreaming,
      addMessage,
      appendStreamChunk,
      setIsStreaming,
      clearStreaming,
      setActiveChatId,
      queryClient,
    ]
  );

  const abort = useCallback(() => {
    abortRef.current?.();
    clearStreaming();
  }, [clearStreaming]);

  return { sendMessage, isStreaming, streamingContent, abort };
}