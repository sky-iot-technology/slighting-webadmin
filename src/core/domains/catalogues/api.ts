import { authenticatedApi } from '@/core/shared/api';
import {
  CatalogueListResponseDto,
  DescriptorListResponseDto,
  normalizeTraitKey
} from './types';

export const catalogueApi = {
  async getAll(): Promise<CatalogueListResponseDto> {
    const response = await authenticatedApi.get<CatalogueListResponseDto>(
      '/devices/device-types',
      {
        params: {
          limit: 100
        }
      }
    );

    if (response && Array.isArray(response.devices)) {
      response.devices = response.devices.map((device) => ({
        ...device,
        traits: (device.traits || []).map(normalizeTraitKey)
      }));
    }

    return response;
  },

  async getTraitDescriptors(): Promise<DescriptorListResponseDto> {
    const response = await authenticatedApi.get<DescriptorListResponseDto>(
      '/traits/descriptors'
    );
    return response;
  }
};
