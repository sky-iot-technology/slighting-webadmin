import { UIRawPermission, UIRoleResponse, RoleListResponseDto } from './types';
import { UIModuleValue } from '@/core/domains/permissions/ui-modules';

const ACTION_TO_BACKEND: Record<string, string> = {
  view: 'read',
  create: 'write',
  update: 'update',
  delete: 'delete'
};

const ACTION_TO_FRONTEND: Record<string, string> = {
  read: 'view',
  write: 'create',
  update: 'update',
  delete: 'delete'
};

export const toBackendPayload = (
  permissions: Record<string, string[]>
): UIRawPermission => {
  return {
    ui: Object.entries(permissions).map(([id, actions]) => ({
      id: id as UIModuleValue,
      actions: actions.map((act) => ACTION_TO_BACKEND[act] || act) as any
    }))
  };
};

export function mapBackendRoleToFrontend(role: any): UIRoleResponse {
  if (!role) {
    throw new Error('Role data is null or undefined');
  }
  return {
    id: role.id || '',
    name: role.name || '',
    label: role.name || '',
    description: role.description || role.note || '',
    domain_id: role.domain_id || '',
    status: 'enabled',
    permission: {
      ui: (role.permissions || []).map((p: any) => ({
        id: p.entity_type as UIModuleValue,
        actions: (p.actions || []).map(
          (act: string) => ACTION_TO_FRONTEND[act] || act
        )
      }))
    },
    metadata: role.metadata || null,
    created_at: role.created_at || new Date().toISOString(),
    created_by: role.created_by || null,
    updated_at: role.updated_at || null
  };
}

export function mapBackendRoleListToFrontend(
  response: any
): RoleListResponseDto {
  if (!response) {
    return {
      'ui-roles': [],
      limit: 10,
      offset: 0,
      total: 0
    };
  }

  const rawRoles = Array.isArray(response)
    ? response
    : response.roles || response.data || response['ui-roles'] || [];

  const mappedRoles = rawRoles.map(mapBackendRoleToFrontend);

  return {
    'ui-roles': mappedRoles,
    limit: response.limit || mappedRoles.length,
    offset: response.offset || 0,
    total: response.total !== undefined ? response.total : mappedRoles.length
  };
}
