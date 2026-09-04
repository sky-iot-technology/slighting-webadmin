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
import { useProductParams } from '../hooks/use-product-params';
import { DataTableSkeleton } from '@/ui/components/ui/table/data-table-skeleton';
import { MultiDeviceActions } from './multi-device-actions';
import { Table } from '@tanstack/react-table';

type ProductListingPage = {};

export default function ProductListingPage({}: ProductListingPage) {
  const { t, tTime } = useTranslation();

  // Initialize persistence hook to restore/save params
  const { isReady } = useProductParams();

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
  const asset_status = searchParams.get('asset_status') ?? undefined;

  const { treeData } = useRegionTreeStore();

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;
  // Fetch device counts with filters (excluding pagination)
  const filtersExcludePagination = {
    ...(search && { name: search }),
    ...(status && { metadata: status as any }),
    ...(asset_status && { status: asset_status as any }),
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

  function parseStatus(status?: string) {
    if (!status) return undefined;

    try {
      const decoded = decodeURIComponent(status).replace(/\+/g, ' ');
      return JSON.parse(decoded)?.device_info?.online;
    } catch (e) {
      console.error('Parse status failed:', status);
      return undefined;
    }
  }

  const statusFilter = useMemo(() => {
    return parseStatus(status);
  }, [status]);

  const { data, isLoading, error, refetch } = useGetDevices(filters, {
    enabled: isReady
  });

  const { data: onlineData, refetch: refetchOnline } = useGetDeviceCount(
    true,
    filtersExcludePagination,
    {
      enabled: isReady && (statusFilter === undefined || statusFilter === true)
    }
  );
  const { data: offlineData, refetch: refetchOffline } = useGetDeviceCount(
    false,
    filtersExcludePagination,
    {
      enabled: isReady && (statusFilter === undefined || statusFilter === false)
    }
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
    return deviceColumns(t, tTime).map((col) => {
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
  }, [typeOptions, t]);

  const isFilterReady = typeOptions.length > 0;

  const { lightsOn, lightsOff } = useMemo(() => {
    let on = 0;
    let off = 0;
    const devicesList = (data?.devices as Device[]) || [];
    devicesList.forEach((device) => {
      const controllable = (device.devices || []).filter(
        (d) => d.type === 'lms.devices.types.LIGHT'
      );
      controllable.forEach((sub) => {
        if (sub.last_state?.on === true) {
          on++;
        } else {
          off++;
        }
      });
    });
    return { lightsOn: on, lightsOff: off };
  }, [data?.devices]);

  const actionBar = (
    <div className='ml-2 flex flex-wrap items-center gap-3 py-2 sm:gap-4 md:ml-4 md:gap-6'>
      {/* Online Status */}
      <div className='flex items-center gap-1.5 sm:gap-2'>
        <div className='h-2.5 w-2.5 rounded-full bg-green-500 sm:h-3 sm:w-3' />
        <span className='text-xs font-medium sm:text-sm'>
          {t('products.status.online' as any)}: {onlineData?.total ?? 0}
        </span>
      </div>

      {/* Offline Status */}
      <div className='flex items-center gap-1.5 sm:gap-2'>
        <div className='h-2.5 w-2.5 rounded-full bg-red-500 sm:h-3 sm:w-3' />
        <span className='text-xs font-medium sm:text-sm'>
          {t('products.status.offline' as any)}: {offlineData?.total ?? 0}
        </span>
      </div>

      {/* Total Status */}
      <div className='flex items-center gap-1.5 sm:gap-2'>
        <div className='flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-green-300 sm:h-3 sm:w-3'>
          <div className='h-1 w-1 rounded-full bg-red-500' />
        </div>
        <span className='text-xs font-medium sm:text-sm'>
          {t('products.status.total' as any)}:{' '}
          {(onlineData?.total ?? 0) + (offlineData?.total ?? 0)}
        </span>
      </div>

      {/* Lights On */}
      {/* <div className='flex items-center gap-1.5 sm:gap-2'>
        <div className='h-2.5 w-2.5 rounded-full bg-emerald-500 sm:h-3 sm:w-3' />
        <span className='text-xs font-medium sm:text-sm'>
          {t('products.status.lights_on' as any)}: {lightsOn}
        </span>
      </div> */}

      {/* Lights Off */}
      {/* <div className='flex items-center gap-1.5 sm:gap-2'>
        <div className='h-2.5 w-2.5 rounded-full bg-amber-500 sm:h-3 sm:w-3' />
        <span className='text-xs font-medium sm:text-sm'>
          {t('products.status.lights_off' as any)}: {lightsOff}
        </span>
      </div> */}
    </div>
  );

  const handleRefetch = async () => {
    toast.success(t('products.message.sync_initiated' as any));
    const promises = [refetch()];

    if (statusFilter === undefined || statusFilter === true) {
      promises.push(refetchOnline());
    }

    if (statusFilter === undefined || statusFilter === false) {
      promises.push(refetchOffline());
    }

    await Promise.all(promises);
  };

  if (!isReady) {
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;
  }

  return (
    <div className='mt-1 flex h-full w-full flex-col'>
      <ProductTable
        data={(data?.devices as Device[]) || []}
        totalItems={data?.total || 0}
        columns={columns as ColumnDef<Device, any>[]}
        actionBar={actionBar}
        isLoading={isLoading}
        error={error}
        isFilterReady={isFilterReady}
        action={(table: Table<Device>) => (
          <div className='flex items-center gap-2'>
            <MultiDeviceActions table={table} />
            <Button
              variant='default'
              size='sm'
              className='bg-primary hover:bg-primary/90 flex h-7.5 items-center rounded-[6px] text-white'
              onClick={handleRefetch}
            >
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
