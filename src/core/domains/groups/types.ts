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
  parent_id?: string;
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

export interface GetGroupsHierarchyParamsDto {
  level?: number;
  tree?: boolean;
}

export interface GroupNode {
  id: string;
  domain_id: string;
  parent_id?: string;
  name: string;
  description?: string;
  metadata?: groupMetadata;
  level: number;
  path: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  status: 'enabled' | 'disabled';

  children?: GroupNode[];
}

export interface GetGroupsHierarchyResponseDto {
  level: number;
  direction: number;
  groups: GroupNode[];
}

export type RegionNode = {
  id: string;
  name: string;
  slug: string;
  children?: RegionNode[];
};

export interface CreateGroupDTO {
  name: string;
  description?: string;
  parent_id?: string;
  metadata?: metadata;
}

interface metadata {
  lat: number;
  long: number;
}

export interface UpdateGroupDto
  extends Partial<Omit<CreateGroupDTO, 'parent_id'>> {}

export interface SetChildrenGroupDto {
  parent_id?: string;
  children_ids: string[];
  parent_id_old?: string;
}
