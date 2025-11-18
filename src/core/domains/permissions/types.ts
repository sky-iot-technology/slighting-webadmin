import { QueryParams } from '@/core/shared';
import { UIAction } from './actions';
import { UIModuleValue } from './ui-modules';

export type UIPermissionItem = {
  id: UIModuleValue;
  actions: UIAction[];
};

export type UIRawPermission = {
  ui: UIPermissionItem[];
};

export type UIRoleResponse = {
  id: string;
  name: string;
  label: string;
  description: string;
  domain_id: string;
  status: 'enabled' | 'disabled';

  permission: UIRawPermission;

  metadata: any | null;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
};

export type CreateRoleInput = {
  name: string;
  label: string;
  domain_id?: string;
  description: string;
  status: 'enabled' | 'disabled';
  permission: UIRawPermission;
};

export interface UpdateRoleInput extends Partial<CreateRoleInput> {}

export interface RoleListResponseDto {
  'ui-roles': UIRoleResponse[];
  limit: number;
  offset: number;
  total: number;
}

export interface GetRolesParamsDto
  extends Omit<
    QueryParams,
    'order' | 'sort' | 'status' | 'search' | 'categories'
  > {
  status?: 'enabled' | 'disabled';
  only_total?: boolean;
}
