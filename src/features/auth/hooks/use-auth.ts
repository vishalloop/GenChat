import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../state/auth.store";
import { useEffect } from "react";

// Hook 1: Fetch Current User (Queries get cached automatically)
export function useUser() {
  const { setUser, clearUser, user } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth-user"],
    queryFn: authApi.getMe,
    retry: false, // Don't retry on 401s
  });

  // Sync server state with Zustand client state
  useEffect(() => {
    if (query.data?.success && query.data.data) {
      setUser(query.data.data);
    } else if (query.isError) {
      clearUser();
    }
  }, [query.data, query.isError, setUser, clearUser]);

  return {
    user: user || query.data?.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

// Hook 2: Register Mutation
export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

// Hook 3: Login Mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.data);
      // Invalidate the cache to trigger user updates
      queryClient.setQueryData(["auth-user"], data);
    },
  });
}

// Hook 4: Logout Mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear(); // Clear all cached API queries
    },
  });
}