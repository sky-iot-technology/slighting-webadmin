'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';
import {
  DataTableCalendarToolbar,
  DataTableToolbar
} from '@/ui/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import Image from 'next/image';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import CalendarDialog from '../calendar-dialog';
import { Badge } from '@/ui/components/ui/badge';
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
}
export function CalendarTable<TData, TValue>({
  data,
  totalItems,
  columns,
  isSidebarOpen,
  onToggleSidebar,
  region
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

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className='bg-calender-gray'
      wrapperClassName='mx-1 mt-1 rounded-[4px]'
      tableContainerClassName='border-none'
      paginationClassName='py-3'
      headerClassName='bg-white'
      rowClassName='text-xs font-normal'
    >
      <div className='flex items-center gap-2 bg-white'>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className='cursor-pointer rounded p-1 hover:bg-gray-100'
          >
            {isSidebarOpen ? (
              <Image
                src='/assets/icons/chevronLeft.svg'
                alt='chevronLeft'
                width={4.5}
                height={8.25}
              />
            ) : (
              <Image
                src='/assets/icons/chevronRight.svg'
                alt='chevronRight'
                width={4.5}
                height={8.25}
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

        <DataTableCalendarToolbar
          table={table}
          className='w-auto flex-1'
          actions={
            <Button
              variant='default'
              size='sm'
              className='bg-primary hover:bg-primary/90 flex items-center rounded-[6px] text-white'
              onClick={() => setOpen(true)}
            >
              <IconPlus className='h-3 w-3' />
              Thêm
            </Button>
          }
          filter={false}
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
