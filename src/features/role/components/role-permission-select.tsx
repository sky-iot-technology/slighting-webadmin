'use client';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Checkbox } from '@/ui/components/ui/checkbox';
import { useState } from 'react';

export const uiModules = [
  // Tổng quan
  { value: 'dashboard', label: 'Dashboard', actions: ['view'] },

  // Thiết bị
  {
    value: 'device',
    label: 'Quản lý thiết bị',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'control-cabinet',
    label: 'Tủ điều khiển',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'sensor',
    label: 'Cảm biến',
    actions: ['view', 'create', 'update', 'delete']
  },

  // Người dùng & quyền
  {
    value: 'user',
    label: 'Quản lý người dùng',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'role',
    label: 'Quản lý vai trò',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'permission',
    label: 'Phân quyền truy cập',
    actions: ['view', 'update']
  },

  // Nhóm & chi nhánh
  {
    value: 'branch',
    label: 'Chi nhánh / Khu vực',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'group',
    label: 'Nhóm thiết bị / Khu vực',
    actions: ['view', 'create', 'update', 'delete']
  },

  // Bảo trì & kế hoạch
  {
    value: 'maintenance',
    label: 'Yêu cầu bảo trì',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'maintenance-process',
    label: 'Quy trình bảo trì',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'plan',
    label: 'Kế hoạch vận hành',
    actions: ['view', 'create', 'update', 'delete']
  },

  // Lịch & giám sát
  {
    value: 'calendar',
    label: 'Lịch trình chiếu sáng',
    actions: ['view', 'create', 'update', 'delete']
  },
  {
    value: 'monitoring',
    label: 'Giám sát hoạt động',
    actions: ['view']
  },

  // Nhật ký & cấu hình
  {
    value: 'audit-log',
    label: 'Nhật ký hoạt động',
    actions: ['view']
  },
  {
    value: 'settings',
    label: 'Cấu hình hệ thống',
    actions: ['view', 'update']
  }
] as const;

export default function RolePermissionSection() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  const toggleModule = (module: string, checked: boolean) => {
    const updated = checked
      ? [...selectedModules, module]
      : selectedModules.filter((m) => m !== module);

    setSelectedModules(updated);
    if (!checked) {
      const newPerms = { ...permissions };
      delete newPerms[module];
      setPermissions(newPerms);
    }
  };

  const toggleAction = (module: string, action: string, checked: boolean) => {
    const current = permissions[module] ?? [];
    const updated = checked
      ? [...current, action]
      : current.filter((a) => a !== action);
    setPermissions({ ...permissions, [module]: updated });
  };

  return (
    <div className='w-full max-w-xl space-y-3'>
      <div className='bg-card rounded-[4px] border'>
        <CustomScrollbar className='max-h-[213px] space-y-4 overflow-y-auto p-2'>
          {uiModules.map((ui) => (
            <div key={ui.value} className='space-y-2'>
              {/* Header Module */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    checked={selectedModules.includes(ui.value)}
                    onCheckedChange={(checked) =>
                      toggleModule(ui.value, !!checked)
                    }
                  />
                  <span className='text-xs'>{ui.label}</span>
                </div>
              </div>

              {/* Actions */}
              {selectedModules.includes(ui.value) && (
                <div className='mt-2 grid grid-cols-2 gap-2 pl-6 sm:grid-cols-4'>
                  {ui.actions.map((act) => (
                    <label
                      key={act}
                      className='flex cursor-pointer items-center gap-2 text-sm'
                    >
                      <Checkbox
                        checked={permissions[ui.value]?.includes(act)}
                        onCheckedChange={(checked) =>
                          toggleAction(ui.value, act, !!checked)
                        }
                      />
                      <span className='text-xs'>
                        {act === 'view'
                          ? 'Xem'
                          : act === 'create'
                            ? 'Thêm'
                            : act === 'update'
                              ? 'Sửa'
                              : 'Xóa'}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CustomScrollbar>
      </div>
    </div>
  );
}
