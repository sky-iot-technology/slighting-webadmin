import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import {
  CreateGroupDTO,
  GetGroupsHierarchyParamsDto,
  GetGroupsHierarchyResponseDto,
  GetGroupsParamsDto,
  Group,
  GroupListResponseDto,
  SetChildrenGroupDto,
  UpdateGroupDto
} from './types';
import { groupsApi } from './api';
import { toast } from 'sonner';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useRegionTreeStore } from '../tree/store';

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

//todo fix cache
export const useGetGroup = (
  groupId?: string,
  options?: Omit<
    UseQueryOptions<Group, Error, Group, readonly [string, string]>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<Group, Error, Group, readonly [string, string]>({
    queryKey: [GROUPS_QUERY_KEY, groupId ?? ''],
    queryFn: async () => {
      if (!groupId) throw new Error('Group ID is undefined');
      return groupsApi.getGroup(groupId);
    },
    enabled: !!groupId,
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useCreateGroup = (
  options?: UseMutationOptions<Group, Error, CreateGroupDTO>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Group, Error, CreateGroupDTO>({
    ...options,
    mutationFn: (data) => groupsApi.createGroup(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });

      // Add the new group to the cache
      queryClient.setQueryData([GROUPS_QUERY_KEY, data.id], data);

      useRegionTreeStore.getState().fetchTree();

      toast.success(t('toast.create_group_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to create group:', error);
      toast.error(error.message || t('toast.create_group_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteGroup = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: (id) => groupsApi.deleteGroup(id),
    onSuccess: (data, deleteId, context) => {
      //Remove calendar from cache
      queryClient.removeQueries({
        queryKey: [GROUPS_QUERY_KEY, deleteId]
      });

      queryClient.invalidateQueries({
        queryKey: [GROUPS_QUERY_KEY]
      });

      useRegionTreeStore.getState().fetchTree();

      toast.success(t('toast.delete_group_success'));
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete Group: ', error);
      toast.error(error.message || t('toast.delete_group_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useUpdateGroup = (
  options?: UseMutationOptions<
    Group,
    Error,
    { id: string; data: UpdateGroupDto }
  >
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Group, Error, { id: string; data: UpdateGroupDto }>({
    ...options,
    mutationFn: ({ id, data }) => groupsApi.updateGroup(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });

      queryClient.setQueryData([GROUPS_QUERY_KEY, data.id], data);

      useRegionTreeStore.getState().fetchTree();

      toast.success(t('toast.update_group_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to update Group:', error);
      toast.error(error.message || t('toast.update_group_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};

export const useSetChildrenGroup = (
  options?: UseMutationOptions<void, Error, SetChildrenGroupDto>
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, SetChildrenGroupDto>({
    ...options,
    mutationFn: async (data) => {
      if (!data.parent_id) {
        await groupsApi.removeParentGroup(data.children_ids[0]);
        return;
      }
      if (data.parent_id_old) {
        await groupsApi.removeParentGroup(data.children_ids[0]);
      }
      await groupsApi.addChildrenGroup(data);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
      useRegionTreeStore.getState().fetchTree();
      toast.success(t('toast.update_device_parent_success'));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to update device parent:', error);
      toast.error(error.message || t('toast.update_device_parent_failed'));
      options?.onError?.(error, variables, context);
    }
  });
};
