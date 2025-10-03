'use client';

import { useEffect } from 'react';
import { useAuthStore } from './store';
import { cookieUtils } from '@/core/shared/utils/cookies';
import { authApi } from './api';

export function useAuthInit() {
  const { setLoading, setUser, setTokens, setDomainId } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      try {
        // Check if we have tokens in cookies
        const accessToken = cookieUtils.getAccessToken();
        const refreshToken = cookieUtils.getRefreshToken();

        if (accessToken && refreshToken) {
          // Try to get current user with the access token
          try {
            const user = await authApi.getCurrentUser(accessToken);
            setUser(user);
            setTokens(accessToken, refreshToken);

            //Set DomainId for request
            const domainId = await authApi.getDomain();
            setDomainId(domainId);
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
  }, [setLoading, setUser, setTokens]);
}
