import { authenticatedApi } from '@/core/shared/api';
import {
  UserPreference,
  UpdateUserPreferenceInput,
  DomainTheme,
  UpdateDomainThemeInput
} from './types';

export function normalizeUserPreference(raw: any): UserPreference {
  if (!raw) return raw;
  return {
    user_id: raw.user_id || raw.UserID || '',
    theme: (raw.theme || raw.Theme || 'light').toLowerCase() as any,
    language: (raw.language || raw.Language || 'vi').toLowerCase() as any,
    sidebar_collapsed:
      raw.sidebar_collapsed !== undefined
        ? raw.sidebar_collapsed
        : raw.SidebarCollapsed !== undefined
          ? raw.SidebarCollapsed
          : false,
    default_domain_id: raw.default_domain_id || raw.DefaultDomainID || '',
    updated_at: raw.updated_at || raw.UpdatedAt || ''
  };
}

import { useAuthStore } from '@/core/domains/auth/store';

export const uiPreferencesApi = {
  async get(): Promise<UserPreference> {
    try {
      const res = await authenticatedApi.get<any>('/ui/preferences');
      return normalizeUserPreference(res);
    } catch (error: any) {
      const status = error.response?.status ?? error.status;
      if (status === 404) {
        const { domainId } = useAuthStore.getState();
        const defaultPrefs = {
          theme: 'light',
          language: 'vi',
          sidebar_collapsed: false,
          default_domain_id: domainId || ''
        };
        const res = await authenticatedApi.put<any>(
          '/ui/preferences',
          defaultPrefs
        );
        return normalizeUserPreference(res);
      }
      throw error;
    }
  },
  async update(data: UpdateUserPreferenceInput): Promise<UserPreference> {
    const res = await authenticatedApi.put<any>('/ui/preferences', data);
    return normalizeUserPreference(res);
  },
  async getFeatures(
    domainId: string
  ): Promise<{ feature_key: string; accessible: boolean }[]> {
    const res = await authenticatedApi.get<{
      features: { feature_key: string; accessible: boolean }[];
    }>(`/ui/${domainId}/features`);
    return res.features || [];
  }
};

export const uiThemeApi = {
  async getByDomain(domainId: string): Promise<DomainTheme> {
    return authenticatedApi.get<DomainTheme>(`/ui/${domainId}/themes`);
  },
  async updateByDomain(
    domainId: string,
    data: UpdateDomainThemeInput
  ): Promise<DomainTheme> {
    return authenticatedApi.put<DomainTheme>(`/ui/${domainId}/themes`, data);
  }
};
