import { create } from 'zustand';
import { ROUTE_PERMISSION_MAP } from './ui-modules';

export type PermissionMap = Record<string, Set<string>>;
export type PermissionFormMap = Record<string, string[]>;

interface PermissionStates {
  ui: PermissionMap;

  setPermissions: (ui: PermissionMap) => void;
  clearPermissions: () => void;

  can: (module: string, action: string) => boolean;
}

export const usePermissionStore = create<PermissionStates>((set, get) => ({
  ui: {},

  setPermissions: (ui) =>
    set({
      ui
    }),

  clearPermissions: () =>
    set({
      ui: {}
    }),

  can: (module, action) => {
    const perms = get().ui[module];
    return perms ? perms.has(action) : false;
  }
}));

export function normalizeUIPermission(
  raw: { id: string; actions: string[] }[]
): PermissionMap {
  return raw.reduce<PermissionMap>((acc, item) => {
    acc[item.id] = new Set(item.actions);
    return acc;
  }, {});
}

export const useCan = (module: string, action: string) =>
  usePermissionStore((state) => state.ui[module]?.has(action) ?? false);

export function getFirstAccessibleRoute(
  permissions: PermissionMap
): string | null {
  for (const route of ROUTE_PERMISSION_MAP) {
    const actions = permissions[route.permission.module];
    if (actions?.has(route.permission.action)) {
      return route.path;
    }
  }
  return null;
}
