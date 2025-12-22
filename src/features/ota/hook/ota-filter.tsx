'use client';
import { GetOtasParamsDto } from '@/core/domains/ota';
import { useSearchParams } from 'next/navigation';

export function useOtaFiltersFromParams(): GetOtasParamsDto {
  const searchParams = useSearchParams();

  const page = searchParams.get('page');
  const pageLimit = searchParams.get('perPage');
  const category_type = searchParams.get('category_type') ?? undefined;
  const name = searchParams.get('name') ?? undefined;

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;

  const filtersExcludePagination = {
    ...(category_type && { category_type }),
    ...(name && { name })
  };

  const filters = {
    offset: (currentPage - 1) * limit,
    limit,
    ...filtersExcludePagination
  } as const;

  return filters;
}
