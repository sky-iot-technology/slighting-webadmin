import { authenticatedApi } from '@/core/shared/api';
import {
  CreateTagRequest,
  GetTagsParamsDto,
  Tag,
  TagListResponseDto
} from './types';

export const tagsApi = {
  async getAll(params?: GetTagsParamsDto): Promise<TagListResponseDto> {
    const response = await authenticatedApi.get<TagListResponseDto>(
      '/system/tags',
      {
        params
      }
    );
    return response;
  },
  async createTag(data: CreateTagRequest): Promise<Tag> {
    try {
      const response = await authenticatedApi.post<Tag>('/system/tags', data);
      return response;
    } catch (error) {
      throw new Error('Failed to create tag');
    }
  }
};
