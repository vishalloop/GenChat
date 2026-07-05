"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/hooks/use-auth";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // If user is already logged in, redirect them away from login/register to dashboard
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Show a loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // Prevent flash of login/register forms if they are logged in
  if (user) {
    return null;
  }

  return <>{children}</>;
}