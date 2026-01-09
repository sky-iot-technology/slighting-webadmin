'use client';

import { RoleTable } from './role-tables';
import { roleColumns } from './role-tables/columns';
import { useMemo } from 'react';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import {
  useCan,
  useGetRoles,
  usePermissionStore
} from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

export default function RolePage() {
  const { t } = useTranslation();

  const canSync = useCan('device', 'sync');
  const { data, isLoading, error } = useGetRoles({
    status: 'enabled'
  });

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>{t('navbar.roles')}</span>
      </div>
    ),
    [t]
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  return (
    <div className='h-full w-full p-3'>
      <div className='flex h-full w-full flex-1 bg-white'>
        <RoleTable
          data={data?.['ui-roles'] ?? []}
          totalItems={data?.total ?? 0}
          columns={roleColumns()}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
