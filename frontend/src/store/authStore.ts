// src/store/authStore.ts
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),
}));