'use client';
import { GetWorkOrderParamsDto } from '@/core/domains/workorders';
import { useSearchParams } from 'next/navigation';

export function useWorkOrderFiltersFromParams(): GetWorkOrderParamsDto {
  const searchParams = useSearchParams();

  const page = searchParams.get('page');
  const pageLimit = searchParams.get('perPage');
  const dirParam = searchParams.get('dir') ?? 'desc';
  const status = searchParams.get('status') ?? undefined;
  const work_order_name = searchParams.get('work_order_name') ?? undefined;

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;

  const filtersExcludePagination = {
    ...(status && { status: status as any }),
    ...(work_order_name && { work_order_name })
  };

  const filters = {
    dir: dirParam === 'asc' ? 'asc' : ('desc' as const),
    offset: (currentPage - 1) * limit,
    limit,
    ...filtersExcludePagination
  } as const;

  return filters;
}
