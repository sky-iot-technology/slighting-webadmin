'use client';
import { useSearchParams } from 'next/navigation';
import { GetDevicesParamsDto } from '@/core/domains/devices';

export function useDeviceFiltersFromParams(): GetDevicesParamsDto {
  const searchParams = useSearchParams();

  const page = searchParams.get('page');
  const pageLimit = searchParams.get('perPage');
  const statusParam = searchParams.get('status') ?? undefined;
  const dirParam = searchParams.get('dir') ?? 'desc';
  const metadata = searchParams.get('metadata') ?? undefined;
  const type = searchParams.get('type') ?? undefined;

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 100;

  const validStatuses = [
    'enabled',
    'disabled',
    'deleted',
    'all',
    'unknown'
  ] as const;

  const filtersExcludePagination = {
    ...(statusParam && { status: statusParam as any }),
    ...(type && { type }),
    ...(metadata && { metadata })
  };

  const filters = {
    dir: dirParam === 'asc' ? 'asc' : ('desc' as const),
    offset: (currentPage - 1) * limit,
    limit,
    ...filtersExcludePagination
  } as const;

  return filters;
}
