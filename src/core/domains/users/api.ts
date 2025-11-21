import { authenticatedApi, publicApi } from '@/core/shared/api';
import {
  CreateUserDto,
  GetUsersParamsDto,
  User,
  UserListResponseDto
} from './types';

export const usersApi = {
  async getAll(params?: GetUsersParamsDto): Promise<UserListResponseDto> {
    const response = await authenticatedApi.get<UserListResponseDto>(`/users`, {
      params: {
        ...params
      }
    });
    return response;
  },
  async changepassByAdmin(userId: string, secret: string): Promise<void> {
    return await authenticatedApi.patch<void>(`/users/${userId}/secret`, {
      secret
    });
  },
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const response = (await publicApi.post(`/users`, data)) as User;
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
  // async uploadAvatar(file: File): Promise<{ url: string, path: string }> {
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     const response = await publicApi.post<{ url: string, path: string }>(
  //       '/d/upload',
  //       formData,
  //       {
  //         headers: { 'Content-Type': 'multipart/form-data' }
  //       }
  //     );

  //     return response;
  //   } catch (error) {
  //     throw new Error('Failed to upload avatar user');
  //   }
  // },
  // async deleteAvatar(path: string): Promise<void> {
  //   try {
  //     return await publicApi.delete<void>(
  //       `/d/delete/${path}`
  //     );

  //   } catch (error) {
  //     throw new Error('Failed to delete avatar user');
  //   }
  // }
  async getUserById(id: string): Promise<User> {
    try {
      const response = (await publicApi.get(`/users/${id}`)) as User;
      return response;
    } catch (error) {
      throw new Error('Failed to view user');
    }
  }
};
