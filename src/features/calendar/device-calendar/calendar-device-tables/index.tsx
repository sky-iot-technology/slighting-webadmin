'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';
import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import CalendarDeviceDialog from '../modal/calendar-device-dialog';
import { DataTableCustomToolbar } from '@/ui/components/ui/table/data-table-toolbar';

interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  clientId: string;
}
export function CalendarTable<TData, TValue>({
  data,
  totalItems,
  columns,
  clientId
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
      Array.isArray(row.original.schedules) &&
      row.original.schedules.length > 0,
    defaultVisibility: {
      status: false,
      group: false
    }
  });

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className=''
      wrapperClassName='mx-1 mt-1 rounded-none'
      tableContainerClassName='border-none rounded-none'
      paginationClassName='py-3'
      headerClassName='bg-white border-t-1'
      rowClassName='text-xs font-normal'
      getRowClassName={(row) => (row.is_deleted ? 'opacity-50' : '')}
    >
      <div className='flex items-center gap-2 bg-white'>
        <DataTableCustomToolbar
          table={table}
          className='w-auto flex-1'
          actions={
            <Button
              variant='default'
              size='sm'
              className='bg-primary hover:bg-primary/90 flex !h-7.5 items-center rounded-[6px] text-white'
              onClick={() => setOpen(true)}
            >
              <IconPlus className='h-3 w-3' />
              Thêm
            </Button>
          }
          filter={true}
        />
        {/* <DataTableToolbar table={table} /> */}
      </div>
      <CalendarDeviceDialog
        pageTitle='Thêm lịch'
        open={open}
        onOpenChange={setOpen}
        initialData={{ client_id: clientId }}
      />
    </DataTable>
  );
}
