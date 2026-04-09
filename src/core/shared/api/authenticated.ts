import type { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from '@/core/shared/api/base';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { useAuthStore } from '@/core/domains/auth';

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export class AuthenticatedApiClient extends BaseApiClient {
  constructor(config?: AxiosRequestConfig) {
    super(config);
  }

  protected setupInterceptors(): void {
    // 1. Setup Auth Refresh Interceptor FIRST
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error.config is missing, it means something transformed it or it's not a standard error.
        // run through generic error handler if we can't retry.
        if (!originalRequest) {
          return Promise.reject(error);
        }

        const status = error.response?.status ?? error.status;

        // Handle 401 (Unauthorized) or 404 (as per original code preference)
        if (
          (status === 401 || status === 404) &&
          !originalRequest._retry &&
          !originalRequest.externalApi
        ) {
          if (isRefreshing) {
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = 'Bearer ' + token;
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshToken = cookieUtils.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Import authApi here to avoid circular dependency
            const { authApi } = await import('@/core/domains/auth/api');
            const newTokens = await authApi.refreshToken(refreshToken);

            // Update cookies with new tokens
            if (newTokens?.access_token) {
              const refreshTokenToSet = newTokens.refresh_token || refreshToken;
              const { cookieUtils: utils } = await import(
                '@/core/shared/utils/cookies'
              );
              utils.setAuthCookies(newTokens.access_token, refreshTokenToSet);

              // processQueue with new token
              processQueue(null, newTokens.access_token);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            // Refresh failed, clear cookies
            cookieUtils.clearAuthCookies();
            // Redirect if needed
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/sign-in';
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );

    // 2. Setup Base Interceptors (Auth Header Injection + Error Transformation)
    // Runs AFTER refresh logic for responses.
    super.setupInterceptors();

    // 3. Domain Prefix Logic (Request Interceptor)
    // Added LAST, so it runs FIRST in request chain (Reverse order)
    this.client.interceptors.request.use(async (config) => {
      const apiConfig = config as any;
      if (!apiConfig.externalApi) {
        // We can check token existence using our overridden method or just properties
        const token = this.getAuthToken();
        if (token) {
          // We don't strictly need to set Authorization here because super.setupInterceptors() does it.
          // However, to mimic original logic of only adding domain prefix if authenticated:
          const { domainId } = useAuthStore.getState();
          const NO_DOMAIN_PREFIX = ['/users', '/d/'];
          if (
            domainId &&
            config.url &&
            !NO_DOMAIN_PREFIX.some((prefix) => config.url!.startsWith(prefix))
          ) {
            config.url = `${domainId}${config.url}`;
          }
        }
      }
      return config;
    });
  }

  protected getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        // Read token from cookies instead of localStorage
        const row = document.cookie
          .split('; ')
          .find((row) => row.startsWith('access_token='));
        return row
          ? decodeURIComponent(row.substring('access_token='.length))
          : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  // Public methods that use the authenticated client
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return super.get(url, config);
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return super.post(url, data, config);
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return super.put(url, data, config);
  }

  public async delete<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return super.delete(url, data, config);
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return super.patch(url, data, config);
  }
}

// Export a singleton instance
export const authenticatedApi = new AuthenticatedApiClient();
