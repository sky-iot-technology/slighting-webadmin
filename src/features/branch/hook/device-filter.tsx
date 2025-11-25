'use client';
import { useSearchParams } from 'next/navigation';
import { GetDevicesParamsDto } from '@/core/domains/devices';

export function useDeviceFiltersFromParams(): GetDevicesParamsDto {
  const searchParams = useSearchParams();

  const page = searchParams.get('page');
  const pageLimit = searchParams.get('perPage');
  const statusParam = searchParams.get('status');
  const dirParam = searchParams.get('dir');
  const metadata = searchParams.get('metadata');
  const type = searchParams.get('type');

  const validStatuses = [
    'enabled',
    'disabled',
    'deleted',
    'all',
    'unknown'
  ] as const;
  type DeviceStatus = (typeof validStatuses)[number];

  const filters: GetDevicesParamsDto = {
    page: page ? parseInt(page) : 1,
    limit: pageLimit ? parseInt(pageLimit) : 100,
    status: validStatuses.includes(statusParam as DeviceStatus)
      ? (statusParam as DeviceStatus)
      : 'all',
    dir: dirParam === 'desc' ? 'desc' : 'asc',
    metadata: metadata ?? undefined,
    type: type ?? undefined
  };

  return filters;
}
