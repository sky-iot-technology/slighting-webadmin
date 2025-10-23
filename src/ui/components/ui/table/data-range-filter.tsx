'use client';

import * as React from 'react';
import type { Column, Table } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';
import { CalendarRangePicker } from '@/features/calendar/components/calendar-range-picker';
import { utcToLocal } from '@/features/calendar/helper';

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

function parseAsDate(value: string | number | undefined): Date | undefined {
  if (!value) return undefined;
  if (typeof value === 'number') return new Date(value);
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
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
      from: utcToLocal(parseAsDate(timestamps[0])),
      to: utcToLocal(parseAsDate(timestamps2[0]))
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
        const fromDate = new Date(
          Date.UTC(
            from.getFullYear(),
            from.getMonth(),
            from.getDate(),
            0,
            0,
            0,
            0
          )
        ).toISOString();

        const toDate = new Date(
          Date.UTC(
            to.getFullYear(),
            to.getMonth(),
            to.getDate(),
            23,
            59,
            59,
            999
          )
        ).toISOString();

        startColumn?.setFilterValue(fromDate);
        endColumn?.setFilterValue(toDate);
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
