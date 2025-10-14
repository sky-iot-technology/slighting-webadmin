'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/ui/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/ui/components/ui/popover';
import { cn } from '@/lib/utils';

type CalendarRangePickerProps = {
  mode?: 'single' | 'range';
  value?: DateRange | Date;
  onChange?: (value?: DateRange | Date) => void;
  disabled?: boolean;
  classname?: string;
};

export function CalendarRangePicker({
  mode = 'range',
  value,
  onChange,
  disabled,
  classname
}: CalendarRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (mode === 'range') {
      if (!value) return undefined;
      if (value instanceof Date) return { from: value, to: undefined };
      return value as DateRange;
    }
    return undefined;
  });

  const [singleDate, setSingleDate] = React.useState<Date | undefined>(() => {
    if (mode === 'single') {
      if (!value) return undefined;
      if (value instanceof Date) {
      }
      return (value as DateRange)?.from;
    }
    return undefined;
  });

  React.useEffect(() => {
    if (mode === 'range') {
      if (value && !(value instanceof Date)) {
        setDate(value as DateRange);
      } else {
        setDate(undefined);
      }
    } else if (mode === 'single') {
      if (value instanceof Date) {
        setSingleDate(value);
      } else {
        setSingleDate(undefined);
      }
    }
  }, [value, mode]);

  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);

  // ✅ Handler for "single" mode
  const handleSingleSelect = (selected?: Date) => {
    if (disabled) return;
    setSingleDate(selected);
    onChange?.(selected);
    setOpenFrom(false);
  };

  const handleFromSelect = (selected?: Date) => {
    if (disabled) return;
    const newRange = { from: selected, to: date?.to };
    setDate(newRange);
    onChange?.(newRange);
    setOpenFrom(false);
  };

  const handleToSelect = (selected?: Date) => {
    if (disabled) return;
    const newRange = { from: date?.from, to: selected };
    setDate(newRange);
    onChange?.(newRange);
    setOpenTo(false);
  };

  const formattedFrom = date?.from ? format(date.from, 'dd/MM/yyyy') : '';
  const formattedTo = date?.to ? format(date.to, 'dd/MM/yyyy') : '';
  const formattedSingle = singleDate ? format(singleDate, 'dd/MM/yyyy') : '';

  if (disabled) {
    return (
      <div
        className={cn(
          classname,
          'border-input flex h-[31px] w-[260px] cursor-not-allowed items-center justify-between rounded-[6px] border px-2 text-xs'
        )}
      >
        {mode === 'single' ? (
          <span className='flex-1 text-center font-medium'>
            {formattedSingle || 'Chưa có ngày áp dụng'}
          </span>
        ) : (
          <div className='flex w-full justify-between font-medium text-black'>
            <button className='flex-1 text-center'>{formattedFrom}</button>
            <span className='mx-1'>-</span>
            <button className='flex-1 text-center'>{formattedTo}</button>
          </div>
        )}

        <CalendarIcon className='text-muted-foreground ml-2 h-4 w-4' />
      </div>
    );
  }

  if (mode === 'single') {
    return (
      <div
        className={cn(
          classname,
          'border-input bg-background flex h-[31px] w-[200px] items-center justify-between rounded-[6px] border px-2 text-xs'
        )}
      >
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <button
              type='button'
              className={cn(
                'flex-1 cursor-pointer bg-transparent text-center text-xs font-medium outline-none',
                !formattedSingle && 'text-muted-foreground'
              )}
              onClick={() => setOpenFrom(true)}
            >
              {formattedSingle || 'Chọn ngày áp dụng'}
            </button>
          </PopoverTrigger>
          <PopoverContent align='start' className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={singleDate}
              onSelect={handleSingleSelect}
            />
          </PopoverContent>
        </Popover>

        <CalendarIcon className='text-muted-foreground ml-2 h-4 w-4' />
      </div>
    );
  }

  return (
    <div
      className={cn(
        classname,
        'border-input bg-background flex h-[31px] w-[260px] items-center justify-between rounded-[6px] border px-2 text-xs'
      )}
    >
      {/* Ngày bắt đầu */}
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex-1 cursor-pointer bg-transparent text-center text-xs font-medium outline-none',
              !formattedFrom && 'text-muted-foreground'
            )}
            onClick={() => {
              setOpenFrom(true);
              setOpenTo(false);
            }}
          >
            {formattedFrom || 'Ngày bắt đầu'}
          </button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={date?.from}
            onSelect={handleFromSelect}
          />
        </PopoverContent>
      </Popover>

      <span className='text-muted-foreground mx-1'>-</span>

      {/* Ngày kết thúc */}
      <Popover open={openTo} onOpenChange={setOpenTo}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex-1 cursor-pointer bg-transparent text-center text-xs font-medium outline-none',
              !formattedTo && 'text-muted-foreground'
            )}
            onClick={() => {
              setOpenTo(true);
              setOpenFrom(false);
            }}
          >
            {formattedTo || 'Ngày kết thúc'}
          </button>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={date?.to}
            onSelect={handleToSelect}
          />
        </PopoverContent>
      </Popover>

      <CalendarIcon className='text-muted-foreground ml-2 h-4 w-4' />
    </div>
  );
}
