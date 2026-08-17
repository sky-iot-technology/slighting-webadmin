import { authenticatedApi } from '@/core/shared/api';
import {
  CreateRoleInput,
  GetRolesParamsDto,
  RoleListResponseDto,
  UIRoleResponse,
  UpdateRoleInput
} from './types';
import { useAuthStore } from '@/core/domains/auth';
import {
  mapBackendRoleToFrontend,
  mapBackendRoleListToFrontend
} from './mapper';

export const rolesApi = {
  async getAll(params?: GetRolesParamsDto): Promise<RoleListResponseDto> {
    const { domainId } = useAuthStore.getState();
    const response = await authenticatedApi.get<any>(`/management-roles`, {
      params: {
        domain: domainId,
        ...params
      }
    });
    return mapBackendRoleListToFrontend(response);
  },
  async getById(id: string): Promise<UIRoleResponse> {
    const response = await authenticatedApi.get<any>(`/management-roles/${id}`);
    return mapBackendRoleToFrontend(response);
  },
  async createRole(data: CreateRoleInput): Promise<UIRoleResponse> {
    try {
      const { domainId } = useAuthStore.getState();
      const backendPermissions = (data.permission?.ui || []).map((item) => ({
        entity_type: item.id,
        actions: item.actions
      }));

      const payload = {
        name: data.name,
        domain_id: data.domain_id || domainId,
        permissions: backendPermissions
      };

      const response = await authenticatedApi.post<any>(
        `/management-roles`,
        payload
      );
      return mapBackendRoleToFrontend(response);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tạo vai trò. Vui lòng thử lại.';
      console.error('❌ create role error:', message);
      throw new Error(message);
    }
  },
  async updateRole(id: string, data: UpdateRoleInput): Promise<UIRoleResponse> {
    try {
      const backendPermissions = (data.permission?.ui || []).map((item) => ({
        entity_type: item.id,
        actions: item.actions
      }));

      // Call 2 APIs as requested:
      // 1. One for name (only name field should be passed)
      // 2. One for permission
      await Promise.all([
        authenticatedApi.put(`/management-roles/${id}`, {
          name: data.name
        }),
        authenticatedApi.put(`/management-roles/${id}/permissions`, {
          permissions: backendPermissions
        })
      ]);

      // Fetch the updated role to return a complete response
      const response = await rolesApi.getById(id);
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể cập nhật vai trò. Vui lòng thử lại.';
      console.error('❌ update role error:', message);
      throw new Error(message);
    }
  },
  async deleteRole(id: string): Promise<void> {
    try {
      await authenticatedApi.delete<void>(`/management-roles/${id}`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể xóa vai trò. Vui lòng thử lại.';
      console.error('❌ delete role error:', message);
      throw new Error(message);
    }
  },
  async getUserRoles(userId: string): Promise<{ roles: any[]; total: number }> {
    const response = await authenticatedApi.get<any>(
      `/management-roles/users`,
      {
        params: {
          user_id: userId
        }
      }
    );
    return response;
  },
  async addUserToRole(
    roleId: string,
    userId: string,
    scopeEntityType?: string,
    scopeEntityId?: string
  ): Promise<void> {
    const memberObj: any = { user_id: userId };
    if (scopeEntityType && scopeEntityId) {
      memberObj.scope_entity_type = scopeEntityType;
      memberObj.scope_entity_id = scopeEntityId;
    }
    await authenticatedApi.post(`/management-roles/${roleId}/members`, {
      members: [memberObj]
    });
  },
  async removeUserFromRole(
    roleId: string,
    userId: string,
    scopeEntityType?: string,
    scopeEntityId?: string
  ): Promise<void> {
    const memberObj: any = { user_id: userId };
    if (scopeEntityType && scopeEntityId) {
      memberObj.scope_entity_type = scopeEntityType;
      memberObj.scope_entity_id = scopeEntityId;
    }
    await authenticatedApi.post(`/management-roles/${roleId}/members/delete`, {
      members: [memberObj]
    });
  }
};
