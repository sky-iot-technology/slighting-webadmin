import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from './types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Computed
  get isAuthenticated(): boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      error: null,

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, error: null }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...updates,
              updated_at: new Date().toISOString()
            }
          });
        }
      },

      get isAuthenticated() {
        return get()?.user !== null && get()?.accessToken !== null;
      }
    }),
    { name: 'auth-store' }
  )
);

// Selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
// export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.user !== null && state.accessToken !== null);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Actions
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setUser: state.setUser,
    setTokens: state.setTokens,
    setAccessToken: state.setAccessToken,
    setRefreshToken: state.setRefreshToken,
    setLoading: state.setLoading,
    setError: state.setError,
    clearAuth: state.clearAuth,
    updateUser: state.updateUser
  }));
