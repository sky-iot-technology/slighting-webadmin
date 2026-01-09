'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ProductTable } from './product-tables';
import { deviceColumns } from './product-tables/device-columns';
import {
  type Device,
  useGetDevices,
  useGetDeviceCount
} from '@/core/domains/devices';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { useGetGroups } from '@/core/domains/groups';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { Option } from '@/types/data-table';
import { Button } from '@/ui/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { findNodeById, findNodeId } from '@/features/calendar/helper';
import { useTranslation } from '@/core/domains/language/useTranslation';

type ProductListingPage = {};

export default function ProductListingPage({}: ProductListingPage) {
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const dir = searchParams.get('dir') ?? 'desc';
  const order = searchParams.get('order') ?? 'updated_at';
  const status = searchParams.get('status') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const serial_number = searchParams.get('serial_number') ?? undefined;
  const parent_group_id = searchParams.get('parent_group_id') ?? undefined;

  const { treeData } = useRegionTreeStore();

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;
  // Fetch device counts with filters (excluding pagination)
  const filtersExcludePagination = {
    ...(search && { name: search }),
    ...(status && { metadata: status as any }),
    ...(type && { type }),
    ...(serial_number && { serial_number }),
    ...(parent_group_id && {
      group: findNodeId(treeData, parent_group_id) as any
    })
  };
  const filters = {
    dir: dir === 'asc' ? 'asc' : ('desc' as const),
    offset: (currentPage - 1) * limit,
    limit,
    order,
    ...filtersExcludePagination
  } as const;

  const { data, isLoading, error, refetch } = useGetDevices(filters);

  const { data: onlineData, refetch: refetchOnline } = useGetDeviceCount(
    true,
    filtersExcludePagination
  );
  const { data: offlineData, refetch: refetchOffline } = useGetDeviceCount(
    false,
    filtersExcludePagination
  );

  const { catalogues } = useCatalogueStore();

  // Memoize the breadcrumb content to prevent infinite re-renders
  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>{t('navbar.device')}</span>
      </div>
    ),
    [t]
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const typeOptions = useMemo(() => {
    return catalogues.map((catalogue) => ({
      label: catalogue.name,
      value: catalogue.type
    }));
  }, [catalogues]);

  const columns = useMemo(() => {
    return deviceColumns.map((col) => {
      // TYPE FILTER
      if (col.id === 'type') {
        return {
          ...col,
          meta: {
            ...col.meta,
            options: typeOptions
          },
          cell: ({ cell }: any) => {
            const type = cell.getValue() as Device['type'];
            const option = typeOptions.find((o) => o.value === type);
            return <div>{option?.label ?? ''}</div>;
          }
        };
      }

      // GROUP FILTER
      if (col.id === 'parent_group_id') {
        return {
          ...col,
          meta: {
            ...col.meta,
            variant: 'regionTree'
          },
          cell: ({ cell }: any) => {
            const groupId = cell.getValue() as Device['parent_group_id'];
            const groupNode = findNodeById(treeData, groupId) || null;
            return <div>{groupNode?.name ?? '-'}</div>;
          }
        };
      }

      return col;
    });
  }, [typeOptions]);

  const isFilterReady = typeOptions.length > 0;

  const actionBar = (
    <div className='ml-4 flex items-center gap-6 py-2'>
      {/* Online Status */}
      <div className='flex items-center gap-2'>
        <div className='h-3 w-3 rounded-full bg-green-500' />
        <span className='text-sm font-medium'>
          Online: {onlineData?.total ?? 0}
        </span>
      </div>

      {/* Offline Status */}
      <div className='flex items-center gap-2'>
        <div className='h-3 w-3 rounded-full bg-red-500' />
        <span className='text-sm font-medium'>
          Offline: {offlineData?.total ?? 0}
        </span>
      </div>

      {/* Total Status */}
      <div className='flex items-center gap-2'>
        <div className='relative h-3 w-3'>
          <div className='absolute h-3 w-3 rounded-full border-2 border-green-300' />
          <div className='absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500' />
        </div>
        <span className='text-sm font-medium'>
          Tổng: {(onlineData?.total ?? 0) + (offlineData?.total ?? 0)}
        </span>
      </div>
    </div>
  );

  const handleRefetch = async () => {
    toast.success('Đồng bộ thiết bị đã được khởi tạo');
    await Promise.all([refetch(), refetchOnline(), refetchOffline()]);
  };

  return (
    <div className='flex h-full w-full flex-col'>
      <ProductTable
        data={(data?.devices as Device[]) || []}
        totalItems={data?.total || 0}
        columns={columns as ColumnDef<Device, any>[]}
        actionBar={actionBar}
        isLoading={isLoading}
        error={error}
        isFilterReady={isFilterReady}
        action={
          <>
            <Button
              variant='default'
              size='sm'
              className='bg-primary hover:bg-primary/90 flex items-center rounded-[6px] text-white'
              onClick={handleRefetch}
            >
              <RefreshCw className='h-4 w-4' />
            </Button>
          </>
        }
      />
    </div>
  );
}
