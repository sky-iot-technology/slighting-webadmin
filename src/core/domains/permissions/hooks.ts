import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import {
  CreateRoleInput,
  GetRolesParamsDto,
  RoleListResponseDto,
  UIRoleResponse,
  UpdateRoleInput
} from './types';
import { rolesApi } from './api';
import { toast } from 'sonner';

export const ROLES_QUERY_KEY = 'ui-roles';

export const useGetRoles = (
  params?: GetRolesParamsDto,
  options?: Omit<
    UseQueryOptions<
      RoleListResponseDto,
      Error,
      RoleListResponseDto,
      readonly [string, GetRolesParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    RoleListResponseDto,
    Error,
    RoleListResponseDto,
    readonly [string, GetRolesParamsDto?]
  >({
    queryKey: [ROLES_QUERY_KEY, params],
    queryFn: () => rolesApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useGetRoleById = (
  roleId: string,
  options?: Omit<
    UseQueryOptions<
      UIRoleResponse,
      Error,
      UIRoleResponse,
      readonly [string, string, string]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    UIRoleResponse,
    Error,
    UIRoleResponse,
    readonly [string, string, string]
  >({
    queryKey: [ROLES_QUERY_KEY, 'detail', roleId],
    queryFn: () => rolesApi.getById(roleId),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useCreateRole = (
  options?: UseMutationOptions<UIRoleResponse, Error, CreateRoleInput>
) => {
  const queryClient = useQueryClient();

  return useMutation<UIRoleResponse, Error, CreateRoleInput>({
    ...options,
    mutationFn: (data) => rolesApi.createRole(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });

      queryClient.setQueryData([ROLES_QUERY_KEY, data.id], data);

      toast.success('Tạo vai trò thành công!');
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('Failed to create role:', error);
      toast.error(error.message || 'Tạo vai trò thất bại');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useUpdateRole = (
  options?: UseMutationOptions<
    UIRoleResponse,
    Error,
    { id: string; data: UpdateRoleInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    UIRoleResponse,
    Error,
    { id: string; data: UpdateRoleInput }
  >({
    ...options,
    mutationFn: (data) => rolesApi.updateRole(data.id, data.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });

      queryClient.setQueryData([ROLES_QUERY_KEY, data.id], data);

      toast.success('Cập nhật vai trò thành công!');
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('Failed to create role:', error);
      toast.error(error.message || 'Cập nhật vai trò thất bại');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteRole = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: (id) => rolesApi.deleteRole(id),
    onSuccess: (data, deleteId, context) => {
      queryClient.removeQueries({
        queryKey: [ROLES_QUERY_KEY, deleteId]
      });

      queryClient.invalidateQueries({
        queryKey: [ROLES_QUERY_KEY]
      });

      toast.success('Role deleted successfully');
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete Role: ', error);
      toast.error(error.message || 'Failed to delete Role');
      options?.onError?.(error, variables, context);
    }
  });
};
