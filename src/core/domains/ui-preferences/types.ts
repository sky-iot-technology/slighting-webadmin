export interface UserPreference {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: 'vi' | 'en';
  sidebar_collapsed: boolean;
  default_domain_id: string;
  updated_at?: string;
}

export interface UpdateUserPreferenceInput {
  theme?: 'light' | 'dark' | 'system';
  language?: 'vi' | 'en';
  sidebar_collapsed?: boolean;
  default_domain_id?: string;
}

export interface DomainTheme {
  id: string;
  domain_id: string;
  logo_url: string;
  primary_color: string;
  favicon_url: string;
  custom_css: string;
  updated_at?: string;
}

export interface UpdateDomainThemeInput {
  logo_url?: string;
  primary_color?: string;
  favicon_url?: string;
  custom_css?: string;
}
