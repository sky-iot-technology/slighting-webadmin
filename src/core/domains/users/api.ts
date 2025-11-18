import { authenticatedApi } from '@/core/shared/api';
import { GetUsersParamsDto, UserListResponseDto } from './types';

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
  }
};
