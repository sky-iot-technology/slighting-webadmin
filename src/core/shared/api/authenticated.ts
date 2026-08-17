import type { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from '@/core/shared/api/base';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { useAuthStore } from '@/core/domains/auth';

let isRefreshing = false;
let failedQueue: any[] = [];

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
    this.requireAuth = true; // Enable token injection for this client
  }

  protected setupInterceptors(): void {
    // 1. Setup Auth Refresh Interceptor (Runs FIRST on response)
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const status = error.response?.status ?? error.status;

        // ONLY refresh on 401. 404 should not trigger refresh.
        if (
          status === 401 &&
          !originalRequest._retry &&
          !originalRequest.externalApi
        ) {
          if (isRefreshing) {
            // Queue this request and wait for the refresh to finish
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.client(originalRequest));
                },
                reject: (err: any) => {
                  reject(err);
                }
              });
            });
          }

          console.log('[Auth] 401 detected, attempt refresh...');
          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshToken = cookieUtils.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const { authApi } = await import('@/core/domains/auth/api');
            const newTokens = await authApi.refreshToken(refreshToken);

            if (newTokens?.access_token) {
              isRefreshing = false;
              processQueue(null, newTokens.access_token);
              originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
              return this.client(originalRequest);
            } else {
              throw new Error('Refresh failed to return new tokens');
            }
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, null);
            cookieUtils.clearAuthCookies();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/sign-in';
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // 2. Setup Base Interceptors (Error Transformation)
    super.setupInterceptors();

    // 3. Domain Prefix Logic (Runs FIRST on request)
    this.client.interceptors.request.use(async (config) => {
      const apiConfig = config as any;
      if (!apiConfig.externalApi) {
        const { domainId } = useAuthStore.getState();
        const NO_DOMAIN_PREFIX = [
          '/users',
          '/d/',
          '/management-roles',
          '/ui/',
          '/orgs',
          '/domains',
          '/traits'
        ];

        // Prefix with domainId if available, REGARDLESS of token
        // This ensures correct routing so we get 401 instead of 404
        if (
          domainId &&
          config.url &&
          !NO_DOMAIN_PREFIX.some((prefix) => config.url!.startsWith(prefix))
        ) {
          config.url = `${domainId}${config.url}`;
        }
      }
      return config;
    });
  }

  protected getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        // Read token from cookies instead of localStorage
        return (
          document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1] || null
        );
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
