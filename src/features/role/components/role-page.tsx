'use client';

import { RoleTable } from './role-tables';
import { roleColumns } from './role-tables/columns';
import { useMemo } from 'react';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { useGetRoles } from '@/core/domains/permissions';

export default function RolePage() {
  const { data, isLoading } = useGetRoles({
    status: 'enabled'
  });

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Vai trò</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  return (
    <div className='h-full w-full p-3'>
      <div className='flex h-full w-full flex-1 bg-white'>
        {!isLoading && data && (
          <RoleTable
            data={data?.['ui-roles']}
            totalItems={data?.total}
            columns={roleColumns()}
          />
        )}
      </div>
    </div>
  );
}
