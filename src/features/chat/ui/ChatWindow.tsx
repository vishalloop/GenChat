"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatStore } from "../state/chat.store";
import { useMessages } from "../hooks/use-chat";
import { AuthUser } from "@/features/auth/types/auth.types";

interface ChatWindowProps {
  user: AuthUser | null;
}

export default function ChatWindow({ user }: ChatWindowProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeChatId = useChatStore((s) => s.activeChatId);

  // Load messages when the active chat changes
  useMessages(activeChatId);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      {/* ── Sidebar ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* ── Main chat area ── */}
      <div className="relative z-10 flex flex-1 flex-col min-w-0">
        {/* Top bar (mobile only) */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
            GenChat
          </span>
        </header>

        {/* Messages */}
        <MessageList />

        {/* Input */}
        <MessageInput />
      </div>
    </div>
  );
}