import { create } from "zustand";

export type Role = "CANDIDATE" | "RECRUITER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  companyName?: string;
  badges?: string[];
  provider?: "LOCAL" | "GOOGLE" | "LINKEDIN";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: Role | null;
  isVIP: boolean;
  vipType: "MONTHLY" | "YEARLY" | null;
  vipExpireDate: string | null;
  addBadge: (badge: string) => void;
  setAuth: (user: User, accessToken: string) => void;
  setToken: (token: string) => void;
  upgradeToVIP: (type: "MONTHLY" | "YEARLY", expireDate: string) => void;
  downgradeVIP: () => void;
  logout: () => void;
}

// Note: In a real production app, the refresh token would be in a secure httpOnly cookie.
// Here we store the accessToken in memory (Zustand state).
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  role: null,
  isVIP: false,
  vipType: null,
  vipExpireDate: null,
  addBadge: (badge) => {
    set((state) => {
      if (!state.user) return state;
      const currentBadges = state.user.badges || [];
      if (currentBadges.includes(badge)) return state;
      return {
        user: {
          ...state.user,
          badges: [...currentBadges, badge]
        }
      };
    });
  },
  setAuth: (user, accessToken) => {
    set({ user, accessToken, role: user.role, isAuthenticated: true });
  },
  setToken: (accessToken) => {
    set({ accessToken, isAuthenticated: !!accessToken });
  },
  upgradeToVIP: (type, expireDate) => {
    set({ isVIP: true, vipType: type, vipExpireDate: expireDate });
  },
  downgradeVIP: () => {
    set({ isVIP: false, vipType: null, vipExpireDate: null });
  },
  logout: () => {
    set({ user: null, accessToken: null, role: null, isAuthenticated: false, isVIP: false, vipType: null, vipExpireDate: null });
  },
}));
