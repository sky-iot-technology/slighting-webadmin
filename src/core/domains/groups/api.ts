import { authenticatedApi } from '@/core/shared/api';
import { GroupListResponseDto, GetGroupsParamsDto } from './types';

export const groupsApi = {
  async getAll(params?: GetGroupsParamsDto): Promise<GroupListResponseDto> {
    const response = await authenticatedApi.get<GroupListResponseDto>(
      `/groups`,
      {
        params: {
          dir: 'asc',
          ...params
        }
      }
    );
    return response;
  }
};
