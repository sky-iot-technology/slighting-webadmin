import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from './api';
import { type User } from './types';
import { useAuthStore } from './store';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { usersApi } from '../users';
import { storageApi } from '../storage';
import {
  getFirstAccessibleRoute,
  normalizeUIPermission,
  PermissionMap,
  rolesApi,
  usePermissionStore
} from '../permissions';
import { toast } from 'sonner';
import { useTranslation } from '@/core/domains/language/useTranslation';

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
  useAuthStore();
  const setPermissions = usePermissionStore((s) => s.setPermissions);
  const { t } = useTranslation();

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

        let uiPermission: PermissionMap = {};
        //setPermission
        const roleId = user.metadata?.roleId;
        if (roleId) {
          const res = await rolesApi.getById(roleId);
          uiPermission = normalizeUIPermission(res.permission.ui);
          setPermissions(uiPermission);
        }

        queryClient.setQueryData(authKeys.user(), user);
        toast.success(t('toast.login_success'));
        const nextRoute = getFirstAccessibleRoute(uiPermission);
        router.push(nextRoute ?? '/404');
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Failed to fetch user profile');
        toast.error(t('toast.login_failed_user_info'));
      }
    },
    onError: (error: Error) => {
      setLoading(false);
      setError(error.message || t('toast.login_failed'));

      toast.error(error.message || t('toast.login_failed'));
    }
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { setLoading, setError } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.signup,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setLoading(false);
      queryClient.setQueryData(authKeys.tokens(), data);

      toast.success(t('toast.signup_success'));
      router.push('/auth/sign-in');
    },
    onError: (error: Error) => {
      setLoading(false);
      setError(error.message || t('toast.signup_failed'));

      toast.error(error.message || t('toast.signup_failed'));
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearAuth, setLoading } = useAuthStore();

  const { clearPermissions } = usePermissionStore();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authApi.logout,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      clearAuth();
      clearPermissions();
      setLoading(false);
      queryClient.clear();

      toast.success(t('toast.logout_success'));
      router.push('/auth/sign-in');
    },
    onError: (error: Error) => {
      console.log(error);
      // Even if logout API fails, clear local state and cookies
      clearAuth();
      cookieUtils.clearAuthCookies();
      setLoading(false);
      queryClient.clear();

      toast.success(t('toast.logout_success'));
      router.push('/auth/sign-in');
    }
  });
}

export const useUpdateProfile = (
  options?: UseMutationOptions<User, Error, Partial<User>>
) => {
  const queryClient = useQueryClient();

  const { updateUser, setLoading, setError, user } = useAuthStore();
  const { t } = useTranslation();

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

      toast.success(t('toast.update_profile_success'));
    },
    onError: (error: Error) => {
      setLoading(false);
      setError(error.message || t('toast.update_profile_failed'));
      toast.error(error.message || t('toast.update_profile_failed'));
    }
  });
};

export const useUploadAvatar = (
  options?: UseMutationOptions<{ url: string; path: string }, Error, File>
) => {
  const queryClient = useQueryClient();

  const { updateUser, setLoading, setError, user } = useAuthStore();
  const { t } = useTranslation();

  return useMutation({
    ...options,
    mutationFn: async (file) => {
      if (!user) throw new Error('You must be logged in');

      const oldPath = user.profile_picture;
      const uploaded = await storageApi.upload(file);

      await authApi.updateAvatar(user.id, uploaded.url);

      if (oldPath) {
        await storageApi.deletefile(oldPath);
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

      toast.success(t('toast.upload_avatar_success'));
    },
    onError: (err) => {
      setLoading(false);
      setError(err.message);
      toast.error(t('toast.upload_avatar_failed'));
    }
  });
};

export const useDeleteAvatar = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  const { updateUser, setLoading, setError, user } = useAuthStore();
  const { t } = useTranslation();

  return useMutation<void, Error, string>({
    ...options,
    mutationFn: async (path) => {
      if (!user) throw new Error('You must be logged in');

      await storageApi.deletefile(path);
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

      toast.success(t('toast.delete_avatar_success'));
    },
    onError: (err) => {
      setLoading(false);
      setError(err.message);
      toast.error(t('toast.delete_avatar_failed'));
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
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => authApi.refreshToken(refreshToken || ''),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
    },
    onError: (error: Error) => {
      setError(error.message || t('toast.token_refresh_failed'));
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
