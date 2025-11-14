// src/core/permissions/ui-modules.ts

export const uiModules = [
  { value: 'dashboard', label: 'Dashboard', actions: ['view'] },
  {
    value: 'map',
    label: 'Bản đồ',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'maintenance',
    label: 'Bảo trì',
    actions: ['view', 'create', 'update', 'delete']
  }
  // Thiết bị
  //   { value: "device", label: "Quản lý thiết bị", actions: ["view", "create", "update", "delete"] },
  //   { value: "control-cabinet", label: "Tủ điều khiển", actions: ["view", "create", "update", "delete"] },
  //   { value: "sensor", label: "Cảm biến", actions: ["view", "create", "update", "delete"] },

  //   // Người dùng
  //   { value: "user", label: "Quản lý người dùng", actions: ["view", "create", "update", "delete"] },
  //   { value: "role", label: "Quản lý vai trò", actions: ["view", "create", "update", "delete"] },
  //   { value: "permission", label: "Phân quyền truy cập", actions: ["view", "update"] },

  //   // Nhóm
  //   { value: "branch", label: "Chi nhánh / Khu vực", actions: ["view", "create", "update", "delete"] },
  //   { value: "group", label: "Nhóm thiết bị / Khu vực", actions: ["view", "create", "update", "delete"] },

  //   // Bảo trì
  //   { value: "maintenance", label: "Yêu cầu bảo trì", actions: ["view", "create", "update", "delete"] },
  //   { value: "maintenance-process", label: "Quy trình bảo trì", actions: ["view", "create", "update", "delete"] },
  //   { value: "plan", label: "Kế hoạch vận hành", actions: ["view", "create", "update", "delete"] },

  //   // Lịch
  //   { value: "calendar", label: "Lịch trình chiếu sáng", actions: ["view", "create", "update", "delete"] },
  //   { value: "monitoring", label: "Giám sát hoạt động", actions: ["view"] },

  //   // Hệ thống
  //   { value: "audit-log", label: "Nhật ký hoạt động", actions: ["view"] },
  //   { value: "settings", label: "Cấu hình hệ thống", actions: ["view", "update"] }
] as const;

export type UIModuleValue = (typeof uiModules)[number]['value'];
