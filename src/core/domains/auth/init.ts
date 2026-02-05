'use client';

import { useEffect } from 'react';
import { useAuthStore } from './store';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { authApi } from './api';
import {
  normalizeUIPermission,
  rolesApi,
  usePermissionStore
} from '../permissions';

export function useAuthInit() {
  const { setLoading, setUser, setTokens, setDomainId } = useAuthStore();
  const setPermissions = usePermissionStore((s) => s.setPermissions);
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      try {
        // Check if we have tokens in cookies
        const accessToken = cookieUtils.getAccessToken();
        const refreshToken = cookieUtils.getRefreshToken();

        if (refreshToken) {
          // Try to get current user with the access token
          try {
            if (!accessToken) {
              throw { status: 401 };
            }
            const user = await authApi.getCurrentUser(accessToken);
            setUser(user);
            setTokens(accessToken, refreshToken);

            //Set DomainId for request
            const domainId = await authApi.getDomain();
            setDomainId(domainId);
            //Set role for User
            const roleId = user.metadata?.roleId;
            if (roleId) {
              const res = await rolesApi.getById(roleId);
              const uiPermission = normalizeUIPermission(res.permission.ui);
              setPermissions(uiPermission);
            }
          } catch (error: any) {
            // If access token is expired, try to refresh
            if (error.status === 401 || error.status === 404) {
              try {
                const newTokens = await authApi.refreshToken(refreshToken);
                setTokens(newTokens.access_token, newTokens.refresh_token);

                // Get user with new token
                const user = await authApi.getCurrentUser(
                  newTokens.access_token
                );
                setUser(user);

                //Set DomainId for request
                const domainId = await authApi.getDomain();
                setDomainId(domainId);
                //Set role for User (Need to set this again after refresh to ensure consistent state)
                const roleId = user.metadata?.roleId;
                if (roleId) {
                  const res = await rolesApi.getById(roleId);
                  const uiPermission = normalizeUIPermission(res.permission.ui);
                  setPermissions(uiPermission);
                }
              } catch (refreshError) {
                // Refresh failed, clear everything
                cookieUtils.clearAuthCookies();
                console.error('Token refresh failed:', refreshError);
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setLoading, setUser, setTokens, setDomainId, setPermissions]);
}
