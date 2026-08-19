import { authenticatedApi } from '@/core/shared/api';
import {
  CreateTagRequest,
  GetTagsParamsDto,
  Tag,
  TagListResponseDto
} from './types';

export const tagsApi = {
  async getAll(params?: GetTagsParamsDto): Promise<TagListResponseDto> {
    const response = await authenticatedApi.get<TagListResponseDto>('/tags', {
      params
    });
    return response;
  },
  async createTag(data: CreateTagRequest): Promise<Tag> {
    try {
      const response = await authenticatedApi.post<Tag>('/tags', data);
      return response;
    } catch (error) {
      throw new Error('Failed to create tag');
    }
  },
  async updateTag(tagId: string, name: string): Promise<Tag> {
    try {
      const response = await authenticatedApi.patch<Tag>(`/tags/${tagId}`, {
        name
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update tag');
    }
  }
};
