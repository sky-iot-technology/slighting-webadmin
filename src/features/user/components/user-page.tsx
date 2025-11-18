'use client';

import { useMemo } from 'react';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { userColumns } from './user-tables/columns';
import { UserTable } from './user-tables';
import { useGetUsers } from '@/core/domains/users';

export default function UserPage() {
  const { data, isLoading } = useGetUsers({
    status: 'enabled'
  });

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Người dùng</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  return (
    <div className='h-full w-full p-3'>
      <div className='flex h-full w-full flex-1 bg-white'>
        {data && (
          <UserTable
            data={data.users}
            totalItems={data?.total}
            columns={userColumns()}
          />
        )}
      </div>
    </div>
  );
}
