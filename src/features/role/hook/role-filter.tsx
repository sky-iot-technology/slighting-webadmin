'use client';
import { useSearchParams } from 'next/navigation';
import { GetRolesParamsDto } from '@/core/domains/permissions';

export function useRoleFiltersFromParams(): GetRolesParamsDto {
  const searchParams = useSearchParams();

  const page = searchParams.get('page');
  const pageLimit = searchParams.get('perPage');

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;

  const filtersExcludePagination = {
    // ...(type && { type }),
    // ...(metadata && { metadata })
  };

  const filters = {
    offset: (currentPage - 1) * limit,
    limit,
    ...filtersExcludePagination
  } as const;

  return filters;
}
