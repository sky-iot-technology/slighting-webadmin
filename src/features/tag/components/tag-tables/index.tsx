'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';

import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel, Table } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import React from 'react';

interface TagTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  onTableReady?: (table: Table<TData>) => void;
  isLoading?: boolean;
  error?: Error | null;
}
export function TagTable<TData, TValue>({
  data,
  totalItems,
  columns,
  onTableReady,
  isLoading = false,
  error = null
}: TagTableParams<TData, TValue>) {
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

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className=''
      wrapperClassName='rounded-[8px] bg-white'
      tableContainerClassName='!border-y-[1px] !border-x-0 rounded-none'
      paginationClassName='py-3'
      headerClassName='bg-white'
      rowClassName='text-xs font-normal'
      getRowClassName={(row) => (row.is_deleted ? 'opacity-50' : '')}
      isLoading={isLoading}
      error={error}
      loadingRowCount={pageSize}
    ></DataTable>
  );
}
