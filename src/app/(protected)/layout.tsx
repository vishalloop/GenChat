"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/hooks/use-auth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isError } = useUser();

  useEffect(() => {
    // If not loading and user fetch failed, redirect to login
    if (!isLoading && (!user || isError)) {
      router.push("/login");
    }
  }, [user, isLoading, isError, router]);

  // Show a premium loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // Prevent children from rendering if unauthorized
  if (!user || isError) {
    return null;
  }

  return <>{children}</>;
}