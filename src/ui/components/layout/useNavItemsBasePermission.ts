import { usePermissionStore } from '@/core/domains/permissions';
import { navItems } from '@/core/shared/constants/data';
import { NavItem } from '@/types';
import { useMemo } from 'react';
import { useGetUIFeatures } from '@/core/domains/ui-preferences/hooks';
import { useAuthStore } from '@/core/domains/auth/store';

export function useNavItems(): NavItem[] {
  const { domainId } = useAuthStore();
  const { data: features, isSuccess } = useGetUIFeatures(domainId || '');
  const can = usePermissionStore((s) => s.can);
  return useMemo(() => {
    // Map of feature_key -> feature object
    const featuresMap =
      isSuccess && features
        ? new Map<string, any>(features.map((f) => [f.feature_key, f]))
        : null;
    return filterAndSortNavItems(navItems, can, featuresMap);
  }, [can, features, isSuccess]);
}

function filterAndSortNavItems(
  items: NavItem[],
  can: (resource: string, action: string) => boolean,
  featuresMap: Map<string, any> | null
): NavItem[] {
  const processed = items
    .map((item) => {
      const updatedItem = { ...item };

      // 1. Check if the item itself is disabled by BFF features endpoint
      const featureKey = item.featureId || item.resourceId;
      if (featuresMap && featureKey) {
        const feature = featuresMap.get(featureKey);
        if (feature) {
          if (feature.accessible === false) {
            return null; // Explicitly disabled for this domain
          }

          // Attach sort_order to temporary property for sorting
          (updatedItem as any).sortOrder = feature.sort_order ?? 999;
        } else {
          // If the feature is registered on BFF but not present for this domain,
          // we can default its sort order or keep it.
          (updatedItem as any).sortOrder = 999;
        }
      } else {
        (updatedItem as any).sortOrder = (item as any).sortOrder ?? 999;
      }

      // 2. Check if the item is disabled by local permissions
      if (!hasPermission(updatedItem, can)) {
        console.log(updatedItem);
        return null;
      }

      // 3. Process children recursively
      const hasChildren =
        Array.isArray(updatedItem.items) && updatedItem.items.length > 0;
      if (hasChildren) {
        const filteredChildren = filterAndSortNavItems(
          updatedItem.items!,
          can,
          featuresMap
        );
        if (filteredChildren.length === 0) return null; // Hide parent if no visible children

        updatedItem.items = filteredChildren;

        // Parent inherits the minimum sort order of its children to sort correctly
        const childSortOrders = filteredChildren
          .map((c) => (c as any).sortOrder)
          .filter((o) => o !== undefined);
        if (childSortOrders.length > 0) {
          (updatedItem as any).sortOrder = Math.min(...childSortOrders);
        }
      }
      return updatedItem;
    })
    .filter(Boolean) as NavItem[];

  // 4. Sort dynamically by sort_order
  if (featuresMap) {
    processed.sort((a, b) => {
      const orderA = (a as any).sortOrder ?? 999;
      const orderB = (b as any).sortOrder ?? 999;
      return orderA - orderB;
    });
  }
  return processed;
}

function hasPermission(item: NavItem, can: (r: string, a: string) => boolean) {
  if (!item.resourceId) return true;

  const actions = item.requiredActions ?? ['view'];
  return actions.every((action) => can(item.resourceId!, action));
}
