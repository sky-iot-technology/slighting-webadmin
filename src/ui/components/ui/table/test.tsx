'use client';

import * as React from 'react';
import type { Column, Table } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';
import { CalendarRangePicker } from '@/features/calendar/components/calendar-range-picker';

function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'number' || typeof item === 'string') {
        return item;
      }
      return undefined;
    });
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  return [];
}

function parseAsDate(timestamp: number | string | undefined): Date | undefined {
  if (!timestamp) return undefined;
  const numericTimestamp =
    typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

type CalendarRangeFilterProps<TData> = {
  table: Table<TData>;
  column: Column<TData, unknown>;
  startId?: string;
  endId?: string;
  className?: string;
};

export function CalendarRangeFilter<TData>({
  table,
  column,
  startId = 'startDate',
  endId = 'endDate',
  className
}: CalendarRangeFilterProps<TData>) {
  const columnFilterValue = column.getFilterValue();
  const filters = table.getState().columnFilters;

  const selectedDates = React.useMemo<DateRange>(() => {
    const endCol = table.getColumn(endId);
    const endVal = endCol?.getFilterValue() as number | string | undefined;

    if (!columnFilterValue && !endVal) {
      return { from: undefined, to: undefined };
    }

    const timestamps = parseColumnFilterValue(columnFilterValue);
    return {
      from: parseAsDate(timestamps[0]),
      to: parseAsDate(endVal)
    };
  }, [columnFilterValue, filters]);

  const handleChange = React.useCallback(
    (value?: DateRange) => {
      const startCol = table.getColumn(startId);
      const endCol = table.getColumn(endId);

      if (!value?.from && !value?.to) {
        startCol?.setFilterValue(undefined);
        endCol?.setFilterValue(undefined);
        column.setFilterValue(undefined);
        return;
      }

      let fromTs: number | undefined;
      if (value.from && !isNaN(value.from.getTime())) {
        const startDate = new Date(value.from);
        startDate.setUTCHours(0, 0, 0, 0);
        fromTs = startDate.getTime(); // 👉 timestamp
        startCol?.setFilterValue(fromTs);
      } else {
        startCol?.setFilterValue(undefined);
      }

      let toTs: number | undefined;
      if (value.to && !isNaN(value.to.getTime())) {
        const endDate = new Date(value.to);
        endDate.setUTCHours(23, 59, 59, 999);
        toTs = endDate.getTime(); // 👉 timestamp
        endCol?.setFilterValue(toTs);
      } else {
        endCol?.setFilterValue(undefined);
      }
    },
    [table, column, startId, endId]
  );

  return (
    <CalendarRangePicker
      mode='range'
      value={selectedDates}
      onChange={(value) => handleChange(value as DateRange | undefined)}
      classname={className ?? '!w-[230px]'}
    />
  );
}
