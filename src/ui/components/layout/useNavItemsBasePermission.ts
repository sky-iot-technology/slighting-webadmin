import { usePermissionStore } from '@/core/domains/permissions';
import { navItems } from '@/core/shared/constants/data';
import { NavItem } from '@/types';
import { useMemo } from 'react';

export function useNavItems(): NavItem[] {
  const can = usePermissionStore((s) => s.can);

  return useMemo(() => filterNavItems(navItems, can), [can]);
}

function filterNavItems(
  items: NavItem[],
  can: (resource: string, action: string) => boolean
): NavItem[] {
  return items
    .map((item) => {
      const filteredChildren = item.items
        ? filterNavItems(item.items, can)
        : [];

      const allowed = hasPermission(item, can) || filteredChildren.length > 0;

      if (!allowed) return null;

      return {
        ...item,
        items: filteredChildren
      };
    })
    .filter(Boolean) as NavItem[];
}

function hasPermission(item: NavItem, can: (r: string, a: string) => boolean) {
  if (!item.resourceId) return true;

  const actions = item.requiredActions ?? ['view'];
  return actions.every((action) => can(item.resourceId!, action));
}
