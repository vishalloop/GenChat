"use client";

import { useRouter } from "next/navigation";
import { useUser, useLogout } from "@/features/auth/hooks/use-auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser(); // We can safely assume 'user' exists here!
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        router.push("/login");
        router.refresh();
      },
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
            GenChat
          </span>

          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-zinc-400">
            This is your secure control panel. You are authenticated under <span className="text-indigo-400 font-semibold">{user?.email}</span>.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-6 hover:border-zinc-800 transition-all">
              <h3 className="font-semibold text-white">Protected Layout</h3>
              <p className="mt-2 text-sm text-zinc-400">Every route placed inside the (protected) folder automatically inherits route protection.</p>
            </div>
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-6 hover:border-zinc-800 transition-all">
              <h3 className="font-semibold text-white">Server Cache</h3>
              <p className="mt-2 text-sm text-zinc-400">TanStack Query keeps your user context updated in the background without layout shifts.</p>
            </div>
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-6 hover:border-zinc-800 transition-all">
              <h3 className="font-semibold text-white">OAuth Core</h3>
              <p className="mt-2 text-sm text-zinc-400">Fully integrated with Google Authentication for premium passwordless entry.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}