'use client';

import { fakeRoles } from '@/core/domains/role/fake';
import { RoleTable } from './calendar-tables';
import { roleColumns } from './calendar-tables/columns';
import { useMemo } from 'react';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';

export default function RolePage() {
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
        <RoleTable
          data={fakeRoles}
          totalItems={fakeRoles.length}
          columns={roleColumns()}
        />
      </div>
    </div>
  );
}
