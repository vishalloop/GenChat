import { AuthData, AuthUser } from "../types/auth.types";

export const authApi = {
  async register(data: AuthData): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Registration failed");
    return result;
  },

  async login(data: AuthData): Promise<{ success: boolean; message: string; data: AuthUser }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Login failed");
    return result;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Logout failed");
    return result;
  },

  async getMe(): Promise<{ success: boolean; data: AuthUser }> {
    const res = await fetch("/api/auth/get-me");
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Unauthenticated");
    return result;
  },
};