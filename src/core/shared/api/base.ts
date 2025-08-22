import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import type { ApiError } from '@/core/shared/types';

const baseTimeout = 30000;

export interface ApiRequestConfig extends AxiosRequestConfig {
  isAdmin?: boolean;
}

export abstract class BaseApiClient {
  protected client: AxiosInstance;
  protected admin: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: baseTimeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config?.headers,
      },
      ...config,
    });

    this.admin = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: baseTimeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config?.headers,
      },
      ...config,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
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

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return this.handleError(error);
      }
    );
  }

  protected getAuthToken(): string | null {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }

  /**
   * Handles successful responses, extracting the data.
   * @param response The AxiosResponse object.
   * @returns The data from the response.
   */
  protected handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  /**
   * Handles errors encountered during API requests.
   * This method transforms AxiosErrors into custom application errors
   * consistent with the error handling architecture.
   * @param error The AxiosError object.
   * @throws {Error} Throws a custom error.
   */
  protected handleError(error: AxiosError): never {
    if (error.response) {
      // Error with a response from the server (e.g., 4xx, 5xx)
      const customError: ApiError = {
        message: (error.response.data as any)?.message || error.message || 'Unknown error',
        status: error.response.status,
        code: (error.response.data as any)?.code || 'UNKNOWN_ERROR',
      };
      throw customError;
    } else if (error.request) {
      // Request was made but no response received (e.g., network error)
      const customError: ApiError = {
        message: 'Network error or no response received',
        status: 0,
        code: 'NETWORK_ERROR',
      };
      throw customError;
    } else {
      // Something else happened in setting up the request
      const customError: ApiError = {
        message: `Request setup error: ${error.message}`,
        status: 0,
        code: 'REQUEST_SETUP_ERROR',
      };
      throw customError;
    }
  }

  private getClient(isAdmin?: boolean): AxiosInstance {
    return isAdmin ? this.admin : this.client;
  }

  /**
   * Performs a GET request.
   * @param url The endpoint URL.
   * @param config Optional Axios configuration.
   * @returns Promise with the response data.
   */
  protected async get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    const client = this.getClient(config?.isAdmin);
    const response = await client.get<T>(url, config);
    return this.handleResponse(response);
  }

  /**
   * Performs a POST request.
   * @param url The endpoint URL.
   * @param data The data to send.
   * @param config Optional Axios configuration.
   * @returns Promise with the response data.
   */
  protected async post<T>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<T> {
    const client = this.getClient(config?.isAdmin);
    const response = await client.post<T>(url, data, config);
    return this.handleResponse(response);
  }

  /**
   * Performs a PUT request.
   * @param url The endpoint URL.
   * @param data The data to send.
   * @param config Optional Axios configuration.
   * @returns Promise with the response data.
   */
  protected async put<T>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<T> {
    const client = this.getClient(config?.isAdmin);
    const response = await client.put<T>(url, data, config);
    return this.handleResponse(response);
  }

  /**
   * Performs a DELETE request.
   * @param url The endpoint URL.
   * @param config Optional Axios configuration.
   * @returns Promise with the response data.
   */
  protected async delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    const client = this.getClient(config?.isAdmin);
    const response = await client.delete<T>(url, config);
    return this.handleResponse(response);
  }

  /**
   * Performs a PATCH request.
   * @param url The endpoint URL.
   * @param data The data to send.
   * @param config Optional Axios configuration.
   * @returns Promise with the response data.
   */
  protected async patch<T>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<T> {
    const client = this.getClient(config?.isAdmin);
    const response = await client.patch<T>(url, data, config);
    return this.handleResponse(response);
  }
}
