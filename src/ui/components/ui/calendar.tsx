'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import 'react-day-picker/style.css';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomScrollbar from '../custom-scrollbar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useTranslation } from '@/core/domains/language/useTranslation';

type CalendarProps = ComponentProps<typeof DayPicker> & {
  disablePastDate?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  disablePastDate = false,
  ...props
}: CalendarProps) {
  const { t, language } = useTranslation();
  const [month, setMonth] = React.useState(new Date());

  const [internalSelected, setInternalSelected] = React.useState<
    Date | undefined
  >(undefined);
  const selected = (props as any).selected ?? internalSelected;
  const onSelect = (props as any).onSelect ?? setInternalSelected;

  const isPastDate = React.useCallback(
    (date: Date) => {
      if (!disablePastDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate < today;
    },
    [disablePastDate]
  );

  const modifiers = React.useMemo(
    () => ({
      past: isPastDate
    }),
    [isPastDate]
  );

  const goPrev = () => {
    const m = new Date(month);
    m.setMonth(month.getMonth() - 1);
    setMonth(m);
  };

  const goNext = () => {
    const m = new Date(month);
    m.setMonth(month.getMonth() + 1);
    setMonth(m);
  };

  const locale = language === 'vi' ? 'vi-VN' : 'en-US';

  return (
    <div className={cn('p-4 text-xs leading-[22px]', className)}>
      <div className='mb-3 flex items-center justify-between pl-3'>
        <div className='flex items-center text-[14px] font-bold'>
          <span className='leading-none'>{t('general.year')}</span>
          <YearSelect
            value={month.getFullYear()}
            onChange={(year) => {
              const newMonth = new Date(month);
              newMonth.setFullYear(year);
              setMonth(newMonth);
            }}
          />
        </div>

        <div className='flex items-center gap-1.5'>
          <button
            onClick={goPrev}
            className='hover:bg-accent flex size-6 items-center justify-center rounded-md'
          >
            <ChevronLeft className='size-4' />
          </button>
          <span className='min-w-[70px] text-center text-[14px] font-bold'>
            {month.toLocaleString(locale, { month: 'long' })}
          </span>
          <button
            onClick={goNext}
            className='hover:bg-accent flex size-6 items-center justify-center rounded-md'
          >
            <ChevronRight className='size-4' />
          </button>
        </div>
      </div>

      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays
        hideNavigation
        className='text-[14px] [&_.rdp-day_button]:size-6'
        classNames={{
          caption_label: 'hidden',
          month_caption: 'hidden',
          day_disabled: 'text-muted-foreground opacity-50 cursor-not-allowed',
          day: cn(
            'rdp-day font-normal',
            disablePastDate &&
              '[&[data-past="true"]]:opacity-40 [&[data-past="true"]]:cursor-not-allowed'
          )
        }}
        modifiers={modifiers}
        footer={
          <div className='mt-2 flex items-center justify-between px-4'>
            <button
              onClick={() => onSelect(undefined)}
              className='text-muted-foreground hover:text-foreground cursor-pointer text-xs'
            >
              {t('general.delete')}
            </button>
            <button
              onClick={() => {
                const today = new Date();
                setMonth(today);
                onSelect(today);
              }}
              className='text-primary cursor-pointer text-xs font-medium'
            >
              {t('general.today')}
            </button>
          </div>
        }
        disabled={disablePastDate ? { before: new Date() } : undefined}
        {...props}
      />
    </div>
  );
}

function YearSelect({
  value,
  onChange
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const container = scrollRef.current;
      if (!container) {
        return;
      }

      const active = container.querySelector<HTMLButtonElement>(
        `[data-year="${value}"]`
      );

      if (active) {
        const offsetTop =
          active.offsetTop -
          container.clientHeight / 2 +
          active.clientHeight / 2;
        container.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [value, isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className='flex cursor-pointer items-center gap-0.5 rounded-md px-1 py-1 text-[14px] font-bold'>
          {value}
          <ChevronDown className='size-4' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[70px] overflow-hidden p-0 shadow-none'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <CustomScrollbar
          ref={scrollRef}
          className='max-h-[200px] overflow-y-auto'
        >
          <div className='flex flex-col'>
            {Array.from({ length: 50 }).map((_, i) => {
              const year = 2000 + i;
              return (
                <button
                  key={year}
                  data-year={year}
                  onClick={() => {
                    onChange(year);
                    setIsOpen(false);
                  }}
                  className={`hover:bg-accent px-2 py-1 text-left text-[14px] ${
                    value === year ? 'bg-accent font-bold' : ''
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </CustomScrollbar>
      </PopoverContent>
    </Popover>
  );
}

export { Calendar };
