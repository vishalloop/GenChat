import { create } from "zustand";
import { AuthState} from "../types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));