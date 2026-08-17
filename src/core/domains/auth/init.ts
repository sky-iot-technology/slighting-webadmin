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
  const { setLoading, setUser, setTokens, setDomainId, setOrgId } =
    useAuthStore();
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
            const orgId = await authApi.getOrg();
            setOrgId(orgId);
            const domains = await authApi.getDomains(orgId);
            const savedDomainId = cookieUtils.getSelectedDomainId();
            if (savedDomainId && domains.some((d) => d.id === savedDomainId)) {
              setDomainId(savedDomainId);
            } else if (domains.length === 1) {
              setDomainId(domains[0].id);
              cookieUtils.setSelectedDomainId(domains[0].id);
            }
            //Set role for User
            if (user.role === 'user') {
              const role = await rolesApi.getUserRoles(user.id);
              if (role && role.roles && role.roles.length > 0) {
                const res = await rolesApi.getById(role.roles[0].id);
                if (res && res.permission && res.permission.ui) {
                  const uiPermission = normalizeUIPermission(res.permission.ui);
                  setPermissions(uiPermission);
                }
              }
            }
          } catch (error: any) {
            // If access token is expired, try to refresh
            if (error.status === 401) {
              try {
                const newTokens = await authApi.refreshToken(refreshToken);
                setTokens(newTokens.access_token, newTokens.refresh_token);

                // Get user with new token
                const user = await authApi.getCurrentUser(
                  newTokens.access_token
                );
                setUser(user);

                //Set DomainId for request
                const orgId = await authApi.getOrg();
                setOrgId(orgId);
                const domains = await authApi.getDomains(orgId);
                const savedDomainId = cookieUtils.getSelectedDomainId();
                if (
                  savedDomainId &&
                  domains.some((d) => d.id === savedDomainId)
                ) {
                  setDomainId(savedDomainId);
                } else if (domains.length === 1) {
                  setDomainId(domains[0].id);
                  cookieUtils.setSelectedDomainId(domains[0].id);
                }
                //Set role for User (Need to set this again after refresh to ensure consistent state)
                if (user.role === 'user') {
                  const role = await rolesApi.getUserRoles(user.id);
                  if (role && role.roles && role.roles.length > 0) {
                    const res = await rolesApi.getById(role.roles[0].id);
                    if (res && res.permission && res.permission.ui) {
                      const uiPermission = normalizeUIPermission(
                        res.permission.ui
                      );
                      setPermissions(uiPermission);
                    }
                  }
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
