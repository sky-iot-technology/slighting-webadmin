import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uiPreferencesApi, uiThemeApi } from './api';
import {
  UpdateUserPreferenceInput,
  UserPreference,
  UpdateDomainThemeInput
} from './types';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { authApi, useAuthStore } from '../auth';

export const UI_PREFERENCES_QUERY_KEY = ['ui-preferences'] as const;
export const UI_FEATURES_QUERY_KEY = (domainId: string) =>
  ['ui-features', domainId] as const;
export const UI_THEME_QUERY_KEY = (domainId: string) =>
  ['ui-theme', domainId] as const;

export const useGetUIPreferences = () => {
  return useQuery<UserPreference, Error>({
    queryKey: UI_PREFERENCES_QUERY_KEY,
    queryFn: () => uiPreferencesApi.get(),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

export const useGetUIFeatures = (domainId: string) => {
  return useQuery<{ feature_key: string; accessible: boolean }[], Error>({
    queryKey: UI_FEATURES_QUERY_KEY(domainId),
    queryFn: () => uiPreferencesApi.getFeatures(domainId),
    enabled: !!domainId,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

export const useUpdateUIPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserPreferenceInput) =>
      uiPreferencesApi.update(data),
    onSuccess: (data) => {
      queryClient.setQueryData(UI_PREFERENCES_QUERY_KEY, data);
    }
  });
};

export const useGetDomainTheme = (domainId: string) => {
  return useQuery({
    queryKey: UI_THEME_QUERY_KEY(domainId),
    queryFn: () => uiThemeApi.getByDomain(domainId),
    enabled: !!domainId,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

export const useUpdateDomainTheme = (domainId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDomainThemeInput) =>
      uiThemeApi.updateByDomain(domainId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(UI_THEME_QUERY_KEY(domainId), data);
    }
  });
};

class FatalError extends Error {}

/**
 * Subscribes to SSE endpoint using fetch and ReadableStream
 * to allow passing custom headers like Authorization.
 */
// Shared Promise lock to prevent concurrent refresh token requests across multiple SSE streams
let refreshTokenPromise: Promise<string | null> | null = null;

async function handleRefreshTokenShared(): Promise<string | null> {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const refreshToken = cookieUtils.getRefreshToken();
      if (!refreshToken) return null;

      const res = await authApi.refreshToken(refreshToken);
      if (res?.access_token) {
        cookieUtils.setAuthCookies(res.access_token, res.refresh_token);
        useAuthStore.getState().setTokens(res.access_token, res.refresh_token);
        return res.access_token;
      }
    } catch (error) {
      console.error('❌ Failed to refresh token during SSE connection:', error);
    } finally {
      refreshTokenPromise = null;
    }
    return null;
  })();

  return refreshTokenPromise;
}

export function subscribeToSSE(
  domainId: string,
  onEvent: (event: string, data: any) => void,
  deviceId?: string,
  groupId?: string
) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const controller = new AbortController();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${baseUrl}/ui/events?domain_id=${domainId}${
    groupId ? `&group_id=${groupId}` : ''
  }${deviceId ? `&device_id=${deviceId}` : ''}`;

  fetchEventSource(url, {
    method: 'GET',
    signal: controller.signal,
    openWhenHidden: true,
    fetch: (input, init) => {
      const token = cookieUtils.getAccessToken();
      const headers = new Headers(init?.headers);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return fetch(input, { ...init, headers });
    },
    async onopen(response) {
      if (
        response.ok &&
        response.headers.get('content-type')?.includes('text/event-stream')
      ) {
        console.log('✅ SSE connected successfully');
        return;
      }
      if (response.status === 401) {
        console.warn(
          '⚠️ SSE Received 401 (Unauthorized). Attempting token refresh...'
        );
        const newToken = await handleRefreshTokenShared();
        if (newToken) {
          console.log(
            '🔄 Token refreshed successfully! Retrying SSE connection...'
          );
          throw new Error('Token refreshed, reconnecting...');
        } else {
          console.error(
            '⛔ Refresh token expired or invalid. Redirecting to login...'
          );
          cookieUtils.clearAuthCookies();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/sign-in';
          }
          throw new FatalError('Session expired');
        }
      }
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        throw new FatalError(
          `Client error ${response.status}: ${response.statusText}`
        );
      }
    },
    onmessage(ev) {
      const eventName = ev.event || 'message';
      try {
        const data = JSON.parse(ev.data);
        onEvent(eventName, data);
      } catch {
        onEvent(eventName, ev.data);
      }
    },
    onerror(err) {
      console.error('❌ SSE Connection error:', err);
      return 5000; // Retry after 5 seconds
    }
  }).catch((err) => {
    if (err.name !== 'AbortError') {
      console.error('SSE aborted or failed completely:', err);
    }
  });

  return () => {
    console.log('🔌 Cleaning up SSE connection (aborted)...');
    controller.abort();
  };
}
