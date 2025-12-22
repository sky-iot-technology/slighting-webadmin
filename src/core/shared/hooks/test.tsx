'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import * as React from 'react';

interface UseClientDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  initialPageSize?: number;
  defaultVisibility?: VisibilityState;
  enableRowSelection?: (row: any) => boolean;
}

export function useClientDataTable<TData, TValue>({
  data,
  columns,
  initialPageSize = 10,
  defaultVisibility = {},
  enableRowSelection
}: UseClientDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultVisibility);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row: any) => row.id,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,

    onRowSelectionChange: setRowSelection,
    enableRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualPagination: false,
    manualSorting: false,
    manualFiltering: false
  });

  return { table };
}
