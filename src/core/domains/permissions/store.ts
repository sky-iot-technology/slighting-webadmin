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

const ACTION_MAP: Record<string, string> = {
  view: 'read',
  create: 'write',
  edit: 'update',
  delete: 'delete'
};

// Map ngược lại để kiểm tra cả 2 trường hợp
const REVERSE_ACTION_MAP: Record<string, string> = {
  read: 'view',
  write: 'create',
  update: 'edit',
  delete: 'delete'
};

// Helper function to safely check if action exists, supporting both Set and Array types
function hasAction(actions: any, action: string): boolean {
  if (!actions) return false;

  // Kiểm tra từ khóa chính (ví dụ: 'read')
  const check = (act: string) => {
    if (typeof actions.has === 'function') {
      return actions.has(act);
    }
    if (Array.isArray(actions)) {
      return actions.includes(act);
    }
    return false;
  };

  // Trả về true nếu khớp với action gốc hoặc action đã map tương ứng
  return (
    check(action) ||
    check(ACTION_MAP[action]) ||
    check(REVERSE_ACTION_MAP[action])
  );
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
    // Dynamically require authStore state to avoid circular dependency
    const { useAuthStore } = require('../auth/store');
    const user = useAuthStore.getState().user;
    const userRole = user?.role;

    if (userRole !== 'user') {
      return true;
    }

    if (userRole === 'user') {
      if (module === 'users' || module === 'role') {
        return false;
      }

      if (
        module === 'domain' &&
        (action === 'create' || action === 'update' || action === 'delete')
      ) {
        return false;
      }
    }

    const uiPermissions = get().ui;
    return hasAction(uiPermissions[module], action);
  }
}));

export function normalizeUIPermission(
  raw?: { id: string; actions: string[] }[]
): PermissionMap {
  if (!raw || !Array.isArray(raw)) return {};
  return raw.reduce<PermissionMap>((acc, item) => {
    if (item && item.id) {
      acc[item.id] = new Set(item.actions || []);
    }
    return acc;
  }, {});
}

export const useCan = (module: string, action: string) =>
  usePermissionStore((state) => state.can(module, action));

export function getFirstAccessibleRoute(
  permissions: PermissionMap
): string | null {
  console.log('DEBUG getFirstAccessibleRoute - permissions:', permissions);
  const { useAuthStore } = require('../auth/store');
  const user = useAuthStore.getState().user;
  if (user?.role !== 'user') {
    return '/dashboard/overview';
  }

  for (const route of ROUTE_PERMISSION_MAP) {
    const actions = permissions[route.permission.module];
    if (hasAction(actions, route.permission.action)) {
      return route.path;
    }
  }
  return null;
}
