import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import { usersApi } from './api';
import { toast } from 'sonner';
import { GetUsersParamsDto, UserListResponseDto } from './types';

export const USERS_QUERY_KEY = 'users';

export const useGetUsers = (
  params?: GetUsersParamsDto,
  options?: Omit<
    UseQueryOptions<
      UserListResponseDto,
      Error,
      UserListResponseDto,
      readonly [string, GetUsersParamsDto?]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    UserListResponseDto,
    Error,
    UserListResponseDto,
    readonly [string, GetUsersParamsDto?]
  >({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: () => usersApi.getAll(params),
    gcTime: 30 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useChangePasswordByAdmin = (
  options?: UseMutationOptions<void, Error, { id: string; secret: string }>
) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; secret: string }>({
    ...options,
    mutationFn: ({ id, secret }) => usersApi.changepassByAdmin(id, secret),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });

      toast.success('Update password successfully!');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to update password:', error);
      toast.error(error.message || 'Failed to update password');
      options?.onError?.(error, variables, context);
    }
  });
};

// export const useGetRoleById = (
//   roleId: string,
//   options?: Omit<
//     UseQueryOptions<
//       UIRoleResponse,
//       Error,
//       UIRoleResponse,
//       readonly [string, string, string]
//     >,
//     'queryKey' | 'queryFn'
//   >
// ) => {
//   return useQuery<
//     UIRoleResponse,
//     Error,
//     UIRoleResponse,
//     readonly [string, string, string]
//   >({
//     queryKey: [ROLES_QUERY_KEY, 'detail', roleId],
//     queryFn: () => rolesApi.getById(roleId),
//     gcTime: 30 * 60 * 1000,
//     staleTime: 5 * 60 * 1000,
//     ...options
//   });
// };

// export const useCreateRole = (
//   options?: UseMutationOptions<UIRoleResponse, Error, CreateRoleInput>
// ) => {
//   const queryClient = useQueryClient();

//   return useMutation<UIRoleResponse, Error, CreateRoleInput>({
//     ...options,
//     mutationFn: (data) => rolesApi.createRole(data),
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });

//       queryClient.setQueryData([ROLES_QUERY_KEY, data.id], data);

//       toast.success('Tạo vai trò thành công!');
//       options?.onSuccess?.(data, variables, context);
//     },

//     onError: (error, variables, context) => {
//       console.error('Failed to create role:', error);
//       toast.error(error.message || 'Tạo vai trò thất bại');
//       options?.onError?.(error, variables, context);
//     }
//   });
// };

// export const useUpdateRole = (
//   options?: UseMutationOptions<UIRoleResponse, Error, { id: string; data: UpdateRoleInput }>
// ) => {
//   const queryClient = useQueryClient();

//   return useMutation<UIRoleResponse, Error, { id: string; data: UpdateRoleInput }>({
//     ...options,
//     mutationFn: (data) => rolesApi.updateRole(data.id,data.data),
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });

//       queryClient.setQueryData([ROLES_QUERY_KEY, data.id], data);

//       toast.success('Cập nhật vai trò thành công!');
//       options?.onSuccess?.(data, variables, context);
//     },

//     onError: (error, variables, context) => {
//       console.error('Failed to create role:', error);
//       toast.error(error.message || 'Cập nhật vai trò thất bại');
//       options?.onError?.(error, variables, context);
//     }
//   });
// };
