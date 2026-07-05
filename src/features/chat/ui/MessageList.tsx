// src/features/chat/ui/MessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "../state/chat.store";
import MessageItem from "./MessageItem";

export default function MessageList() {
  const { messages, streamingContent, isStreaming } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  if (!messages.length && !isStreaming) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-zinc-200">Start a conversation</h2>
          <p className="mt-1 text-sm text-zinc-500">Ask anything — GenChat is here to help.</p>
        </div>
        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-md">
          {[
            "Explain quantum entanglement simply",
            "Write a Python web scraper",
            "What are the SOLID principles?",
            "Plan a 7-day trip to Japan",
          ].map((s) => (
            <span
              key={s}
              className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 cursor-default"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}

      {/* Streaming bubble — shows in real time while AI types */}
      {isStreaming && streamingContent && (
        <div className="flex gap-3 justify-start">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
            G
          </div>
          <div className="max-w-[80%] lg:max-w-[70%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-zinc-900/80 border border-zinc-800/60 text-zinc-200">
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-1">
              {streamingContent}
              {/* Blinking cursor */}
              <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Thinking indicator — before first chunk arrives */}
      {isStreaming && !streamingContent && (
        <div className="flex gap-3 justify-start">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
            G
          </div>
          <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-zinc-900/80 border border-zinc-800/60">
            <div className="flex gap-1 items-center h-5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}