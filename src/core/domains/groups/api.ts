import { authenticatedApi } from '@/core/shared/api';
import {
  GroupListResponseDto,
  GetGroupsParamsDto,
  GetGroupsHierarchyParamsDto,
  GetGroupsHierarchyResponseDto,
  Group,
  CreateGroupDTO,
  UpdateGroupDto,
  SetChildrenGroupDto
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
  },

  async getGroup(id: string): Promise<Group> {
    const response = await authenticatedApi.get<Group>(`/groups/${id}`);

    return response;
  },

  async createGroup(data: CreateGroupDTO): Promise<Group> {
    try {
      const response = await authenticatedApi.post<Group>('/groups', data);
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Không thể tạo nhánh. Vui lòng thử lại.';
      console.error('❌ createGroup error:', message);
      throw new Error(message);
    }
  },

  async deleteGroup(id: string): Promise<void> {
    try {
      await authenticatedApi.delete<Group>(`/groups/${id}`);
    } catch (error: any) {
      console.error('❌ deleteGroup error:', error.message);
      throw new Error(error.message);
    }
  },

  async updateGroup(id: string, data: UpdateGroupDto): Promise<Group> {
    try {
      const response = await authenticatedApi.put<Group>(`/groups/${id}`, data);
      return response;
    } catch (error: any) {
      console.error('❌ updateGroup error:', error.message);
      throw new Error(error.message);
    }
  },

  async addChildrenGroup(data: SetChildrenGroupDto): Promise<void> {
    try {
      await authenticatedApi.post<Group>(
        `/groups/${data.parent_id}/children`,
        data
      );
    } catch (error: any) {
      console.error('❌ Add Children Group error:', error.message);
      throw new Error(error.message);
    }
  },

  async removeParentGroup(id: string): Promise<void> {
    try {
      await authenticatedApi.delete<Group>(`/groups/${id}/parent`);
    } catch (error: any) {
      console.error('❌ Delete Children Group error:', error.message);
      throw new Error(error.message);
    }
  }
};
