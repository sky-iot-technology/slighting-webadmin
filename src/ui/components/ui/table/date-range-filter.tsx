'use client';

import * as React from 'react';
import type { Column } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';
import { CalendarRangePicker } from '@/features/calendar/components/calendar-range-picker';
import { utcToLocal } from '@/features/calendar/helper';

function parseAsDate(value: string | number | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function toIsoStartOfDayUTC(d: Date): string {
  return new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
  ).toISOString();
}
function toIsoEndOfDayUTC(d: Date): string {
  return new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
  ).toISOString();
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
  const startValue = startColumn.getFilterValue();
  const endValue = endColumn.getFilterValue();

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => ({
      from: parseAsDate(String(startValue))
        ? utcToLocal(parseAsDate(String(startValue))!)
        : undefined,
      to: parseAsDate(String(endValue))
        ? utcToLocal(parseAsDate(String(endValue))!)
        : undefined
    })
  );

  React.useEffect(() => {
    const fromDate = parseAsDate(String(startValue));
    const toDate = parseAsDate(String(endValue));

    const isSame =
      fromDate?.toISOString() === dateRange?.from?.toISOString() &&
      toDate?.toISOString() === dateRange?.to?.toISOString();

    if (!isSame) {
      setDateRange({
        from: fromDate ? utcToLocal(fromDate) : undefined,
        to: toDate ? utcToLocal(toDate) : undefined
      });
    }
  }, [startValue, endValue]);

  const handleSelect = React.useCallback(
    (value?: DateRange) => {
      setDateRange(value);

      const from = value?.from;
      const to = value?.to;

      if (!from && !to) {
        startColumn.setFilterValue(undefined);
        endColumn.setFilterValue(undefined);
        return;
      }

      const isValidFrom = from && !isNaN(from.getTime());
      const isValidTo = to && !isNaN(to.getTime());
      if (!isValidFrom || !isValidTo) return;

      const fromISO = toIsoStartOfDayUTC(from);
      const toISO = toIsoEndOfDayUTC(to);

      startColumn.setFilterValue(fromISO);
      endColumn.setFilterValue(toISO);
    },
    [startColumn, endColumn]
  );

  return (
    <CalendarRangePicker
      mode='range'
      value={dateRange}
      onChange={(value) => handleSelect(value as DateRange | undefined)}
      className={className ?? '!w-[230px]'}
    />
  );
}
