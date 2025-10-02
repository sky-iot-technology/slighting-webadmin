import { authenticatedApi } from '@/core/shared/api';
import {
  GroupListResponseDto,
  GetGroupsParamsDto,
  GetGroupsHierarchyParamsDto,
  GetGroupsHierarchyResponseDto
} from './types';

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
  },

  async getHierarchyOfRoot(
    groupId: string,
    params: GetGroupsHierarchyParamsDto = {}
  ) {
    const defaultParams: GetGroupsHierarchyParamsDto = {
      level: 5,
      tree: true
    };
    const response = await authenticatedApi.get<GetGroupsHierarchyResponseDto>(
      `/groups/${groupId}/hierarchy`,
      {
        params: { ...defaultParams, ...params }
      }
    );

    return response;
  }
};
