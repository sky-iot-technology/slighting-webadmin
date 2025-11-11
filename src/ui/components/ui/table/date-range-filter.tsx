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
  endColumn?: Column<TData, unknown> | null;
  className?: string;
};

export function CalendarRangeFilter<TData>({
  startColumn,
  endColumn,
  className
}: CalendarRangeFilterProps<TData>) {
  const startValue = startColumn.getFilterValue();
  const endValue = endColumn
    ? (endColumn.getFilterValue() as string | undefined)
    : undefined;

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      let from: Date | undefined;
      let to: Date | undefined;
      if (typeof startValue === 'string' && startValue.includes(',')) {
        const [fromStr, toStr] = startValue.split(',');
        from = parseAsDate(fromStr);
        to = parseAsDate(toStr);
      } else {
        from = parseAsDate(String(startValue));
        to = parseAsDate(String(endValue));
      }

      return {
        from: from ? utcToLocal(from) : undefined,
        to: to ? utcToLocal(to) : undefined
      };
    }
  );

  React.useEffect(() => {
    if (!startValue && !endValue) {
      setDateRange(undefined);
      return;
    }

    let fromDate: Date | undefined;
    let toDate: Date | undefined;
    if (typeof startValue === 'string' && startValue.includes(',')) {
      const [fromStr, toStr] = startValue.split(',');
      fromDate = parseAsDate(fromStr);
      toDate = parseAsDate(toStr);
    } else if (
      typeof startValue === 'object' &&
      startValue !== null &&
      'from' in startValue
    ) {
      const sv = startValue as { from?: string; to?: string };
      fromDate = parseAsDate(sv.from);
      toDate = parseAsDate(sv.to);
    } else {
      fromDate = parseAsDate(String(startValue));
      toDate = parseAsDate(String(endValue));
    }

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
        if (endColumn) endColumn.setFilterValue(undefined);
        return;
      }

      const isValidFrom = from && !isNaN(from.getTime());
      const isValidTo = to && !isNaN(to.getTime());
      if (!isValidFrom || !isValidTo) return;

      const fromISO = toIsoStartOfDayUTC(from);
      const toISO = toIsoEndOfDayUTC(to);

      if (endColumn) {
        startColumn.setFilterValue(fromISO ?? undefined);
        endColumn.setFilterValue(toISO ?? undefined);
      } else {
        startColumn.setFilterValue(
          fromISO && toISO ? `${fromISO},${toISO}` : fromISO
        );
      }
    },
    [startColumn, endColumn]
  );

  return (
    <CalendarRangePicker
      mode='range'
      value={dateRange}
      onChange={(value) => handleSelect(value as DateRange | undefined)}
      className={className ?? '!h-7.5 !w-[230px] !rounded-[4px]'}
    />
  );
}
