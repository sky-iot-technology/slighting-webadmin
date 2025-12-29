import { authenticatedApi } from '@/core/shared/api';
import {
  CreateRoleInput,
  GetRolesParamsDto,
  RoleListResponseDto,
  UIRoleResponse,
  UpdateRoleInput
} from './types';

export const rolesApi = {
  async getAll(params?: GetRolesParamsDto): Promise<RoleListResponseDto> {
    const response = await authenticatedApi.get<RoleListResponseDto>(
      `/system/ui-roles`,
      {
        params: {
          ...params
        }
      }
    );
    return response;
  },
  async getById(id: string): Promise<UIRoleResponse> {
    const response = await authenticatedApi.get<UIRoleResponse>(
      `/system/ui-roles/${id}`
    );
    return response;
  },
  async createRole(data: CreateRoleInput): Promise<UIRoleResponse> {
    try {
      const response = await authenticatedApi.post<UIRoleResponse>(
        `/system/ui-roles`,
        data
      );
      return response;
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
      const response = await authenticatedApi.patch<UIRoleResponse>(
        `/system/ui-roles/${id}`,
        data
      );
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
      await authenticatedApi.delete<void>(`/system/ui-roles/${id}`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể xóa vai trò. Vui lòng thử lại.';
      console.error('❌ delete role error:', message);
      throw new Error(message);
    }
  }
};
