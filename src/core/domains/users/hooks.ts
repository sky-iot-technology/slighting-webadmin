import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import { usersApi } from './api';
import { toast } from 'sonner';
import {
  CreateUserDto,
  GetUsersParamsDto,
  UpdateUserDto,
  User,
  UserListResponseDto
} from './types';

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

export const useGetUserById = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      User,
      Error,
      User,
      readonly [string, string, string | number]
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    User,
    Error,
    User,
    readonly [string, string, string | number]
  >({
    queryKey: [USERS_QUERY_KEY, 'detail', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
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

export const useCreateUser = (
  options?: UseMutationOptions<User, Error, CreateUserDto>
) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserDto>({
    ...options,
    mutationFn: (data) => usersApi.createUser(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      // queryClient.setQueryData({
      //   queryKey: [USERS_QUERY_KEY, 'detail', data.id]
      // });
      toast.success('Tạo user thành công!');
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('Failed to create user:', error);
      toast.error(error.message || 'Tạo user thất bại');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<User, Error, { id: string; data: UpdateUserDto }>
) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; data: UpdateUserDto }>({
    ...options,
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      // queryClient.setQueryData({
      //   queryKey: [USERS_QUERY_KEY, 'detail', data.id]
      // });
      toast.success('Update user thành công!');
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('Failed to update user:', error);
      toast.error(error.message || 'Update user thất bại');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: (id) => usersApi.deleteUser(id),
    onSuccess: (data, deleteId, context) => {
      //Remove calendar from cache
      // queryClient.removeQueries({
      //   queryKey: [GROUPS_QUERY_KEY, deleteId]
      // });

      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY]
      });

      toast.success('User deleted successfully');
      options?.onSuccess?.(data, deleteId, context);
    },
    onError: (error, variables, context) => {
      console.error('Failed to delete user: ', error);
      toast.error(error.message || 'Failed to delete user');
      options?.onError?.(error, variables, context);
    }
  });
};

export const useUpdateUserStatus = (
  options?: UseMutationOptions<User, Error, { id: string; enabled: boolean }>
) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; enabled: boolean }>({
    ...options,
    mutationFn: ({ id, enabled }) => {
      if (enabled) {
        return usersApi.enableUser(id);
      } else {
        return usersApi.disableUser(id);
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      // queryClient.setQueryData({
      //   queryKey: [USERS_QUERY_KEY, 'detail', data.id]
      // });
      toast.success('Update user thành công!');
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error('Failed to update user:', error);
      toast.error(error.message || 'Update user thất bại');
      options?.onError?.(error, variables, context);
    }
  });
};

// export const useUploadAvatar = (
//   options?: UseMutationOptions<{ url: string, path: string }, Error, File>
// ) => {
//   return useMutation({
//     mutationFn: (file) => usersApi.uploadAvatar(file),
//     onError: (err) => toast.error('Upload avatar failed'),
//     ...options
//   });
// };

// export const useDeleteAvatar = (
//   options?: UseMutationOptions<void, Error, string>
// ) => {
//   return useMutation<void, Error, string>({
//     mutationFn: (path) => usersApi.deleteAvatar(path),
//     onError: (err) => toast.error('Delete avatar failed'),
//     ...options
//   });
// };
