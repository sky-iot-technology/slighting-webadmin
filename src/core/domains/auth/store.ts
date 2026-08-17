import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from './types';
import { cookieUtils } from '@/core/shared/utils/cookies';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  domainId: string | null;
  orgId: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
  setDomainId: (domainId: string) => void;
  setOrgId: (orgId: string) => void;
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
      domainId: null,
      orgId: null,

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearAuth: () => {
        cookieUtils.clearSelectedDomainId();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
          domainId: null
        });
      },

      updateUser: (updates) =>
        set((state) => {
          const currentUser = state.user;
          if (!currentUser) return state;

          return {
            user: {
              ...currentUser,
              ...updates,
              metadata: {
                ...currentUser.metadata,
                ...(updates as any).metadata
              }
            }
          };
        }),
      setDomainId: (domainId) => set({ domainId }),
      setOrgId: (orgId) => set({ orgId }),

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
