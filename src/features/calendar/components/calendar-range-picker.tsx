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
  value?: DateRange | undefined;
  onChange?: (value?: DateRange) => void;
  disabled?: boolean;
  disablePastDate?: boolean;
  className?: string;
  textClassname?: string;
};

export function CalendarRangePicker({
  mode = 'range',
  value,
  onChange,
  disabled,
  disablePastDate,
  className,
  textClassname
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
      setDate(value);
    } else if (mode === 'single') {
      if (value?.from) setSingleDate(value.from);
      else setSingleDate(undefined);
    }
  }, [value, mode]);

  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);

  //for checking past-date
  const isPastDate = React.useCallback(
    (date?: Date) => {
      if (!disablePastDate || !date) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      return checkDate < today;
    },
    [disablePastDate]
  );

  const handleSingleSelect = (selected?: Date) => {
    if (disabled || isPastDate(selected)) return;
    if (selected === undefined) {
      setSingleDate(undefined);
      onChange?.(undefined);
      return;
    }
    if (isPastDate(selected)) return;
    const newRange = { from: selected, to: undefined };
    setSingleDate(selected);
    onChange?.(newRange);
    setOpenFrom(false);
  };

  const handleFromSelect = (selected?: Date) => {
    if (disabled || isPastDate(selected)) return;
    if (selected === undefined) {
      const newRange = { from: undefined, to: date?.to };
      setDate(newRange);
      onChange?.(newRange);
      return;
    }
    let from = selected;
    let to = date?.to;

    if (to && from > to) {
      [from, to] = [to, from];
    }
    const newRange = { from, to };
    setDate(newRange);
    onChange?.(newRange);
    setOpenFrom(false);
  };

  const handleToSelect = (selected?: Date) => {
    if (disabled || isPastDate(selected)) return;
    if (selected === undefined) {
      const newRange = { from: date?.from, to: undefined };
      setDate(newRange);
      onChange?.(newRange);
      return;
    }
    let from = date?.from;
    let to = selected;

    if (from && from > to) {
      [from, to] = [to, from];
    }

    const newRange = { from, to };
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
          className,
          'border-input bg-muted text-muted-foreground flex h-[31px] w-[260px] cursor-not-allowed items-center justify-between rounded-[6px] border px-2 text-xs opacity-50'
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
          className,
          'border-input bg-background flex h-[31px] items-center rounded-[6px] border px-2 text-xs',
          'w-[36px] justify-center lg:w-[200px] lg:justify-between'
        )}
        onClick={() => setOpenFrom(true)}
      >
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <button
              type='button'
              className={cn(
                textClassname,
                'hidden flex-1 cursor-pointer bg-transparent text-left text-xs font-medium outline-none lg:block',
                !formattedSingle && 'text-muted-foreground'
              )}
            >
              {formattedSingle || 'Chọn ngày áp dụng'}
            </button>
          </PopoverTrigger>

          <PopoverContent align='start' className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={singleDate}
              onSelect={handleSingleSelect}
              disablePastDate={disablePastDate}
            />
          </PopoverContent>
        </Popover>

        {!formattedSingle ? (
          <CalendarIcon className='text-muted-foreground h-4 w-4 cursor-pointer' />
        ) : (
          <>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium lg:hidden'>
                {formattedSingle}
              </span>
              <CalendarIcon className='text-muted-foreground h-4 w-4 cursor-pointer' />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        className,
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
            disablePastDate={disablePastDate}
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
            disablePastDate={disablePastDate}
          />
        </PopoverContent>
      </Popover>

      <CalendarIcon className='text-muted-foreground ml-2 h-4 w-4' />
    </div>
  );
}
