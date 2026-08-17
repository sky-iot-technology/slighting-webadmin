import { authenticatedApi } from '@/core/shared/api';
import {
  ChangePassDto,
  CreateUserDto,
  GetUsersParamsDto,
  SearchUsersParamsDto,
  UpdateProfileDto,
  UpdateUserDto,
  User,
  UserListResponseDto
} from './types';

export const usersApi = {
  async getAll(
    orgId: string,
    params?: GetUsersParamsDto
  ): Promise<UserListResponseDto> {
    const { page = 1, limit = 20, ...rest } = params ?? {};
    const offset = (page - 1) * limit;
    const response = await authenticatedApi.get<UserListResponseDto>(`/users`, {
      params: {
        offset,
        limit,
        org_id: orgId,
        ...rest
      }
    });
    return response;
  },
  async searchUser(
    params?: SearchUsersParamsDto
  ): Promise<UserListResponseDto> {
    const response = await authenticatedApi.get<UserListResponseDto>(
      `/users/search`,
      {
        params: {
          ...params
        }
      }
    );
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
  async createUser(data: CreateUserDto & { org_id: string }): Promise<User> {
    try {
      const response = await authenticatedApi.post<User>(`/users`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteUser(id: string): Promise<void> {
    try {
      return await authenticatedApi.delete(`/users/${id}`);
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },
  async updateUserProfile(id: string, data: UpdateProfileDto): Promise<User> {
    try {
      const response = await authenticatedApi.patch<User>(`/users/${id}`, data);
      return response;
    } catch (error) {
      throw new Error('Failed to update profile user');
    }
  },
  // async updateUserRole(id: string, data: UpdateRoleDto): Promise<User> {
  //   try {
  //     const response = await authenticatedApi.patch<User>(
  //       `/users/${id}/role`,
  //       data
  //     );
  //     return response;
  //   } catch (error) {
  //     throw new Error('Failed to update role user');
  //   }
  // },
  // async updateUser(id: string, data: UpdateUserDto): Promise<User> {
  //   try {
  //     const { role, ...profileData } = data;
  //     const requests: Promise<User>[] = [];

  //     requests.push(this.updateUserProfile(id, profileData));
  //     if (role) {
  //       requests.push(this.updateUserRole(id, { role }));
  //     }

  //     const results = await Promise.all(requests);
  //     return results[results.length - 1];
  //   } catch (error) {
  //     throw new Error('Failed to update user');
  //   }
  // },
  async enableUser(id: string): Promise<any> {
    try {
      return await authenticatedApi.post<any>(`/users/${id}/enable`);
    } catch (error) {
      throw new Error('Failed to enable user');
    }
  },
  async disableUser(id: string): Promise<any> {
    try {
      return await authenticatedApi.post<any>(`/users/${id}/disable`);
    } catch (error) {
      throw new Error('Failed to disable user');
    }
  },
  async getUserById(id: string): Promise<User> {
    try {
      const response = (await authenticatedApi.get(`/users/${id}`)) as User;
      return response;
    } catch (error) {
      throw new Error('Failed to view user');
    }
  }
};
