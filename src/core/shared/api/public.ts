import type { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from '@/core/shared/api/base';

export class PublicApiClient extends BaseApiClient {
  constructor(config?: AxiosRequestConfig) {
    super(config);
    // Public API doesn't need auth interceptors
  }

  // Public methods that use the public client
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
export const publicApi = new PublicApiClient();
