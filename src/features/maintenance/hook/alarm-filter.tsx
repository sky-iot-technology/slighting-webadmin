'use client';
import { GetAlarmsParamsDto } from '@/core/domains/alarms';
import { useSearchParams } from 'next/navigation';

export function useAlarmFiltersFromParams(): GetAlarmsParamsDto {
  const searchParams = useSearchParams();

  const page = searchParams.get('page');
  const pageLimit = searchParams.get('perPage');
  const dirParam = searchParams.get('dir') ?? 'desc';
  const measurement = searchParams.get('measurement') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const createdAt = searchParams.get('created_at') ?? undefined;

  let created_from: string | undefined;
  let created_to: string | undefined;

  if (createdAt) {
    const [from, to] = createdAt.split(',');
    if (from) created_from = from;
    if (to) created_to = to;
  }

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;

  const filtersExcludePagination = {
    ...(status && { status: status as any }),
    ...(measurement && { measurement }),
    ...(created_from && { created_from }),
    ...(created_to && { created_to })
  };

  const filters = {
    dir: dirParam === 'asc' ? 'asc' : ('desc' as const),
    offset: (currentPage - 1) * limit,
    limit,
    ...filtersExcludePagination
  } as const;

  return filters;
}
