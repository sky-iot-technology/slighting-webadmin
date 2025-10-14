'use client';

import { useSearchParams } from 'next/navigation';
import { ProductTable } from './product-tables';
import { deviceColumns } from './product-tables/device-columns';
import { type Device, useGetDevices } from '@/core/domains/devices';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

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

  const columns = useMemo(() => {
    const _columns = [...deviceColumns];
    let typeColumn = _columns.find((x) => x.id === 'type');
    if (typeColumn && typeColumn.meta) {
      typeColumn.meta.options = [
        { label: 'LIGHT', value: 'lms.devices.types.LIGHT' },
        { label: 'SWITCH', value: 'lms.devices.types.SWITCH' }
      ];
    }
    return _columns;
  }, []);

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

  return (
    <ProductTable
      data={(data?.devices as Device[]) || []}
      totalItems={data?.total || 0}
      columns={columns as ColumnDef<Device, any>[]}
    />
  );
}
