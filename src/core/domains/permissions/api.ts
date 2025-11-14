import { authenticatedApi } from '@/core/shared/api';
import {
  CreateRoleInput,
  GetRolesParamsDto,
  RoleListResponseDto,
  UIRoleResponse
} from './types';
import { any } from 'zod';

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
  async getById(id: string): Promise<UIRoleResponse> {
    const response = await authenticatedApi.get<UIRoleResponse>(
      `/system/ui-roles/${id}`
    );
    return response;
  }
};
