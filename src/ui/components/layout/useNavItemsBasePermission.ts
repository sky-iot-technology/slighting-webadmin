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
      const hasChildren = Array.isArray(item.items) && item.items.length > 0;

      const filteredChildren = item.items
        ? filterNavItems(item.items, can)
        : [];

      if (hasChildren) {
        if (filteredChildren.length === 0) return null;

        return {
          ...item,
          items: filteredChildren
        };
      }

      if (!hasPermission(item, can)) return null;

      return item;
    })
    .filter(Boolean) as NavItem[];
}

function hasPermission(item: NavItem, can: (r: string, a: string) => boolean) {
  if (!item.resourceId) return true;

  const actions = item.requiredActions ?? ['view'];
  return actions.every((action) => can(item.resourceId!, action));
}
