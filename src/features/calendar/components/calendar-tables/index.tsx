'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';
import {
  DataTableCustomToolbar,
  DataTableToolbar
} from '@/ui/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import Image from 'next/image';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import CalendarDialog from '../modal/calendar-dialog';
import { Badge } from '@/ui/components/ui/badge';
import { useDeleteMultiCalendars } from '@/core/domains/calendars';
import { PermissionGuard, useCan } from '@/core/domains/permissions';
interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  region?: {
    id?: string;
    name?: string;
    icon?: string;
  } | null;
  isLoading?: boolean;
  error?: Error | null;
}
export function CalendarTable<TData, TValue>({
  data,
  totalItems,
  columns,
  isSidebarOpen,
  onToggleSidebar,
  region,
  isLoading = false,
  error = null
}: ProductTableParams<TData, TValue>) {
  const [open, setOpen] = useState(false);

  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => row.schedules,
    getRowCanExpand: (row: any) =>
      Array.isArray(row.original.schedules) && row.original.schedules.length > 0
  });

  const { mutate: deleteCalendars, isPending } = useDeleteMultiCalendars();

  const handleDelete = async (selectedRows: any[]) => {
    if (!selectedRows.length) return;
    const ids = selectedRows.map((r) => r.id as string);
    deleteCalendars(ids);
  };

  const canDelete = useCan('calendar', 'delete');

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className='bg-background'
      wrapperClassName='rounded-[8px] bg-white'
      tableContainerClassName='border-none rounded-none'
      paginationClassName='py-3'
      headerClassName='border-t-1 border-none shadow-none'
      rowClassName='text-xs font-normal bg-white'
      getRowClassName={(row) => (row.is_deleted ? 'opacity-50' : '')}
      isLoading={isLoading}
      error={error}
      loadingRowCount={pageSize}
    >
      <div className='flex flex-col gap-2 bg-white py-3 md:flex-row md:items-center md:gap-2'>
        <div className='flex gap-2'>
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className='min-h-[12px] w-5 min-w-[12px] cursor-pointer rounded p-1 hover:bg-gray-100'
            >
              {isSidebarOpen ? (
                <Image
                  src='/assets/icons/chevronLeft.svg'
                  alt='chevronLeft'
                  width={8}
                  height={8}
                  className='shrink-0'
                />
              ) : (
                <Image
                  src='/assets/icons/chevronRight.svg'
                  alt='chevronRight'
                  width={8}
                  height={8}
                  className='shrink-0'
                />
              )}
            </button>
          )}
          <h3 className='text-xl font-bold'>Danh sách lịch</h3>
          {region && region.icon && (
            <Badge className='bg-gray-1'>
              <Image
                src={region.icon || '/assets/icons/default-region.svg'}
                alt='region icon'
                width={14}
                height={14}
                className='h-[14px] w-[14px]'
              />
              <span className='text-xs text-black'>{region.name}</span>
            </Badge>
          )}
        </div>

        <DataTableCustomToolbar
          table={table}
          className='w-auto flex-1'
          actions={
            <PermissionGuard module='calendar' action='create' fallback={null}>
              <Button
                variant='default'
                size='sm'
                className='bg-primary hover:bg-primary/90 flex h-7.5 items-center rounded-[4px] text-white'
                onClick={() => setOpen(true)}
              >
                <IconPlus className='h-3 w-3' />
                Thêm
              </Button>
            </PermissionGuard>
          }
          filter={false}
          excel={false}
          onDeleteAll={canDelete ? handleDelete : undefined}
        />
      </div>
      <CalendarDialog
        pageTitle='Thêm lịch'
        open={open}
        onOpenChange={setOpen}
        initialData={{ group_ids: region?.id ? [region.id] : [] }}
      />
    </DataTable>
  );
}
