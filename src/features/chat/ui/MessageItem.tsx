"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Message } from "../types/chat.types";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
          G
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
          max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${
            isUser
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-zinc-900/80 border border-zinc-800/60 text-zinc-200 rounded-bl-sm"
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none
            prose-p:my-1 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-700/50
            prose-code:text-indigo-300 prose-code:bg-zinc-950/60 prose-code:px-1 prose-code:rounded
            prose-headings:text-zinc-100 prose-a:text-indigo-400 prose-strong:text-zinc-100
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-bold shrink-0 mt-1">
          U
        </div>
      )}
    </div>
  );
}