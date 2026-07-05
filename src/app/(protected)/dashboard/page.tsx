"use client";

import ChatWindow from "@/features/chat/ui/ChatWindow";
import { useUser } from "@/features/auth/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useUser();
  return <ChatWindow user={user} />;
}