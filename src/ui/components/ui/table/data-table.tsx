import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/ui/components/ui/table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { ScrollArea, ScrollBar } from '@/ui/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/ui/components/ui/skeleton';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  totalRows: number;
  actionBar?: React.ReactNode;
  wrapperClassName?: string; // For table + pagination
  tableContainerClassName?: string; //For scroll
  tableClassName?: string; //For table
  headerClassName?: string; // <TableHeader>
  bodyClassName?: string; // <TableBody>
  rowClassName?: string; // <TableRow>
  cellClassName?: string; // <TableCell>
  paginationClassName?: string; // vùng pagination
  getRowClassName?: (row: TData) => string;
  isLoading?: boolean;
  error?: Error | null;
  loadingRowCount?: number;
  fillAvailableSpace?: boolean;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  totalRows,
  wrapperClassName,
  tableContainerClassName,
  tableClassName,
  headerClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  paginationClassName,
  getRowClassName,
  isLoading = false,
  error = null,
  loadingRowCount = 10,
  fillAvailableSpace = false
}: DataTableProps<TData>) {
  const pageSize = table.getState().pagination.pageSize;
  const isCompact = pageSize <= 10;
  const totalpage = table.getPageCount();

  return (
    <div className={cn('flex flex-1 flex-col', className)}>
      {children}
      {/* Wrapper for table + pagination */}
      <div className={cn('flex flex-1 flex-col rounded-lg', wrapperClassName)}>
        <div
          className={cn(
            (isCompact || (!isCompact && totalpage <= 1)) && !fillAvailableSpace
              ? 'relative flex min-h-0 flex-initial flex-col'
              : 'relative flex flex-1'
          )}
        >
          {/* Table container */}
          <div
            className={cn(
              (isCompact || (!isCompact && totalpage <= 1)) &&
                !fillAvailableSpace
                ? 'flex w-full overflow-hidden rounded-lg border'
                : 'absolute inset-0 flex overflow-hidden rounded-lg border',
              tableContainerClassName
            )}
          >
            <ScrollArea className='h-full w-full'>
              <Table className={cn('', tableClassName)}>
                <TableHeader
                  className={cn(
                    'bg-muted dark:bg-blue-4 sticky top-0 z-10',
                    headerClassName
                  )}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className='data-[state=selected]:bg-calendar-table-select'
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className='text-xs font-bold'
                          style={{
                            ...getCommonPinningStyles({ column: header.column })
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className={cn('bg-card', bodyClassName)}>
                  {isLoading ? (
                    // Loading state: show skeleton rows
                    Array.from({ length: loadingRowCount }).map((_, i) => (
                      <TableRow key={i} className='hover:bg-transparent'>
                        {table.getAllColumns().map((column, j) => (
                          <TableCell key={j} className={cn(cellClassName)}>
                            <Skeleton className='h-6 w-full' />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : error ? (
                    // Error state: show error message
                    <TableRow>
                      <TableCell
                        colSpan={table.getAllColumns().length}
                        className='h-64 text-center'
                      >
                        <div className='flex flex-col items-center justify-center gap-2'>
                          <h3 className='text-destructive text-lg font-semibold'>
                            Lỗi tải dữ liệu
                          </h3>
                          <p className='text-muted-foreground text-sm'>
                            {error.message || 'Đã xảy ra lỗi khi tải dữ liệu'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    // Normal state: show data rows
                    table.getRowModel().rows.map((row) => {
                      const original = row.original as any;
                      const spanColumns = table
                        .getVisibleLeafColumns()
                        .filter((col) => col.id !== 'select').length;
                      if (original?.isProgress) {
                        return (
                          <TableRow
                            key={row.id}
                            className='!border-none hover:!bg-transparent'
                          >
                            <TableCell className='w-[40px] border-none' />
                            <TableCell
                              colSpan={spanColumns}
                              className='px-3 py-1'
                            >
                              <div className='flex w-full items-center gap-2'>
                                {/* Progress bar */}
                                <div className='h-1 flex-1 overflow-hidden rounded bg-gray-200'>
                                  <div
                                    className='bg-map-filter h-1 transition-all'
                                    style={{ width: `${original.progress}%` }}
                                  />
                                </div>

                                {/* Percent text */}
                                <span className='text-muted-foreground text-xs whitespace-nowrap'>
                                  {original.progress}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }
                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                          className={cn(
                            rowClassName,
                            row.depth > 0 && 'bg-calendar-table-children',
                            getRowClassName?.(row.original),
                            'data-[state=selected]:!bg-calendar-table-select'
                          )}
                        >
                          {row.getVisibleCells().map((cell, cellIndex) => (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles({
                                  column: cell.column
                                }),
                                ...(cellIndex === 0 && row.depth > 0
                                  ? { paddingLeft: `${row.depth * 20 + 8}px` }
                                  : {})
                              }}
                              className={cn(cellClassName)}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  ) : (
                    // Empty state
                    <TableRow>
                      <TableCell
                        colSpan={table.getAllColumns().length}
                        className='h-24 text-center'
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </div>
        </div>
        {/* {actionBar && <div className='flex flex-col flex-1 gap-2.5'>{actionBar}</div>} */}
        <div
          className={cn('bg-card flex flex-col gap-2.5', paginationClassName)}
        >
          <DataTablePagination
            table={table}
            totalRows={totalRows}
            actionBar={actionBar}
          />
        </div>
      </div>
    </div>
  );
}
