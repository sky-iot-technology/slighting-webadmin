'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';

import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel, Table } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import React from 'react';

interface MaintenanceTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  onTableReady?: (table: Table<TData>) => void;
  isLoading?: boolean;
  error?: Error | null;
  onSelectionChange?: (ids: string[]) => void;
  fillAvailableSpace?: boolean;
}
export function MaintenanceTable<TData, TValue>({
  data,
  totalItems,
  columns,
  onTableReady,
  isLoading = false,
  error = null,
  onSelectionChange,
  fillAvailableSpace = false
}: MaintenanceTableParams<TData, TValue>) {
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
      dir: false
    }
  });

  React.useEffect(() => {
    if (onTableReady) {
      onTableReady(table);
    }
  }, [table, onTableReady]);

  React.useEffect(() => {
    if (!onSelectionChange) return;

    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id as string);

    onSelectionChange(selectedIds);
  }, [table.getState().rowSelection, table.options.data]);

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
      getRowClassName={(row) => (row.is_deleted ? 'opacity-50' : '')}
      isLoading={isLoading}
      error={error}
      loadingRowCount={pageSize}
      fillAvailableSpace={fillAvailableSpace}
    ></DataTable>
  );
}
