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
  paginationClassName
}: DataTableProps<TData>) {
  return (
    <div className={cn('flex flex-1 flex-col', className)}>
      {children}
      {/* Wrapper for table + pagination */}
      <div
        className={cn(
          'flex flex-1 flex-col rounded-lg bg-white',
          wrapperClassName
        )}
      >
        <div className='relative flex flex-1'>
          {/* Table container */}
          <div
            className={cn(
              'absolute inset-0 flex overflow-hidden rounded-lg border',
              tableContainerClassName
            )}
          >
            <ScrollArea className='h-full w-full'>
              <Table className={cn('', tableClassName)}>
                <TableHeader
                  className={cn('bg-muted sticky top-0 z-10', headerClassName)}
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
                <TableBody className={cn('', bodyClassName)}>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn(
                          'data-[state=selected]:bg-calendar-table-select',
                          rowClassName,
                          row.depth > 0 && 'bg-calendar-table-children'
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
                    ))
                  ) : (
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
        <div className={cn('flex flex-col gap-2.5', paginationClassName)}>
          <DataTablePagination table={table} totalRows={totalRows} />
          {actionBar &&
            table.getFilteredSelectedRowModel().rows.length > 0 &&
            actionBar}
        </div>
      </div>
    </div>
  );
}
