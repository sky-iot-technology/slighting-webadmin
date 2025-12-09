import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from './api';
import { type User } from './types';
import { useAuthStore } from './store';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { usersApi } from '../users';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  tokens: () => [...authKeys.all, 'tokens'] as const
};

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, setTokens, setLoading, setError, setDomainId } =
    useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: async (data) => {
      try {
        // Get user profile using the access token
        const user = await authApi.getCurrentUser(data.access_token);
        setUser(user);
        setTokens(data.access_token, data.refresh_token);

        //Set DomainId for request
        const domainId = await authApi.getDomain();
        setDomainId(domainId);

        queryClient.setQueryData(authKeys.user(), user);
        toast.success('Đăng nhập thành công!');
        router.push('/dashboard/overview');
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Failed to fetch user profile');
        toast.error(
          'Đăng nhập thành công nhưng không thể lấy thông tin người dùng'
        );
      }
    },
    onError: (error: Error) => {
      setLoading(false);
      setError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: authApi.signup,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setLoading(false);
      queryClient.setQueryData(authKeys.tokens(), data);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/auth/sign-in');
    },
    onError: (error: Error) => {
      setLoading(false);
      setError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      toast.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      clearAuth();
      setLoading(false);
      queryClient.clear();
      toast.success('Đăng xuất thành công!');
      router.push('/auth/sign-in');
    },
    onError: (error: Error) => {
      console.log(error);
      // Even if logout API fails, clear local state and cookies
      clearAuth();
      cookieUtils.clearAuthCookies();
      setLoading(false);
      queryClient.clear();
      toast.success('Đăng xuất thành công!');
      router.push('/auth/sign-in');
    }
  });
}

// export function useUpdateProfile() {
//   const queryClient = useQueryClient();
//   const { updateUser, setLoading, setError, accessToken } = useAuthStore();

//   return useMutation({
//     mutationFn: ({
//       userId,
//       updates
//     }: {
//       userId: string;
//       updates: Partial<User>;
//     }) => authApi.updateProfile(accessToken || '', userId, updates),
//     onMutate: () => {
//       setLoading(true);
//       setError(null);
//     },
//     onSuccess: (updatedUser) => {
//       updateUser(updatedUser);
//       setLoading(false);
//       queryClient.setQueryData(authKeys.user(), updatedUser);
//       toast.success('Cập nhật thông tin thành công!');
//     },
//     onError: (error: Error) => {
//       setLoading(false);
//       setError(
//         error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.'
//       );
//       toast.error(
//         error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.'
//       );
//     }
//   });
// }

export const useUpdateProfile = (
  options?: UseMutationOptions<User, Error, Partial<User>>
) => {
  const queryClient = useQueryClient();
  const { updateUser, setLoading, setError, user } = useAuthStore();

  return useMutation<User, Error, Partial<User>>({
    ...options,
    mutationFn: (data) => {
      if (!user) {
        throw new Error('You must be logged in to update profile');
      }
      return usersApi.updateUserProfile(user.id, data);
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      setLoading(false);
      queryClient.setQueryData(authKeys.user(), updatedUser);
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (error: Error) => {
      setLoading(false);
      setError(
        error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.'
      );
      toast.error(
        error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.'
      );
    }
  });
};

export const useUploadAvatar = (
  options?: UseMutationOptions<{ url: string; path: string }, Error, File>
) => {
  const queryClient = useQueryClient();
  const { updateUser, setLoading, setError, user } = useAuthStore();

  return useMutation({
    ...options,
    mutationFn: async (file) => {
      if (!user) throw new Error('You must be logged in');

      const oldPath = user.profile_picture;
      const uploaded = await usersApi.upload(file);

      await authApi.updateAvatar(user.id, uploaded.url);

      if (oldPath) {
        await usersApi.deleteAvatar(oldPath);
      }

      return uploaded;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: ({ url }) => {
      updateUser({
        profile_picture: url
      });
      setLoading(false);
      queryClient.invalidateQueries({
        queryKey: authKeys.user()
      });
      toast.success('Cập nhật ảnh đại diện thành công!');
    },
    onError: (err) => {
      setLoading(false);
      setError(err.message);
      toast.error('Tải ảnh đại diện thất bại, vui lòng thử lại');
    }
  });
};

export const useDeleteAvatar = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  const { updateUser, setLoading, setError, user } = useAuthStore();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: async (path) => {
      if (!user) throw new Error('You must be logged in');

      await usersApi.deleteAvatar(path);
      await authApi.updateAvatar(user.id, '');

      return;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      updateUser({
        profile_picture: ''
      });
      setLoading(false);
      queryClient.invalidateQueries({
        queryKey: authKeys.user()
      });
      toast.success('Xóa ảnh đại diện thành công!');
    },
    onError: (err) => {
      setLoading(false);
      setError(err.message);
      toast.error('Không thể xóa ảnh đại diện!');
    }
  });
};

export function useCurrentUser() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.getCurrentUser(accessToken || ''),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!accessToken // Only fetch if we have a token
  });
}

export function useRefreshToken() {
  const { setTokens, setError, refreshToken } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.refreshToken(refreshToken || ''),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
    },
    onError: (error: Error) => {
      setError(error.message || 'Token refresh failed');
    }
  });
}

// Hook to get authentication status from store
export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error
  }));
}
