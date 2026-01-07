'use client';
import { PermissionFormMap } from '@/core/domains/permissions';
import {
  isActionDisabled,
  normalizeActions,
  uiModules
} from '@/core/domains/permissions/ui-modules';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Checkbox } from '@/ui/components/ui/checkbox';
import { useState } from 'react';

type RolePermissionSectionProps = {
  value: PermissionFormMap;
  onChange: (val: PermissionFormMap) => void;
  disabled?: boolean;
};

export default function RolePermissionSection({
  value,
  onChange,
  disabled
}: RolePermissionSectionProps) {
  const selectedModules = Object.keys(value);

  const allPermissions: PermissionFormMap = uiModules.reduce((acc, ui) => {
    acc[ui.value] = [...ui.actions];
    return acc;
  }, {} as PermissionFormMap);

  const allModuleKeys = uiModules.map((ui) => ui.value);

  const selectedModuleKeys = Object.keys(value);

  const isAllChecked =
    allModuleKeys.length > 0 &&
    allModuleKeys.every(
      (key) =>
        value[key]?.length ===
        uiModules.find((m) => m.value === key)?.actions.length
    );

  const isSomeChecked = selectedModuleKeys.length > 0 && !isAllChecked;

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

    let updated = checked
      ? [...current, action]
      : current.filter((a) => a !== action);

    updated = normalizeActions(module, updated);

    onChange({
      ...value,
      [module]: updated
    });
  };

  return (
    <div className='flex h-full w-full max-w-xl flex-col space-y-3 overflow-hidden'>
      <div className='bg-card flex h-full flex-1 flex-col overflow-hidden rounded-[4px] border'>
        <CustomScrollbar className='h-[18vw] min-h-[270px] space-y-4 overflow-y-auto p-2 md:min-h-[270px] lg:min-h-full'>
          {/* Chọn tất cả */}
          <div className='flex items-center gap-2 border-b pb-2'>
            <Checkbox
              disabled={disabled}
              checked={isAllChecked}
              data-state={
                isSomeChecked
                  ? 'indeterminate'
                  : isAllChecked
                    ? 'checked'
                    : 'unchecked'
              }
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange(allPermissions);
                } else {
                  onChange({});
                }
              }}
            />
            <span className='text-xs font-semibold'>Chọn tất cả</span>
          </div>

          {uiModules.map((ui) => {
            const isSelected = selectedModules.includes(ui.value);

            return (
              <div key={ui.value} className='space-y-2'>
                {/* Header Module */}
                <div className='flex items-center gap-2'>
                  <Checkbox
                    disabled={disabled}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      toggleModule(ui.value, !!checked)
                    }
                  />
                  <span className='text-xs'>{ui.label}</span>
                </div>

                {/* Actions */}
                {isSelected && (
                  <div className='mt-2 grid grid-cols-2 gap-2 pl-6 sm:grid-cols-4'>
                    {ui.actions.map((act) => {
                      const additionalDisabled = isActionDisabled(
                        ui.value,
                        act,
                        value
                      );
                      const isDisabled = disabled || additionalDisabled;
                      return (
                        <label key={act} className={`flex items-center gap-2`}>
                          <Checkbox
                            disabled={isDisabled}
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
                                  : act === 'sync'
                                    ? 'Đồng bộ'
                                    : act === 'control'
                                      ? 'Điều khiển'
                                      : 'Xóa'}
                          </span>
                        </label>
                      );
                    })}
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
