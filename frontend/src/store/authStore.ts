import { create } from "zustand";

import { API } from "../api/api";
import type { User } from "../types/custom";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  setUser: (user) =>
    set({
      user,
    }),

  setToken: (token) =>
    set({
      token,
    }),

  logout: () => {
    set({
      user: null,
      token: null,
      loading: false,
    });
  },

  checkAuth: async () => {
    set({ loading: true });

    try {
      const refreshRes = await fetch(API.auth.refresh, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        set({
          user: null,
          token: null,
          loading: false,
        });
        return;
      }

      const refreshData = await refreshRes.json();

      const accessToken = refreshData.data.accessToken;

      const meRes = await fetch(API.auth.me, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!meRes.ok) {
        set({
          user: null,
          token: null,
          loading: false,
        });
        return;
      }

      const meData = await meRes.json();

      set({
        user: meData.data,
        token: accessToken,
        loading: false,
      });
    } catch {
      set({
        user: null,
        token: null,
        loading: false,
      });
    }
  },
}));