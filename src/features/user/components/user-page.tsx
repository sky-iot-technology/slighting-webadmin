'use client';

import { useMemo } from 'react';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { userColumns } from './user-tables/columns';
import { UserTable } from './user-tables';
import { GetUsersParamsDto, useGetUsers } from '@/core/domains/users';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function UserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');

  const filters = useMemo<GetUsersParamsDto>(
    () => ({
      page: page ? parseInt(page.toString()) : 1,
      limit: pageLimit ? parseInt(pageLimit.toString()) : 10,
      ...(search && { name: search })
    }),
    [page, pageLimit, search]
  );

  const { data, isLoading, error } = useGetUsers({
    ...filters,
    dir: 'asc',
    status: 'all'
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
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
