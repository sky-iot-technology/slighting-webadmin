'use client';
import { uiModules } from '@/core/domains/permissions/ui-modules';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Checkbox } from '@/ui/components/ui/checkbox';
import { useState } from 'react';

// export const uiModules = [
//   // Tổng quan
//   { value: 'dashboard', label: 'Dashboard', actions: ['view'] },

//   // Thiết bị
//   {
//     value: 'device',
//     label: 'Quản lý thiết bị',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'control-cabinet',
//     label: 'Tủ điều khiển',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'sensor',
//     label: 'Cảm biến',
//     actions: ['view', 'create', 'update', 'delete']
//   },

//   // Người dùng & quyền
//   {
//     value: 'user',
//     label: 'Quản lý người dùng',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'role',
//     label: 'Quản lý vai trò',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'permission',
//     label: 'Phân quyền truy cập',
//     actions: ['view', 'update']
//   },

//   // Nhóm & chi nhánh
//   {
//     value: 'branch',
//     label: 'Chi nhánh / Khu vực',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'group',
//     label: 'Nhóm thiết bị / Khu vực',
//     actions: ['view', 'create', 'update', 'delete']
//   },

//   // Bảo trì & kế hoạch
//   {
//     value: 'maintenance',
//     label: 'Yêu cầu bảo trì',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'maintenance-process',
//     label: 'Quy trình bảo trì',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'plan',
//     label: 'Kế hoạch vận hành',
//     actions: ['view', 'create', 'update', 'delete']
//   },

//   // Lịch & giám sát
//   {
//     value: 'calendar',
//     label: 'Lịch trình chiếu sáng',
//     actions: ['view', 'create', 'update', 'delete']
//   },
//   {
//     value: 'monitoring',
//     label: 'Giám sát hoạt động',
//     actions: ['view']
//   },

//   // Nhật ký & cấu hình
//   {
//     value: 'audit-log',
//     label: 'Nhật ký hoạt động',
//     actions: ['view']
//   },
//   {
//     value: 'settings',
//     label: 'Cấu hình hệ thống',
//     actions: ['view', 'update']
//   }
// ] as const;

type PermissionMap = Record<string, string[]>;

type RolePermissionSectionProps = {
  value: PermissionMap;
  onChange: (val: PermissionMap) => void;
};

export default function RolePermissionSection({
  value,
  onChange
}: RolePermissionSectionProps) {
  const selectedModules = Object.keys(value);

  const toggleModule = (module: string, checked: boolean) => {
    const newPermissions = { ...value };

    if (checked) {
      newPermissions[module] = [];
    } else {
      delete newPermissions[module];
    }

    onChange(newPermissions);
  };

  const toggleAction = (module: string, action: string, checked: boolean) => {
    const current = value[module] ?? [];

    const updated = checked
      ? [...current, action]
      : current.filter((a) => a !== action);

    onChange({
      ...value,
      [module]: updated
    });
  };

  return (
    <div className='w-full max-w-xl space-y-3'>
      <div className='bg-card rounded-[4px] border'>
        <CustomScrollbar className='max-h-[213px] space-y-4 overflow-y-auto p-2'>
          {uiModules.map((ui) => {
            const isSelected = selectedModules.includes(ui.value);

            return (
              <div key={ui.value} className='space-y-2'>
                {/* Header Module */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        toggleModule(ui.value, !!checked)
                      }
                    />
                    <span className='text-xs'>{ui.label}</span>
                  </div>
                </div>

                {/* Actions */}
                {isSelected && (
                  <div className='mt-2 grid grid-cols-2 gap-2 pl-6 sm:grid-cols-4'>
                    {ui.actions.map((act) => (
                      <label
                        key={act}
                        className='flex cursor-pointer items-center gap-2 text-sm'
                      >
                        <Checkbox
                          checked={value[ui.value]?.includes(act)}
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
            );
          })}
        </CustomScrollbar>
      </div>
    </div>
  );
}
