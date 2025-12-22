'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';

import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel, Table } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import React, { useState } from 'react';
import { DataTableCustomToolbar } from '@/ui/components/ui/table/data-table-toolbar';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import OtaDialog from '../modal/ota-dialog';

interface OtaTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  error?: Error | null;
}
export function OtaTable<TData, TValue>({
  data,
  totalItems,
  columns,
  isLoading = false,
  error = null
}: OtaTableParams<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 200,
    defaultVisibility: {
      dir: false
    }
  });

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className='mt-1'
      wrapperClassName='rounded-[8px]'
      tableContainerClassName='border-none rounded-none'
      paginationClassName='py-3'
      headerClassName='border-t-1 border-none shadow-none'
      rowClassName='text-xs font-normal'
      isLoading={isLoading}
      error={error}
      loadingRowCount={pageSize}
    >
      <div className='flex items-center gap-2 py-3'>
        <DataTableCustomToolbar
          table={table}
          className='flex-1'
          actions={
            <>
              <Button
                variant='default'
                size='sm'
                className='bg-primary hover:bg-primary/90 flex items-center rounded-[4px] text-white'
                onClick={() => setOpen(true)}
              >
                <IconPlus className='h-3 w-3' />
                Thêm
              </Button>
            </>
          }
          onDeleteAll={() => console.log('delete product')}
          filter
        />
      </div>
      <OtaDialog pageTitle='Tạo mới Ota' open={open} onOpenChange={setOpen} />
    </DataTable>
  );
}
