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
  startColumn: Column<TData, unknown>;
  endColumn: Column<TData, unknown>;
  className?: string;
};

export function CalendarRangeFilter<TData>({
  startColumn,
  endColumn,
  className
}: CalendarRangeFilterProps<TData>) {
  const startValue = startColumn.getFilterValue() as
    | number
    | string
    | undefined;
  const endValue = endColumn.getFilterValue() as number | string | undefined;

  const selectedDates = React.useMemo<DateRange>(() => {
    if (!startValue && !endValue) return { from: undefined, to: undefined };

    const timestamps = parseColumnFilterValue(startValue);
    const timestamps2 = parseColumnFilterValue(endValue);

    return {
      from: parseAsDate(timestamps[0]),
      to: parseAsDate(timestamps2[0])
    };
  }, [startValue, endValue]);

  const handleChange = React.useCallback(
    (value?: DateRange) => {
      const from = value?.from;
      const to = value?.to;

      if (!from || !to) {
        startColumn?.setFilterValue(undefined);
        endColumn?.setFilterValue(undefined);
        return;
      }

      const isValidFrom = !isNaN(from.getTime());
      const isValidTo = !isNaN(to.getTime());

      if (isValidFrom && isValidTo) {
        const fromDate = new Date(from);
        fromDate.setUTCHours(0, 0, 0, 0);

        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);

        startColumn?.setFilterValue(fromDate.getTime());
        endColumn?.setFilterValue(toDate.getTime());
      } else {
        startColumn?.setFilterValue(undefined);
        endColumn?.setFilterValue(undefined);
      }
    },
    [startColumn, endColumn]
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
