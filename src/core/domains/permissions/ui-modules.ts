import { PermissionFormMap, PermissionMap } from './store';

export const uiModules = [
  { value: 'dashboard', label: 'Dashboard', actions: ['view'] },
  {
    value: 'map',
    label: 'Bản đồ',
    actions: ['view']
  },
  {
    value: 'device',
    label: 'Quản lý thiết bị',
    actions: ['view', 'create', 'update', 'delete', 'control']
  },
  {
    value: 'calendar',
    label: 'Quản lý lịch',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'maintenance',
    label: 'Quản lý bảo trì',
    actions: ['view']
  },
  {
    value: 'maintenance.alarm',
    label: 'Cảnh báo',
    actions: ['view', 'update', 'delete']
  },
  {
    value: 'maintenance.workorder',
    label: 'Giao việc',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'department',
    label: 'Quản lý tổ chức',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'ota',
    label: 'Quản lý Firmware',
    actions: ['view', 'create', 'update', 'sync', 'delete']
  },
  {
    value: 'tag',
    label: 'Quản lý nhóm yêu thích',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'branch',
    label: 'Quản lý chi nhánh',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'role',
    label: 'Quản lý vai trò',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'users',
    label: 'Quản lý người dùng',
    actions: ['view', 'create', 'update', 'delete']
  }
] as const;

export type UIModuleValue = (typeof uiModules)[number]['value'];

export const ROUTE_PERMISSION_MAP = [
  {
    path: '/dashboard/overview',
    permission: { module: 'dashboard', action: 'view' }
  },
  {
    path: '/dashboard/map',
    permission: { module: 'map', action: 'view' }
  },
  {
    path: '/dashboard/product',
    permission: { module: 'device', action: 'view' }
  },
  {
    path: '/dashboard/product/new',
    permission: { module: 'device', action: 'create' }
  },
  {
    path: '/dashboard/calendar',
    permission: { module: 'calendar', action: 'view' }
  },
  {
    path: '/dashboard/maintenance',
    permission: { module: 'maintenance', action: 'view' }
  },
  {
    path: '/dashboard/maintenance/edit',
    permission: { module: 'maintenance.workorder', action: 'update' }
  },
  {
    path: '/dashboard/calendar',
    permission: { module: 'calendar', action: 'view' }
  },
  {
    path: '/dashboard/organization',
    permission: { module: 'department', action: 'view' }
  },
  {
    path: '/dashboard/ota',
    permission: { module: 'ota', action: 'view' }
  },
  {
    path: '/dashboard/tag',
    permission: { module: 'tag', action: 'view' }
  },
  {
    path: '/dashboard/branch',
    permission: { module: 'branch', action: 'view' }
  },
  {
    path: '/dashboard/role',
    permission: { module: 'role', action: 'view' }
  },
  {
    path: '/dashboard/user',
    permission: { module: 'users', action: 'view' }
  }
];

export const ACTION_DEPENDENCIES: Record<string, string[]> = {
  update: ['view'],
  delete: ['view'],
  sync: ['view'],
  create: ['view'],
  control: ['view']
};

export function isActionDisabled(
  module: string,
  action: string,
  value: PermissionFormMap
) {
  const deps = ACTION_DEPENDENCIES[action];
  if (!deps) return false;

  const actions = value[module];
  if (!actions) return true;

  return !deps.every((dep) => actions.includes(dep));
}

export function normalizeActions(module: string, actions: string[]): string[] {
  if (!actions.includes('view')) {
    return actions.filter((act) => !ACTION_DEPENDENCIES[act]);
  }
  return actions;
}
