import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '../types';
import { authService } from '../services/auth.js';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  initializeAuth: () => void;
  clearAuth: () => void;
  logoutAndRedirect: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => {
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      },
      logout: () => {
        authService.logout();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      initializeAuth: () => {
        set({ isLoading: true });
        try {
          const accessToken = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');
          const userStr = localStorage.getItem('user');

          if (accessToken && refreshToken && userStr) {
            set({
              accessToken,
              refreshToken,
              user: JSON.parse(userStr),
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({ isLoading: false });
        }
      },
      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      logoutAndRedirect: () => {
        authService.logout();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return children;
}
