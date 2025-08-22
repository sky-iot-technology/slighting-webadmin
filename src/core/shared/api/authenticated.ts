import type { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from '@/core/shared/api/base';

export class AuthenticatedApiClient extends BaseApiClient {
  constructor(config?: AxiosRequestConfig) {
    super(config);
    this.setupAuthInterceptors();
  }

  private setupAuthInterceptors(): void {
    // Request interceptor for authenticated requests
    this.client.interceptors.request.use(
      async (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
          // Handle unauthorized access
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  protected getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private handleUnauthorized(): void {
    // Clear auth token and redirect to login
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem('auth_token');
      // You can add redirect logic here or use your auth service
      window.location.href = '/auth/sign-in';
    } catch {
      // Handle localStorage access errors
    }
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
