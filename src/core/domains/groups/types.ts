import type { BaseEntity, QueryParams } from '@/core/shared/types';

export interface GetGroupsParamsDto
  extends Omit<
    QueryParams,
    'order' | 'sort' | 'status' | 'search' | 'categories'
  > {
  dir?: 'asc' | 'desc';
  status?: 'enabled' | 'disabled' | 'deleted' | 'all' | 'unknown';
  user?: string;
  role_name?: string;
  role_id?: string;
  root_group?: boolean;
  access_type?: string;
  only_total?: boolean;
}

export interface GroupListResponseDto {
  groups: Group[];
  limit: number;
  offset: number;
  total: number;
}

export interface Group extends BaseEntity {
  domain_id: string;
  name: string;
  description: string;
  metadata: groupMetadata;
  updated_by: string;
  status: string;
}

export interface groupMetadata {
  lat?: number;
  long?: number;
  zoom?: number;
}
