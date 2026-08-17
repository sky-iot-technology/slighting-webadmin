import { UIAction } from '@/core/domains/permissions';
import { LanguageKey } from '@/core/i18n/locales';
import { Icons } from '@/ui/components/icons';

export interface NavItem {
  title: Extract<LanguageKey, `navbar.${string}`>;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  modal?: boolean;

  resourceId?: string;
  featureId?: string;
  requiredActions?: UIAction[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
