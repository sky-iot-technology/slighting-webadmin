import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  GetGroupsHierarchyParamsDto,
  GetGroupsHierarchyResponseDto,
  GetGroupsParamsDto,
  GroupListResponseDto
} from './types';
import { groupsApi } from './api';

//Query keys
export const GROUPS_QUERY_KEY = 'groups';

export const useGetGroups = (
  params?: GetGroupsParamsDto,
  options?: Omit<
    UseQueryOptions<
      GroupListResponseDto,
      Error,
      GroupListResponseDto,
      readonly [string, GetGroupsParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    GroupListResponseDto,
    Error,
    GroupListResponseDto,
    readonly [string, GetGroupsParamsDto?]
  >({
    queryKey: [GROUPS_QUERY_KEY, params],
    queryFn: () => groupsApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useGetGroupHierarchy = (
  groupId: string,
  params?: GetGroupsHierarchyParamsDto,
  options?: Omit<
    UseQueryOptions<
      GetGroupsHierarchyResponseDto,
      Error,
      GetGroupsHierarchyResponseDto,
      readonly [string, string, GetGroupsHierarchyParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    GetGroupsHierarchyResponseDto,
    Error,
    GetGroupsHierarchyResponseDto,
    readonly [string, string, GetGroupsHierarchyParamsDto?]
  >({
    queryKey: [GROUPS_QUERY_KEY, groupId, params],
    queryFn: () => groupsApi.getHierarchyOfRoot(groupId, params),
    enabled: !!groupId,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};
