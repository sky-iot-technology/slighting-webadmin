import type { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from '@/core/shared/api/base';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { useAuthStore } from '@/core/domains/auth';

export class AuthenticatedApiClient extends BaseApiClient {
  constructor(config?: AxiosRequestConfig) {
    super(config);
    this.setupAuthInterceptors();
  }

  private setupAuthInterceptors(): void {
    // Request interceptor for authenticated requests
    this.client.interceptors.request.use(
      async (config) => {
        const apiConfig = config as any;
        // Only add auth token if not an external API call
        if (!apiConfig.externalApi) {
          const token = this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            const { domainId } = useAuthStore.getState();
            if (domainId && !config.url?.startsWith('/users')) {
              config.url = `${domainId}${config.url}`;
            }
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling auth errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token automatically
          try {
            const refreshToken = cookieUtils.getRefreshToken();
            if (refreshToken) {
              // Import authApi here to avoid circular dependency
              const { authApi } = await import('@/core/domains/auth/api');
              const newTokens = await authApi.refreshToken(refreshToken);

              // Retry the original request with new token
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear cookies and redirect to login
            cookieUtils.clearAuthCookies();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/sign-in';
            }
          }
        }
        return Promise.reject(error);
      }
    );
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

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return super.delete(url, config);
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
