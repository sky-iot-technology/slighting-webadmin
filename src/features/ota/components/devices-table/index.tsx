'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';
import { Table } from '@tanstack/react-table';
import React from 'react';

interface DeviceTableParams<TData, TValue> {
  table: Table<TData>;
  totalItems: number;
  isLoading?: boolean;
  error?: Error | null;
  onSelectionChange?: (ids: string[]) => void;
  action?: React.ReactNode;
}
export function DeviceTable<TData, TValue>({
  table,
  totalItems,
  onSelectionChange,
  isLoading = false,
  error = null,
  action
}: DeviceTableParams<TData, TValue>) {
  React.useEffect(() => {
    if (!onSelectionChange) return;

    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row: any) => row.original.id as string);

    onSelectionChange(selectedIds);
  }, [table.getState().rowSelection, table.options.data]);

  return (
    <DataTable
      table={table}
      totalRows={table.getFilteredRowModel().rows.length}
      className='mt-1'
      wrapperClassName='rounded-[8px]'
      tableContainerClassName='border-none rounded-none'
      paginationClassName='py-3'
      headerClassName='border-none shadow-none'
      rowClassName='text-sm font-normal !border-none'
      isLoading={isLoading}
      error={error}
      loadingRowCount={table.getState().pagination.pageSize}
    ></DataTable>
  );
}
