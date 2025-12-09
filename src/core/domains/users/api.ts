import { authenticatedApi, publicApi } from '@/core/shared/api';
import {
  ChangePassDto,
  CreateUserDto,
  GetUsersParamsDto,
  UpdateProfileDto,
  UpdateRoleDto,
  UpdateUserDto,
  User,
  UserListResponseDto
} from './types';

export const usersApi = {
  async getAll(params?: GetUsersParamsDto): Promise<UserListResponseDto> {
    const { page = 1, limit = 20, ...rest } = params ?? {};
    const offset = (page - 1) * limit;
    const response = await authenticatedApi.get<UserListResponseDto>(`/users`, {
      params: {
        offset,
        limit,
        ...rest
      }
    });
    return response;
  },
  async changepass(data: ChangePassDto): Promise<void> {
    try {
      await authenticatedApi.patch<void>(`/users/secret`, data);
    } catch (error) {
      throw new Error('Failed to update password');
    }
  },
  async changepassByAdmin(userId: string, secret: string): Promise<void> {
    return await authenticatedApi.patch<void>(`/users/${userId}/secret`, {
      secret
    });
  },
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const response = await publicApi.post<User>(`/users`, data);
      return response;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },
  async deleteUser(id: string): Promise<void> {
    try {
      return await publicApi.delete(`/users/${id}`);
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },
  async updateUserProfile(id: string, data: UpdateProfileDto): Promise<User> {
    try {
      const response = await publicApi.patch<User>(`/users/${id}`, data);
      return response;
    } catch (error) {
      throw new Error('Failed to update profile user');
    }
  },
  async updateUserRole(id: string, data: UpdateRoleDto): Promise<User> {
    try {
      const response = await publicApi.patch<User>(`/users/${id}/role`, data);
      return response;
    } catch (error) {
      throw new Error('Failed to update role user');
    }
  },
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const { role, ...profileData } = data;
      const requests: Promise<User>[] = [];

      requests.push(this.updateUserProfile(id, profileData));
      if (role) {
        requests.push(this.updateUserRole(id, { role }));
      }

      const results = await Promise.all(requests);
      return results[results.length - 1];
    } catch (error) {
      throw new Error('Failed to update user');
    }
  },
  async enableUser(id: string): Promise<any> {
    try {
      return await publicApi.post<any>(`/users/${id}/enable`);
    } catch (error) {
      throw new Error('Failed to enable user');
    }
  },
  async disableUser(id: string): Promise<any> {
    try {
      return await publicApi.post<any>(`/users/${id}/disable`);
    } catch (error) {
      throw new Error('Failed to disable user');
    }
  },
  async upload(
    file: File
  ): Promise<{ url: string; path: string; name: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await publicApi.post<{
        url: string;
        path: string;
        name: string;
      }>('/d/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response;
    } catch (error) {
      throw new Error('Failed to upload avatar user');
    }
  },
  async deleteAvatar(url: string): Promise<void> {
    try {
      const path = extractPath(url);
      return await publicApi.delete<void>(`/d/delete/${path}`);
    } catch (error) {
      throw new Error('Failed to delete avatar user');
    }
  },
  async getUserById(id: string): Promise<User> {
    try {
      const response = (await publicApi.get(`/users/${id}`)) as User;
      return response;
    } catch (error) {
      throw new Error('Failed to view user');
    }
  }
};

function extractPath(url: string): string {
  const parts = url.split('/uploads/');
  return parts[1] ? `/uploads/${parts[1]}` : '';
}
