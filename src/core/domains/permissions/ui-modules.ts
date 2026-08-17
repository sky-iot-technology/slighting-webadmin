import { PermissionFormMap, PermissionMap } from './store';

export const uiModules = [
  {
    value: 'domain',
    label: 'Domain',
    actions: ['view', 'create', 'update']
  },
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
    value: 'schedule',
    label: 'Quản lý lịch',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'alarm',
    label: 'Quản lý bảo trì',
    actions: ['view', 'create', 'update', 'delete']
  },
  // {
  //   value: 'maintenance.alarm',
  //   label: 'Cảnh báo',
  //   actions: ['view', 'update', 'delete']
  // },
  // {
  //   value: 'maintenance.workorder',
  //   label: 'Giao việc',
  //   actions: ['view', 'create', 'update', 'delete']
  // },
  // {
  //   value: 'department',
  //   label: 'Quản lý tổ chức',
  //   actions: ['view', 'create', 'update', 'delete']
  // },
  {
    value: 'firmware',
    label: 'Quản lý Firmware',
    actions: ['view', 'create', 'update', 'sync', 'delete']
  },
  {
    value: 'group',
    label: 'Quản lý nhóm',
    actions: ['view', 'create', 'update', 'delete']
  }
  // {
  //   value: 'role',
  //   label: 'Quản lý vai trò',
  //   actions: ['view', 'create', 'update', 'delete']
  // },
  // {
  //   value: 'users',
  //   label: 'Quản lý người dùng',
  //   actions: ['view', 'create', 'update', 'delete']
  // }
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
    permission: { module: 'schedule', action: 'view' }
  },
  {
    path: '/dashboard/maintenance',
    permission: { module: 'alarm', action: 'view' }
  },
  {
    path: '/dashboard/maintenance/edit',
    permission: { module: 'alarm', action: 'update' }
  },
  {
    path: '/dashboard/ota',
    permission: { module: 'firmware', action: 'view' }
  },
  {
    path: '/dashboard/tag',
    permission: { module: 'group', action: 'view' }
  },
  {
    path: '/dashboard/branch',
    permission: { module: 'group', action: 'view' }
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

export const MODULE_NAMES: Record<string, string> = {
  device: 'Thiết bị',
  devices: 'Thiết bị',
  device_group: 'Nhóm thiết bị',
  group: 'Chi nhánh & Khu vực',
  groups: 'Chi nhánh & Khu vực',
  branch: 'Chi nhánh & Khu vực',
  user: 'Tài khoản người dùng',
  users: 'Tài khoản người dùng',
  role: 'Vai trò & Phân quyền',
  roles: 'Vai trò & Phân quyền',
  'management-role': 'Vai trò & Phân quyền',
  management_role: 'Vai trò & Phân quyền',
  alarm: 'Cảnh báo & Sự cố',
  alarms: 'Cảnh báo & Sự cố',
  calendar: 'Lịch trình chiếu sáng',
  calendars: 'Lịch trình chiếu sáng',
  product: 'Sản phẩm & Danh mục',
  products: 'Sản phẩm & Danh mục',
  ota: 'Nâng cấp phần mềm (OTA)',
  workorder: 'Phiếu công việc',
  workorders: 'Phiếu công việc',
  overview: 'Tổng quan hệ thống',
  dashboard: 'Tổng quan hệ thống',
  tag: 'Nhãn & Phân loại',
  tags: 'Nhãn & Phân loại'
};

export const ACTION_NAMES: Record<string, string> = {
  view: 'Xem',
  read: 'Xem',
  get: 'Xem',
  list: 'Xem',
  create: 'Thêm',
  write: 'Thêm',
  add: 'Thêm',
  post: 'Thêm',
  update: 'Sửa',
  edit: 'Sửa',
  put: 'Sửa',
  patch: 'Sửa',
  delete: 'Xóa',
  remove: 'Xóa',
  destroy: 'Xóa',
  sync: 'Đồng bộ',
  execute: 'Thực thi'
};

export const getActionBadgeClass = (action: string) => {
  const act = action.toLowerCase();
  if (
    act.includes('xem') ||
    act.includes('read') ||
    act.includes('view') ||
    act.includes('get')
  ) {
    return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  }
  if (
    act.includes('thêm') ||
    act.includes('tạo') ||
    act.includes('write') ||
    act.includes('create') ||
    act.includes('add')
  ) {
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  }
  if (act.includes('sửa') || act.includes('update') || act.includes('edit')) {
    return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
  if (act.includes('xóa') || act.includes('delete') || act.includes('remove')) {
    return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  }
  return 'bg-primary/10 text-primary border-primary/20';
};
