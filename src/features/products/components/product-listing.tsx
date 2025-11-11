'use client';

import { useSearchParams } from 'next/navigation';
import { ProductTable } from './product-tables';
import { deviceColumns } from './product-tables/device-columns';
import {
  type Device,
  useGetDevices,
  useGetDeviceCount
} from '@/core/domains/devices';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { useGetGroups } from '@/core/domains/groups';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';

type ProductListingPage = {};

export default function ProductListingPage({}: ProductListingPage) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const search = searchParams.get('name');
  const pageLimit = searchParams.get('perPage');
  const dir = searchParams.get('dir') ?? 'desc';
  const order = searchParams.get('order') ?? 'updated_at';
  const status = searchParams.get('status') ?? undefined;
  const type = searchParams.get('type') ?? undefined;
  const serial_number = searchParams.get('serial_number') ?? undefined;

  const currentPage = page ? parseInt(page.toString()) : 1;
  const limit = pageLimit ? parseInt(pageLimit.toString()) : 10;
  const filters = {
    offset: (currentPage - 1) * limit,
    limit,
    ...(search && { name: search }),
    dir: dir === 'asc' ? 'asc' : ('desc' as const),
    order,
    ...(status && { status: status as any }),
    ...(type && { type }),
    ...(serial_number && { serial_number })
  } as const;

  const { data, isLoading, error } = useGetDevices(filters);

  // Fetch device counts
  const { data: onlineData } = useGetDeviceCount(true);
  const { data: offlineData } = useGetDeviceCount(false);

  const { catalogues } = useCatalogueStore();
  const { treeData } = useRegionTreeStore();
  // Fetch groups from API
  const { data: groupsData } = useGetGroups({
    status: 'enabled'
  });

  // Memoize the breadcrumb content to prevent infinite re-renders
  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Thiết bị</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const typeOptions = useMemo(() => {
    return catalogues.map((catalogue) => ({
      label: catalogue.name,
      value: catalogue.type
    }));
  }, [catalogues]);

  const columns = useMemo(() => {
    const _columns = [...deviceColumns];
    let typeColumn = _columns.find((x) => x.id === 'type');
    if (typeColumn && typeColumn.meta) {
      typeColumn.meta.options = typeOptions;
      typeColumn.cell = ({ cell }) => {
        const type = cell.getValue<Device['type']>();
        const option = typeOptions.find((option) => option.value === type);
        return <div>{option?.label}</div>;
      };
    }
    let parentGroupColumn = _columns.find((x) => x.id === 'parent_group_id');
    if (parentGroupColumn && parentGroupColumn.meta) {
      parentGroupColumn.meta.options = treeData.map((node) => ({
        label: node.name,
        value: node.id
      }));
      parentGroupColumn.cell = ({ cell }) => {
        const parent_group_id = cell.getValue<Device['parent_group_id']>();
        const node = groupsData?.groups.find((node) => {
          return node.id === parent_group_id;
        });
        return <div>{node?.name || ''}</div>;
      };
    }
    return _columns;
  }, [typeOptions, treeData, groupsData]);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-96' />
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-16 w-full' />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <h3 className='text-destructive text-lg font-semibold'>
            Error loading products
          </h3>
          <p className='text-muted-foreground text-sm'>
            {error.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className='flex min-h-[700px] w-full flex-col'>
      <ProductTable
        data={(data?.devices as Device[]) || []}
        totalItems={data?.total || 0}
        columns={columns as ColumnDef<Device, any>[]}
        actionBar={actionBar}
      />
    </div>
  );
}
