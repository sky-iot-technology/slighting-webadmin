import { authenticatedApi } from '@/core/shared/api';
import { GetTagsParamsDto, TagListResponseDto } from './types';

export const tagsApi = {
  async getAll(params?: GetTagsParamsDto): Promise<TagListResponseDto> {
    const response = await authenticatedApi.get<TagListResponseDto>(
      '/system/tags',
      {
        params
      }
    );
    return response;
  }
};
