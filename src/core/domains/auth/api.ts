import axios from 'axios';
import {
  publicApi,
  authenticatedApi,
  type ApiRequestConfig
} from '@/core/shared/api';
import { cookieUtils } from '@/core/shared/utils/cookies';
import {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  User,
  ProfileUpdateData,
  DomainsResponse,
  OrgResponse,
  Domain
} from './types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await publicApi.post<AuthResponse>(`/users/tokens/issue`, {
      username: credentials.username,
      password: credentials.password
    });

    // Set cookies after successful login
    cookieUtils.setAuthCookies(response.access_token, response.refresh_token);

    return response;
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Note: The provided API doesn't have a signup endpoint
    // This is a placeholder - you'll need to implement this based on your backend
    throw new Error('Signup endpoint not available in current API');
  },

  async getOrg(): Promise<string> {
    const response = await authenticatedApi.get<OrgResponse>(`/orgs`);

    const orgs = response.orgs ?? [];
    if (orgs.length === 0) return '';

    const orgName = process.env.NEXT_PUBLIC_ORGANIZATION_NAME_DEFAULT || 'skt';

    if (orgName) {
      const matched = orgs.find((org) => org.name === orgName);

      if (matched) {
        return matched.id;
      }
    }
    return orgs[0].id;
  },

  async getDomain(orgId: string): Promise<string> {
    const response = await authenticatedApi.get<DomainsResponse>(`/domains`, {
      params: { org_id: orgId }
    });

    const domains = response.domains ?? [];
    if (domains.length === 0) return '';

    const domainRoute =
      process.env.NEXT_PUBLIC_DOMAIN_ROUTE_DEFAULT || 'admin12333';

    if (domainRoute) {
      const matched = domains.find((domain) => domain.route === domainRoute);

      if (matched) {
        return matched.id;
      }
    }
    return domains[0].id;
  },

  async getDomains(orgId: string): Promise<Domain[]> {
    const response = await authenticatedApi.get<DomainsResponse>(`/domains`, {
      params: { org_id: orgId }
    });
    return response.domains ?? [];
  },

  async createDomain(
    orgId: string,
    name: string,
    route: string
  ): Promise<Domain> {
    const response = await authenticatedApi.post<Domain>(`/domains`, {
      org_id: orgId,
      name,
      route,
      tags: [],
      status: 'enabled'
    });
    return response;
  },

  async updateDomain(
    domainId: string,
    name: string,
    route: string
  ): Promise<Domain> {
    const response = await authenticatedApi.patch<Domain>(
      `/domains/${domainId}`,
      {
        name,
        route
      }
    );
    return response;
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await authenticatedApi.get<User>(`/users/profile`);
    return response;
  },

  // async updateProfile(
  //   token: string,
  //   userId: string,
  //   updates: ProfileUpdateData
  // ): Promise<User> {
  //   // Note: The provided API doesn't have a profile update endpoint
  //   // This is a placeholder - you'll need to implement this based on your backend
  //   throw new Error('Profile update endpoint not available in current API');
  // },

  async logout(refreshToken: string): Promise<void> {
    try {
      // Call logout endpoint if available
      await authenticatedApi.post(`/users/logout`, {
        refresh_token: refreshToken
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear cookies
      cookieUtils.clearAuthCookies();
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await publicApi.post<AuthResponse>(
        `/users/tokens/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        }
      );

      // Update cookies with new tokens
      cookieUtils.setAuthCookies(response.access_token, response.refresh_token);

      return response;
    } catch (err: any) {
      // Re-throw as ApiError format for the interceptor to catch
      throw {
        message: err?.response?.data?.message || err.message,
        status: err?.response?.status,
        code: err?.response?.data?.code
      };
    }
  },

  async updateAvatar(id: string, picture: string): Promise<void> {
    try {
      return await authenticatedApi.patch<void>(`/users/${id}/picture`, {
        profile_picture: picture
      });
    } catch (error) {
      console.error('Can not update avatar', error);
    }
  }
};
