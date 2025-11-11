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
import { DataTableSelectFilter } from './data-table-select-filter';
import { CalendarRangeFilter } from './date-range-filter';
import { DataTableActionsPopover } from './data-table-actions';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  actions?: React.ReactNode;
  excel?: boolean;
  onDeleteAll?: (selectedRows: TData[]) => Promise<void> | void;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  actions,
  excel,
  onDeleteAll,
  ...props
}: DataTableToolbarProps<TData>) {
  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-center justify-between gap-2',
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
        <DataTableActionsPopover
          table={table}
          excel={excel}
          onDeleteAll={onDeleteAll}
        />
        <DataTableFilterOptions table={table} />
      </div>
    </div>
  );
}

interface DataTableCustomToolbar<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  actions?: React.ReactNode;
  filter?: boolean;
  excel?: boolean;
  onDeleteAll?: (selectedRows: TData[]) => Promise<void> | void;
}

export function DataTableCustomToolbar<TData>({
  table,
  children,
  className,
  actions,
  filter,
  excel,
  onDeleteAll,
  ...props
}: DataTableCustomToolbar<TData>) {
  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const rangePairs = React.useMemo(() => {
    const groups: Record<
      string,
      { from?: Column<TData, unknown>; to?: Column<TData, unknown> }
    > = {};

    columns.forEach((col) => {
      const meta: any = col.columnDef.meta;
      if (!meta) return;

      if (meta.variant === 'dateRangeFrom') {
        const key = meta.rangeGroup ?? col.id;
        groups[key] ??= {};
        groups[key].from = col;
      }

      if (meta.variant === 'dateRangeTo') {
        const key = meta.rangeGroup ?? col.id;
        groups[key] ??= {};
        groups[key].to = col;
      }
    });

    return Object.entries(groups)
      .filter(([, v]) => v.from)
      .map(([key, v]) => ({ key, ...v }));
  }, [columns]);

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  const isFiltered = table.getState().columnFilters.length > 0;
  console.log(rangePairs);
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
        {columns
          .filter((col) => col.id === 'name')
          .map((column) => (
            <DataTableToolbarFilter key={column.id} column={column} />
          ))}

        {columns.map((column) => {
          const meta: any = column.columnDef.meta;

          if (
            meta?.variant === 'dateRangeFrom' ||
            meta?.variant === 'dateRangeTo'
          ) {
            return null;
          }

          if (meta?.variant === 'dateRangeSingle') {
            return <CalendarRangeFilter key={column.id} startColumn={column} />;
          }
        })}

        {rangePairs.map(({ key, from, to }) =>
          from ? (
            <CalendarRangeFilter
              key={`date-range-${key}`}
              startColumn={from}
              endColumn={to}
            />
          ) : null
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
          <DataTableActionsPopover
            table={table}
            excel={excel}
            onDeleteAll={onDeleteAll}
          />
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
