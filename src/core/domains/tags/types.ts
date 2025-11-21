import type { BaseEntity } from '@/core/shared/types';

export interface Tag extends BaseEntity {
  name: string;
  alias: string;
  description?: string;
  domain_id: string;
  resource_type: string;
  created_by: string;
}

export interface GetTagsParamsDto {
  resource_type?: string;
}

export interface TagListResponseDto {
  tag: Tag[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateTagRequest {
  name: string;
  alias: string;
  resource_type: string;
  description?: string;
}
