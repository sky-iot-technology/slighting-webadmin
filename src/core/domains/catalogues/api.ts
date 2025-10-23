import { authenticatedApi } from '@/core/shared/api';
import { CatalogueListResponseDto } from './types';

export const catalogueApi = {
  async getAll(): Promise<CatalogueListResponseDto> {
    const response = await authenticatedApi.get<CatalogueListResponseDto>(
      '/devices/catalogues',
      {
        params: {
          limit: 100
        }
      }
    );
    return response;
  }
};
