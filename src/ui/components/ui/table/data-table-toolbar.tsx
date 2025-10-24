'use client';

import type { Column, Table } from '@tanstack/react-table';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/ui/components/ui/input';
import { DataTableDateFilter } from '@/ui/components/ui/table/data-table-date-filter';
import { DataTableFacetedFilter } from '@/ui/components/ui/table/data-table-faceted-filter';
import { DataTableSliderFilter } from '@/ui/components/ui/table/data-table-slider-filter';
import { DataTableFilterOptions } from './data-table-filter-options';
import { Button } from '@/ui/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { AnimatedSearchInput } from './animated-search-input';
import { ScrollArea } from '../scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { FilterIcon } from 'lucide-react';
import { Separator } from '../separator';
import { DataTableSelectFilter } from './data-table-select-filter';
import { CalendarRangeFilter } from './data-range-filter';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  actions,
  ...props
}: DataTableToolbarProps<TData>) {
  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        {/* {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))} */}
      </div>
      <div className='flex items-center gap-2'>
        {actions}
        {children}
        <DataTableFilterOptions table={table} />
      </div>
    </div>
  );
}

interface DataTableCustomToolbar<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  actions?: React.ReactNode;
  filter?: boolean;
}

export function DataTableCalendarToolbar<TData>({
  table,
  children,
  className,
  actions,
  filter,
  ...props
}: DataTableCustomToolbar<TData>) {
  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  const startColumn = table.getColumn('startDate');
  const endColumn = table.getColumn('endDate');
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 flex-wrap items-center justify-end gap-2'>
        {/* Nút mở bộ lọc */}
        {columns
          .filter((col) => col.id === 'name')
          .map((column) => (
            <DataTableToolbarFilter key={column.id} column={column} />
          ))}

        {startColumn && endColumn && (
          <CalendarRangeFilter
            key='dateRange'
            startColumn={startColumn}
            endColumn={endColumn}
          />
        )}
        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='outline'
            size='sm'
            className='border-dashed'
            onClick={onReset}
          >
            <Cross2Icon />
          </Button>
        )}
        <div className='flex items-center gap-2'>
          {actions}
          {children}
          {filter && <DataTableFilterOptions table={table} />}
        </div>
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column
}: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta;

    const onFilterRender = React.useCallback(() => {
      if (!columnMeta?.variant) return null;

      switch (columnMeta.variant) {
        case 'text':
          return (
            <AnimatedSearchInput column={column} columnMeta={columnMeta} />
          );
        // return (
        //   <Input
        //     placeholder={columnMeta.placeholder ?? columnMeta.label}
        //     value={(column.getFilterValue() as string) ?? ''}
        //     onChange={(event) => column.setFilterValue(event.target.value)}
        //     className='h-8 w-40 lg:w-56 rounded-md'
        //   />
        // );

        case 'number':
          return (
            <div className='relative'>
              <Input
                type='number'
                inputMode='numeric'
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className={cn('h-8 w-[120px]', columnMeta.unit && 'pr-8')}
              />
              {columnMeta.unit && (
                <span className='bg-accent text-muted-foreground absolute top-0 right-0 bottom-0 flex items-center rounded-r-md px-2 text-sm'>
                  {columnMeta.unit}
                </span>
              )}
            </div>
          );

        case 'range':
          return (
            <DataTableSliderFilter
              column={column}
              title={columnMeta.label ?? column.id}
            />
          );

        case 'date':
          return (
            <DataTableDateFilter
              column={column}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === 'date'}
            />
          );
        case 'dateRange':
          return (
            <DataTableDateFilter
              column={column}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === 'dateRange'}
            />
          );
        case 'select':
        case 'multiSelect':
          return (
            <DataTableFacetedFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              multiple={columnMeta.variant === 'multiSelect'}
            />
          );
        case 'selectSimple':
          return (
            <DataTableSelectFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              placeholder={columnMeta.placeholder ?? 'Tất cả'}
            />
          );

        default:
          return null;
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}
