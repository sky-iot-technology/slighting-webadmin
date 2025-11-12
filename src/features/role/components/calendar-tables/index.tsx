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
interface RoleTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}
export function RoleTable<TData, TValue>({
  data,
  totalItems,
  columns
}: RoleTableParams<TData, TValue>) {
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
      status: false
    }
  });

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className=''
      wrapperClassName='mx-1 mt-1 rounded-[4px]'
      tableContainerClassName='!border-y-1 !border-x-0 rounded-none'
      paginationClassName='py-3'
      headerClassName='bg-white'
      rowClassName='text-xs font-normal'
      getRowClassName={(row) => (row.is_deleted ? 'opacity-50' : '')}
    >
      <DataTableCustomToolbar
        table={table}
        className='w-auto'
        actions={
          <Button
            variant='default'
            size='sm'
            className='bg-primary hover:bg-primary/90 flex h-7.5 items-center rounded-[4px] text-white'
            onClick={() => setOpen(true)}
          >
            <IconPlus className='h-3 w-3' />
            Thêm
          </Button>
        }
        filter={true}
        excel={false}
        // onDeleteAll={handleDelete}
      />
      {/* <CalendarDialog
        pageTitle='Thêm lịch'
        open={open}
        onOpenChange={setOpen}
        initialData={{ group_ids: region?.id ? [region.id] : [] }}
      /> */}
    </DataTable>
  );
}
