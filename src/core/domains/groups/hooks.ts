import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { GetGroupsParamsDto, GroupListResponseDto } from './types';
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
